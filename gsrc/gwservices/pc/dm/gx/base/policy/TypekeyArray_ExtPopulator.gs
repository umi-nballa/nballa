package gwservices.pc.dm.gx.base.policy

uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.gx.lob.ho.dwelling_hoemodel.anonymous.elements.Dwelling_HOE_PlumbingTypes_Ext

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 9/26/17
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */
class TypekeyArray_ExtPopulator extends BaseEntityPopulator <TypekeyArray_Ext,Dwelling_HOE>{

  override function create(model: XmlElement, parent: Dwelling_HOE, bundle: Bundle): TypekeyArray_Ext {
    if (model typeis Dwelling_HOE_PlumbingTypes_Ext) {
      var plumbingTypes = new TypekeyArray_Ext()
      for (typecode in model.TypeCodes.Entry) {
        plumbingTypes.addToTypeCodes(typekey.PlumbingType_HOE.get(typecode.Code))
      }
      return plumbingTypes
    }
    return null
  }

  override function findEntity(model: XmlElement, parent: Dwelling_HOE, bundle: Bundle): TypekeyArray_Ext {
    return null
  }

}