package gwservices.pc.dm.gx.shared.general

uses gw.lang.reflect.IType
uses gw.lang.reflect.features.PropertyReference
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_UWCompany
uses gwservices.pc.dm.gx.entitypopulators.StaticEntityPopulator

class UWCompanyPopulator extends StaticEntityPopulator {
  override function getLookupEntityType(modelType: IType): IType {
    return UWCompany
  }

  override function getLookupProperty(modelType: IType): PropertyReference<Object, Object> {
    return UWCompany#Code
  }

  override function getLookupKey(model: XmlElement): Object {
    if (model typeis PolicyPeriod_UWCompany) {
      return model.Code
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }
}
