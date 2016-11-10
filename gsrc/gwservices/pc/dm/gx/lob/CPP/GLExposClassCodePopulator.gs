package gwservices.pc.dm.gx.lob.CPP

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.gx.lob.cpp.glexposuremodel.anonymous.elements.GLExposure_ClassCode
uses gwservices.pc.dm.gx.entitypopulators.StaticEntityPopulator
uses gw.lang.reflect.IType
uses gw.lang.reflect.features.PropertyReference
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/8/16
 * Time: 2:51 AM
 * To change this template use File | Settings | File Templates.
 */
class GLExposClassCodePopulator extends StaticEntityPopulator<GLClassCode, KeyableBean>{

  override function getLookupEntityType(modelType: IType): IType {
    return GLClassCode
  }

  override function getLookupProperty(modelType: IType): PropertyReference<Object, Object> {
    return GLClassCode#Code
  }

  override function getLookupKey(model: XmlElement): Object {
    if (model typeis GLExposure_ClassCode) {
      return model.Code
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }

}