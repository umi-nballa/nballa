package gwservices.pc.dm.gx.shared.general

uses gw.lang.reflect.IType
uses gw.lang.reflect.features.PropertyReference
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_IndustryCode
uses gwservices.pc.dm.gx.entitypopulators.StaticEntityPopulator

class IndustryCodePopulator extends StaticEntityPopulator {
  override function getLookupEntityType(modelType: IType): IType {
    return IndustryCode
  }

  override function getLookupProperty(modelType: IType): PropertyReference<Object, Object> {
    return IndustryCode#Code
  }

  override function getLookupKey(model: XmlElement): Object {
    if (model typeis Account_IndustryCode) {
      return model.Code
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }
}