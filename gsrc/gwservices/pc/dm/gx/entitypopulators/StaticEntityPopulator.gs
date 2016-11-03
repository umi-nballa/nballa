package gwservices.pc.dm.gx.entitypopulators

uses gw.api.database.Query
uses gw.lang.reflect.IType
uses gw.lang.reflect.ITypeInfo
uses gw.lang.reflect.features.PropertyReference
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE

/**
 * Populates static entities (entities that are not updated by migration)
 */
abstract class StaticEntityPopulator<C extends KeyableBean, P extends KeyableBean> extends BaseEntityPopulator<C, P> {
  override function initialize(xmlTypeInfo: ITypeInfo) {
  }

  /**
   * Return lookup entity type for a particular model type
   */
  abstract function getLookupEntityType(modelType: IType): IType

  /**
   * Return lookup property for a particular model type
   */
  abstract function getLookupProperty(modelType: IType): PropertyReference

  /**
   * Return lookup key for a particular model type
   */
  abstract function getLookupKey(model: XmlElement): Object

  override function findEntity(model: XmlElement, parent: P, bundle: Bundle): C {
    var modelType = model.IntrinsicType
    var entityType = getLookupEntityType(modelType)
    var entityProperty = getLookupProperty(modelType).PropertyInfo.Name
    var entityKey = getLookupKey(model)
    if (entityType == null or entityProperty == null or entityKey == null) {
      throw new DataMigrationNonFatalException(CODE.GENERAL, "unexpected model type ${typeof(model)}")
    }
    var lookUpRecord = (Query.make(entityType).compare(entityProperty, Equals, entityKey).select().AtMostOneRow) as C
    var policy = this.Branch
    if( lookUpRecord typeis OfferingLookup){
      policy.Offering = gw.api.productmodel.OfferingLookup.getByCode(lookUpRecord.OfferingCode)
    }
    return lookUpRecord as C
  }

  override function create(model: XmlElement, parent: P, bundle: Bundle): C {
    var modelType = model.IntrinsicType
    var entityType = getLookupEntityType(modelType)
    var entityProperty = getLookupProperty(modelType)
    var entityKey = getLookupKey(model)
    if (entityType != null and entityProperty != null and entityKey != null) {
      var msg = "type ${modelType}, property ${entityProperty.PropertyInfo.Name}, key ${entityKey}"
      throw new DataMigrationNonFatalException(CODE.MISSING_STATIC_ENTITY, msg)
    } else {
      return null
    }
  }

  override function populate(model: XmlElement, entity: C) {
    // do not populate static entities
  }

  override function remove(parent: P, child: C, bundle: Bundle) {
    // do not remove static entities
  }

  override function findAndRemove(parent: P, publicId: String, prop: String, entityType: IType, bundle: Bundle) {
    // do not remove static entities
  }
}