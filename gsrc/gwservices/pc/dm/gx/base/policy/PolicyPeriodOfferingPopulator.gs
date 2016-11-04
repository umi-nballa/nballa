package gwservices.pc.dm.gx.base.policy

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.entitypopulators.StaticEntityPopulator
uses gw.lang.reflect.IType
uses gw.lang.reflect.features.PropertyReference
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Offering
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gw.api.productmodel.Offering

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/2/16
 * Time: 8:44 AM
 * To change this template use File | Settings | File Templates.
 */
class PolicyPeriodOfferingPopulator extends StaticEntityPopulator {

  override function getLookupEntityType(modelType: IType): IType {
    return OfferingLookup
  }

  override function getLookupProperty(modelType: IType): PropertyReference<Object, Object> {
    return OfferingLookup#OfferingCode
  }

  override function getLookupKey(model: XmlElement): Object {
    if (model typeis PolicyPeriod_Offering) {
      return model.Code
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }

}