package gwservices.pc.dm.gx.shared.general

uses gw.lang.reflect.IType
uses gw.lang.reflect.features.PropertyReference
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.StaticEntityPopulator
uses gwservices.pc.dm.gx.shared.general.activitymodel.anonymous.elements.Activity_AssignedGroup

class GroupPopulator extends StaticEntityPopulator {
  override function getLookupEntityType(modelType: IType): IType {
    return Group
  }

  override function getLookupProperty(modelType: IType): PropertyReference<Object, Object> {
    return Group#Name
  }

  override function getLookupKey(model: XmlElement): Object {
    if (model typeis Activity_AssignedGroup) {
      return model.Name
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }
}