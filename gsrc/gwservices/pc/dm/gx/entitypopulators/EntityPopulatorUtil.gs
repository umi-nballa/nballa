package gwservices.pc.dm.gx.entitypopulators

uses gw.lang.reflect.IType
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.util.DMLogger

uses java.util.Map

/**
 * Utilities for populating entities
 */
class EntityPopulatorUtil {
  /** BasedOn suffix */
  private final static var _BASED_ON = "_BasedOn"
  /** Logging prefix */
  private static final var _LOG_TAG = "${EntityPopulatorUtil.Type.RelativeName} - "
  /** Parent identifier in properties */
  private static final var _PARENT_TAG = "_ENTITY_PARENT"
  /** Logging instance */
  private var _logger = DMLogger.GX
  /** Registered populators */
  private var _registry: Registry
  /** Migration entity IDs  */
  private var _modifiedEntities: Map<MigrationEntityIDDTO, List<MigrationEntityIDDTO>>
  /** Prior transaction entity IDs  */
  private var _priorTransactionEntities: Map<MigrationEntityIDDTO, List<MigrationEntityIDDTO>>
  /** Cached items used by populators */
  private var _cachedItems: Map <String, Object> as CachedItems = {}
  construct(registry: Registry) {
    this._registry = registry
  }

  /**
   * Recursively populate parent and children
   */
  function populate(xml: XmlElement, record: MigrationRecord, bundle: Bundle): KeyableBean {
    this._priorTransactionEntities = record.MigrationEntityIDs
    this._modifiedEntities = {}
    var result = recurse(xml, xml.QName.LocalPart, null, bundle)
    // reset cached items to avoid updating same entities
    _cachedItems = {}
    record.MigrationEntityIDs = _modifiedEntities
    return result
  }

  /**
   * Get a populator from the registry
   */
  private function getPopulator(xmlType: IType): IEntityPopulator {
    if (xmlType.toString().endsWith(_BASED_ON)) {
      return null
    }
    if (_registry.DoNotPopulate.contains(xmlType)) {
      if (_logger.isInfoEnabled()) {
        _logger.info(_LOG_TAG + "getPopulator do not populate ${xmlType}")
      }
      return null
    }
    var populator = _registry.getPopulator(xmlType)
    if (populator == null) {
      if (_logger.isInfoEnabled()) {
        _logger.info(_LOG_TAG + "getPopulator using default populator for ${xmlType}")
      }
      populator = new BaseEntityPopulator()
      populator.initialize(xmlType.TypeInfo)
      _registry.setPopulator(xmlType, populator)
    }
    return populator
  }

  /**
   * Convenience
   */
  private function recurse(xml: XmlElement, name: String, parent: KeyableBean, bundle: Bundle): KeyableBean {
    if (_logger.isDebugEnabled()) {
      _logger.debug(_LOG_TAG + "recurse populate for ${typeof(xml)}")
    }
    var populator = getPopulator(typeof(xml))
    if (populator == null) {
      return null
    }
    if (populator typeis BaseEntityPopulator) {
      populator.CachedItems = _cachedItems
    }
    populator.validate(xml)
    var entity = populator.findEntity(xml, parent, bundle)
    if (entity typeis Account) {
      _cachedItems.put(BaseEntityPopulator.ACCOUNT_PROPERTY, entity)
    } else if (entity typeis PolicyPeriod) {
      _cachedItems.put(BaseEntityPopulator.ACCOUNT_PROPERTY, entity.Policy.Account)
    }
    var removeEntity = findElement("DMRemoveEntity_Ext", xml)
    if (removeEntity.SimpleValue.GosuValue as Boolean) {
      populator.remove(parent, entity, bundle)
      return entity as KeyableBean
    }
    if (removeEntity != null) {
      xml.removeChild(removeEntity.QName)
    }
    if (entity == null) {
      entity = populator.create(xml, parent, bundle)
    }
    if (entity != null) {
      var GLLine:GeneralLiabilityLine = null
      if(!(entity typeis GLExposure)){
        populator.populate(xml, entity)
      }
      if (not this._registry.DoNotAutoDelete.contains(xml.IntrinsicType)) {
        var parentDTO = new MigrationEntityIDDTO(parent)
        var entityList = _modifiedEntities.get(parentDTO)
        if (entityList == null) {
          entityList = {}
          _modifiedEntities.put(parentDTO, entityList)
        }
        var propName = populator.getPropertyName(xml, parent)
        entityList.add(new MigrationEntityIDDTO(entity as KeyableBean, xml.IntrinsicType, propName))
      }
    }
    if (_logger.isDebugEnabled()) {
      _logger.debug(_LOG_TAG + "recurse children for ${typeof(xml)}")
    }
    var children = xml.Children
    var subtypeElement = findElement("Subtype", xml)
    if (subtypeElement != null) {
      var subtype = findElement("entity-${subtypeElement.Text}", xml)
      if (subtype.Children.HasElements) {
        children = children.copy()
        children.addAll(subtype.Children)
      }
    }
    for (child in populator.sortChildrenForPopulation(children)) {
      // ignore subtypes (handled in populate)
      if (child.QName.LocalPart.contains("entity-")) continue
      // ignore simple children and removes (which are handled in populate statement)
      if (child.SimpleValue != null or child.Nil) continue
      if (_logger.isDebugEnabled()) {
        _logger.debug(_LOG_TAG + "process child for ${child}")
      }
      // if this is an array, handle it as such
      if (child.Children.first().QName.LocalPart == "Entry") {
        for (arrayItem in populator.sortChildrenForPopulation(child.Children)) {
          recurse(arrayItem, child.QName.LocalPart, entity as KeyableBean, bundle)
        }
      } else {
        recurse(child, child.QName.LocalPart, entity as KeyableBean, bundle)
      }
    }
    populator.addToParent(parent, entity, name, xml)
    populator.finish(xml, parent, entity)
    autoDelete(entity as KeyableBean, xml, bundle)
    return entity as KeyableBean
  }

  /**
   * Convenience. Find an element by name, ignoring of namespaces
   */
  private function findElement(name: String, xml: XmlElement): XmlElement {
    return xml.Children.firstWhere(\elt -> elt.QName.LocalPart == name)
  }

  /**
   * Automatically remove children that aren't
   */
  private function autoDelete(parent: KeyableBean, xml: XmlElement, bundle: Bundle) {
    var parentKey = new MigrationEntityIDDTO(parent)
    var priorEntities = _priorTransactionEntities?.get(parentKey)
    if (priorEntities.HasElements) {
      var currentEntities = _modifiedEntities?.get(parentKey)
      if (currentEntities != null) {
        var deltas = priorEntities?.subtract(currentEntities)
        if (_logger.DebugEnabled) {
          priorEntities.each(\pr -> _logger.debug(_LOG_TAG + "autoDelete prior entity ${pr}"))
          currentEntities.each(\ce -> _logger.debug(_LOG_TAG + "autoDelete current entity ${ce}"))
          deltas.each(\d -> _logger.debug(_LOG_TAG + "autoDelete delta ${d}"))
        }
        for (mei in deltas) {
          var populator = getPopulator(mei.XMLModelType)
          if (_logger.InfoEnabled) {
            _logger.info(_LOG_TAG + "autoDelete remove ${mei}")
          }
          populator.findAndRemove(parent, mei.EntityID, mei.PropertyName, mei.EntityType, bundle)
        }
      }
    }
  }
}
