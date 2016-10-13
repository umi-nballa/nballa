package gwservices.pc.dm.gx.shared.covereditem

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.cpp.cpbuildingmodel.anonymous.elements.CPBuilding_ClassCode
uses gwservices.pc.dm.gx.entitypopulators.StaticEntityPopulator
uses gw.lang.reflect.IType
uses gw.lang.reflect.features.PropertyReference
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 9/29/16
 * Time: 9:41 AM
 * To change this template use File | Settings | File Templates.
 */
class CPBuildingClassCodePopulator extends StaticEntityPopulator<CPClassCode, KeyableBean>{

  override function getLookupEntityType(modelType: IType): IType {
    return CPClassCode
  }

  override function getLookupProperty(modelType: IType): PropertyReference<Object, Object> {
    return CPClassCode#Code
  }

  override function getLookupKey(model: XmlElement): Object {
    if (model typeis CPBuilding_ClassCode) {
      return model.Code
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }

}