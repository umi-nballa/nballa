package gwservices.pc.dm.gx.entitypopulators

uses com.gwservices.pc.dm.exception.DAException
uses gw.api.database.Query
uses gw.lang.reflect.IConstructorHandler
uses gw.lang.reflect.IType
uses gw.lang.reflect.ITypeInfo
uses gw.lang.reflect.TypeSystem
uses gw.lang.reflect.features.PropertyReference
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.util.DMLogger
uses org.slf4j.Logger

uses java.lang.IllegalArgumentException
uses java.util.Map
uses gw.api.productmodel.Offering

/**                                                                              n
 * This is the default populator, which all entity specific implementations extend
 */
class BaseEntityPopulator<C extends KeyableBean, P extends KeyableBean> implements IEntityPopulator<C, P> {
  /* Account entity */
  public final static var ACCOUNT_PROPERTY: String = "_Account"
  /* BasedOn element name */
  private final static var _BASED_ON = "BasedOn"
  /** Entry name for array values */
  private final static var _ENTRY = "Entry"
  /* PolicyPeriod entity for effective dated entities */
  public final static var POLICY_PERIOD_PROPERTY: String = "_Branch"
  /* Logging prefix */
  private final static var _LOG_TAG = "${BaseEntityPopulator.Type.RelativeName} - "
  /* PublicID element name */
  private final static var _PUBLIC_ID = "PublicID"
  /** Subtype element name */
  private final static var _SUBTYPE_ID = "Subtype"
  /** Logging instance */
  protected var _logger: Logger as GXLog = DMLogger.GX
  /** Cached constructors for performance */
  private var _constructors: Map <IType, IConstructorHandler> as readonly EntityConstructors = {}
  /** The entity type handled by this populator */
  private var _entityType: IType as readonly EntityType
  /** Does this XML model have a "BasedOn" public ID element */
  private var _hasBasedOnPublicIdElement: boolean as readonly HasBasedOnPublicIdElement
  /** Does this XML model have a public ID element */
  private var _hasPublicIdElement: boolean as readonly HasPublicIdElement
  /** Is this XML model effective dated */
  private var _isEffDated: boolean as readonly IsEffDated
  /** Entity cachedItems, for reflective lookups */
  private var _entityProperties: Map <IType, List <String>> = {}
  /**
   * Cached item map. Use this to store items that are needed between populators and are not available
   * hierarchically.
   */
  private var _cachedItems: Map <String, Object> as CachedItems = {}
  override function initialize(xmlTypeInfo: ITypeInfo) {
    if (_logger.isDebugEnabled()) {
      _logger.debug(_LOG_TAG + "initialize for ${xmlTypeInfo}")
    }
    _entityType = Registry.getBackingType(xmlTypeInfo.OwnersType)
    if (_entityType == null) {
      throw new DAException("No backing entity type found for model ${xmlTypeInfo.OwnersType}")
    }
    _isEffDated = EffDated.Type.isAssignableFrom(_entityType)
    _hasPublicIdElement = xmlTypeInfo.getProperty(_PUBLIC_ID) != null
    var basedOn = xmlTypeInfo.getProperty(_BASED_ON)
    if (basedOn != null) {
      _hasBasedOnPublicIdElement = xmlTypeInfo.getProperty(_PUBLIC_ID) != null
    }
  }

  override function validate(model: XmlElement) {
    // implemented on custom populators
  }

  override function getPropertyName(model: XmlElement, parent: P): String {
    var simpleName = model.QName.LocalPart
    if (parent != null and getEntityProperties(parent.IntrinsicType).contains(simpleName)) {
      return simpleName
    }
    var relativeName = (typeof(model)).RelativeName
    if (relativeName.endsWith(_ENTRY) and relativeName.contains("_")) {
      // TODO is there a better way to look these up?
      var split = relativeName.split("_")
      return split[split.Count - 2]
    }
    return relativeName
  }

  override function findEntity(model: XmlElement, parent: P, bundle: Bundle): C {
    // try to find on the existing entity
    var propertyName = getPropertyName(model, parent)
    if (parent != null and getEntityProperties(parent.IntrinsicType).contains(propertyName)) {
      var result = parent.getFieldValue(propertyName)
      if (result != null and result typeis C)   {
        if (_logger.WarnEnabled) {
          var modelId = findElement("PublicID", model).Text
          if (modelId != null and result.PublicID != null and modelId != result.PublicID) {
            if (result typeis EffDated and result.BasedOnUntyped == null) {
              var msg = "findEntity PublicID mismatch on new ${typeof(result)}, entity = "
              msg += "${result.PublicID}, model = ${modelId}. This can occur if a default one-to-one "
              msg += "value is added through base product or migration and improperly referenced."
              _logger.warn(_LOG_TAG + msg)
            }
          }
        }
        return result
      }
    }
    if (not _hasPublicIdElement) {
      var msg = "No PublicID defined for ${typeof(model)}, "
      msg += "please create custom populator and override findEntity function"
      throw new DAException(msg)
    }
    // now try using the publicID
    var publicId = findElement(_PUBLIC_ID, model).SimpleValue.GosuValue as String
    var basedOnPublicID = findElement(_PUBLIC_ID, findElement(_BASED_ON, model)).SimpleValue.GosuValue as String
    if (GXLog.isDebugEnabled()) {
      var msg = "findEntity public ID ${publicId} or basedOn public ID ${basedOnPublicID}, type ${_entityType}"
      GXLog.debug(_LOG_TAG + msg)
    }
    var result: KeyableBean
    var subtype = findElement(_SUBTYPE_ID, model).SimpleValue.GosuValue
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "findEntity property name ${propertyName}, entity type ${_entityType}")
      _logger.debug(_LOG_TAG + "findEntity public ID ${publicId}, BasedOn ID ${basedOnPublicID}")
      _logger.debug(_LOG_TAG + "findEntity subtype " + typeof(subtype))
    }
    var entityType = subtype != null ? TypeSystem.getByRelativeName(subtype as String) : null
    result = findInArray(publicId, basedOnPublicID, parent, propertyName, entityType)
    if (result != null and _logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "found result in array ${result}")
    }
    if (result == null and basedOnPublicID.HasContent) {
      result = findById(basedOnPublicID, _entityType, bundle) as KeyableBean
      if (result != null and _logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "found result by BasedOn ID ${result}")
      }
    }
    if (result == null and publicId.HasContent) {
      result = findById(publicId, _entityType, bundle) as KeyableBean
      if (result != null and _logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "found result by public ID ${result}")
      }
    }
    if (result == null and _logger.DebugEnabled) {
      var msg = "findById no hit for public ID ${publicId} or basedOn public ID ${basedOnPublicID}, type ${_entityType}"
      _logger.debug(_LOG_TAG + msg)
    }
    return bundle.add(result) as C
  }

  override function create(model: XmlElement, parent: P, bundle: Bundle): C {
    var entityType = _entityType
    var subtypeElement = findElement(_SUBTYPE_ID, model)
    if (subtypeElement != null) {
      entityType = TypeSystem.getByRelativeName(subtypeElement.Text)
    }
    if (_logger.isDebugEnabled()) {
      _logger.debug(_LOG_TAG + "create entity of type ${entityType}")
    }
    var constructor = getConstructor(entityType)
    if (_isEffDated) {
      var branch = Branch
      if (branch == null) {
        throw new DAException("Must add branch with key ${POLICY_PERIOD_PROPERTY} to populate effective dated entities")
      }
      if (_logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "created effective dated entity")
      }
      return bundle.add(constructor.newInstance({branch}) as C)
    } else {
      if (_logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "created standard entity")
      }
      return bundle.add(constructor.newInstance(null) as C)
    }
  }

  override function populate(model: XmlElement, entity: C) {
    valuePopulate(model, entity)
    var subtypeElement = findElement(_SUBTYPE_ID, model)
    if (subtypeElement != null) {
      var subtype = findElement("entity-${subtypeElement.Text}", model)
      valuePopulate(subtype, entity)
    }
  }

  override function sortChildrenForPopulation(children: List <XmlElement>): List <XmlElement> {
    return children
  }

  override function addToParent(parent: P, child: C, name: String, childModel: XmlElement) {
    if (GXLog.isDebugEnabled()) {
      GXLog.debug(_LOG_TAG + "addToParent populate ${name} on ${typeof(parent)} with ${typeof(child)}")
    }
    var childElementName = childModel.QName.LocalPart
    var inArray = childElementName == _ENTRY and childElementName != name
    if (parent != null and child != null) {
      if (inArray) {
        var childArray = parent.getFieldValue(name) as KeyableBean[]
        if (not childArray.contains(child)) {
          var key = "addTo${name}"
          var addToMethod = Registry.getCachedMethod(parent.IntrinsicType, key, \type, signature -> {
            var addTos = type.TypeInfo.Methods.getMethods(signature).where(\elt -> {
              var params = elt.Parameters
              return params.Count == 1 and params.first().FeatureType.isAssignableFrom(typeof(child))
            })
            if (addTos.Count != 1) {
              throw new DAException("Unable to find function addTo${name} on ${typeof(parent)}")
            }
            return addTos[0]
          })
          try {
            addToMethod.CallHandler.handleCall(parent, {child})
          } catch (iae: IllegalArgumentException) {
            if (iae.Message.contains("Can't add a bean with a different branch")) {
              var msg = "attempted to add type of ${typeof(child)} with id ${child.PublicID} to parent ${typeof(parent)}"
              msg += " with id ${parent.PublicID}. Possible reference to prior transaction. XML ${childModel.asUTFString()}"
              throw new DataMigrationNonFatalException(CODE.INCORRECT_BRANCH, msg)
            } else throw iae
          }
        }
      } else {
        try {
          if(!name.equalsIgnoreCase("Offering"))
            parent.setFieldValue(name, child)
        } catch (iae: IllegalArgumentException) {
          if (iae.Message.contains("Can't add a bean with a different branch")) {
            var msg = "attempted to add type of ${typeof(child)} with id ${child.PublicID} to parent ${typeof(parent)}"
            msg += " with id ${parent.PublicID}. Possible reference to prior transaction. XML ${childModel.asUTFString()}"
            throw new DataMigrationNonFatalException(CODE.INCORRECT_BRANCH, msg)
          } else throw iae
        }
      }
    }
  }

  override function finish(model: XmlElement, parent: P, child: C) {
    // not implemented here
  }

  override function remove(parent: P, child: C, bundle: Bundle) {
    if (child != null) {
      if (child typeis EffDated and not child.Slice) {
        child = child.getSliceUntyped(child.EffectiveDate) as C
      }
      if (child.Bundle != bundle) {
        child = bundle.add(child)
      }
      child.remove()
    }
  }

  override function findAndRemove(parent: P, publicId: String, prop: String, entityType: IType, bundle: Bundle) {
    var child: C
    if (GXLog.isDebugEnabled()) {
      var msg = "findAndRemove public ID ${publicId}, type ${entityType}, property name ${prop}"
      GXLog.debug(_LOG_TAG + msg)
    }
    if (getEntityProperties(parent.IntrinsicType).contains(prop)) {
      // direct onetoone reference
      var oneToOneresult = parent.getFieldValue(prop)
      if (oneToOneresult typeis C) {
        child = oneToOneresult
      }
    }
    if (child == null) {
      // now try finding it in a property array
      var arrayResult = findInArray(publicId, publicId, parent, prop, entityType)
      if (arrayResult typeis C) {
        child = arrayResult
      }
    }
    if (child == null) {
      // now try direct query
      var findResult = findById(publicId, entityType, bundle)
      if (findResult typeis C) {
        child = findResult
      }
    }
    if (child == null) {
      var msg = "public ID ${publicId}, property name ${prop}, type ${entityType}"
      throw new DataMigrationNonFatalException(CODE.MISSING_CHILD, msg)
    } else {
      remove(parent, child, bundle)
    }
  }

  /**
   * Convenience
   */
  protected function findElement(reference: PropertyReference, xml: XmlElement): XmlElement {
    return findElement(reference.PropertyInfo.DisplayName, xml)
  }

  /**
   * Convenience. Find entity by id.
   */
  protected function findById(model: XmlElement, entityType: IType, bundle: Bundle): Bean {
    if (_hasPublicIdElement) {
      var publicId = findElement(_PUBLIC_ID, model).SimpleValue.GosuValue as String
      return findById(publicId, entityType, bundle)
    } else {
      return null
    }
  }

  /**
   * Convenience. Load a user
   */
  protected function findUser(model: XmlElement): User {
    var user = findElement(User#Credential, model)
    var userName = findElement(Credential#UserName, user).SimpleValue.GosuValue as String
    var qry = Query.make(User).join(User#Credential)
    qry.compare(Credential#UserName, Equals, userName)
    return qry.select().FirstResult
  }

  /**
   * Convenience. Mimics SimpleValuePopulator
   */
  protected function valuePopulate(source: XmlElement, target: Object) {
    if (target typeis KeyableBean) {
      for (child in source.Children) {
        var fieldName = child.QName.LocalPart
        if (child.Nil) {
          target.setFieldValue(fieldName, null)
        } else if (child.SimpleValue != null && fieldName != "BasisAmount") {
          target.setFieldValue(fieldName, child.SimpleValue.GosuValue)
        }
      }
    }
  }

  /**
   * Retrieve the account from cached items.
   */
  protected property get WorkingAccount(): Account {
    var errorBlock = \-> "unable to retrieve account from properties"
    return getRequiredField(ACCOUNT_PROPERTY, CODE.MISSING_ACCOUNT, errorBlock) as Account
  }

  /**
   * Retrieve the policy period from cached items. For effective dated work.
   * TODO rename
   */
  protected property get Branch(): PolicyPeriod {
    var errorBlock = \-> "unable to retrieve policy period from properties"
    return getRequiredField(POLICY_PERIOD_PROPERTY, CODE.MISSING_POLICY, errorBlock) as PolicyPeriod
  }

  /**
   * Is element not null
   */
  protected function isNotNull(xml: XmlElement): boolean {
    return xml != null and not xml.Nil
  }

  /**
   * Is element null
   */
  protected function isNull(xml: XmlElement): boolean {
    return not isNotNull(xml)
  }

  /**
   * Convenience. Find an element by name, ignoring of namespaces
   */
  protected function findElement(name: String, xml: XmlElement): XmlElement {
    return xml.Children?.firstWhere(\child -> child.QName.LocalPart == name)
  }

  /**
   * Convenience
   */
  private function getRequiredField(key: String, errorCode: CODE, errorMessage: block(): String): Object {
    var prop = CachedItems.get(key)
    if (prop == null) {
      throw new DataMigrationNonFatalException(errorCode, errorMessage())
    }
    return prop
  }

  /**
   * Convenience. Find entity by public id.
   */
  private function findById(publicId: String, entityType: IType, bundle: Bundle): Bean {
    if (publicId.HasContent) {
      var idQuery = Query.make(entityType).compare(_PUBLIC_ID, Equals, publicId)
      var result = idQuery.select().AtMostOneRow
      if (result == null) {
        // potentially new entity, look in the bundle
        result = bundle.InsertedBeans.firstWhere(\e -> {
          return e.PublicID == publicId and entityType.isAssignableFrom(typeof(e))
        })
      }
      return result
    }
    return null
  }

  /**
   * Convenience. Get cached version of constructor.
   */
  private function getConstructor(entityType: IType): IConstructorHandler {
    if (_constructors.containsKey(entityType)) {
      return _constructors.get(entityType)
    }
    var constructors = entityType.TypeInfo.Constructors
    var constructor: IConstructorHandler
    if (EffDated.Type.isAssignableFrom(entityType)) {
      constructor = constructors.firstWhere(\elt -> {
        return elt.Parameters.Count == 1 and elt.Parameters.first().FeatureType == PolicyPeriod
      }).Constructor
    } else {
      constructor = constructors.firstWhere(\elt -> elt.Parameters.Count == 0).Constructor
    }
    if (constructor == null) {
      throw new DAException("Could not find constructor for ${typeof(_entityType)}")
    }
    _constructors.put(entityType, constructor)
    return constructor
  }

  /**
   * Find an entity in a property array
   */
  private function findInArray(publicId: String, basedOn: String, parent: KeyableBean, propName: String,
                               entityType: IType): KeyableBean {
    if (getEntityProperties(parent.IntrinsicType)?.contains(propName)) {
      var value = parent.getFieldValue(propName)
      if (value typeis KeyableBean[]) {
        var array = value as KeyableBean[]
        for (child in array) {
          if (entityType != null and not entityType.isAssignableFrom(child.IntrinsicType)) continue
          if (publicId != null and child.PublicID == publicId) {
            if (_logger.DebugEnabled) {
              _logger.debug(_LOG_TAG + "found ${child} of type ${typeof(child)} from PublicID")
            }
            return child
          }
          if (child typeis EffDated and basedOn != null and child.BasedOnUntyped.PublicID == basedOn) {
            if (_logger.DebugEnabled) {
              _logger.debug(_LOG_TAG + "found ${child} of type ${typeof(child)} from BasedOn.PublicID")
              _logger.debug(_LOG_TAG + "basedon publicID ${child.BasedOnUntyped.PublicID}, current ${basedOn}")
            }
            return child
          }
        }
      }
    }
    return null
  }

  /**
   * Cache entity cached items
   * TODO share this between populators
   */
  private function getEntityProperties(entityType: IType): List <String> {
    var properties = _entityProperties.get(entityType)
    if (not properties.HasElements) {
      if (entityType != null and KeyableBean.Type.isAssignableFrom(entityType)) {
        var allProperties = entityType.TypeInfo.Properties
        properties = allProperties.whereTypeIs(gw.entity.IEntityPropertyInfo)*.Name.toList()
        _entityProperties.put(entityType, properties)
      }
    }
    return properties
  }
}
