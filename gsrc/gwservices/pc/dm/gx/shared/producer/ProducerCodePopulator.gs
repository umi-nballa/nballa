package gwservices.pc.dm.gx.shared.producer

uses gw.lang.reflect.IType
uses gw.lang.reflect.features.PropertyReference
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_ProducerCodeOfRecord
uses gwservices.pc.dm.gx.entitypopulators.StaticEntityPopulator
uses gwservices.pc.dm.gx.shared.producer.accountproducercodemodel.anonymous.elements.AccountProducerCode_ProducerCode

class ProducerCodePopulator extends StaticEntityPopulator {
  override function getLookupEntityType(modelType: IType): IType {
    return ProducerCode
  }

  override function getLookupProperty(modelType: IType): PropertyReference<Object, Object> {
    return ProducerCode#Code
  }

  override function getLookupKey(model: XmlElement): Object {
    if (model typeis PolicyPeriod_ProducerCodeOfRecord) {
      return model.Code
    } else if (model typeis AccountProducerCode_ProducerCode) {
      return model.Code
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }
}
