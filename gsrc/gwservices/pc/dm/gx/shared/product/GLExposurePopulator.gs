package gwservices.pc.dm.gx.shared.product

uses gw.xml.XmlElement
uses gw.pl.persistence.core.Bundle
//uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_GeneralLiabilityLine_GLExposuresWM_Entry
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.lob.gl.GeneralLiabilityLineEnhancement
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.types.complex.PolicyLine_Entity_GeneralLiabilityLine
uses gw.api.database.Query
//uses gwservices.pc.dm.gx.lob.cpp.glexposuremodel.anonymous.elements.GLExposure_LocationWM
uses gwservices.pc.dm.gx.lob.cpp.glexposuremodel.anonymous.elements.GLExposure_ClassCode
uses gwservices.pc.dm.gx.shared.policy.policylinemodel.anonymous.elements.PolicyLine_Entity_GeneralLiabilityLine_Exposures_Entry
uses gwservices.pc.dm.gx.lob.cpp.glexposuremodel.anonymous.elements.GLExposure_Location

/**
 * Created with IntelliJ IDEA.
 * User: sboyapati
 * Date: 11/8/16
 * Time: 2:24 AM
 * To change this template use File | Settings | File Templates.
 */
class GLExposurePopulator extends BaseEntityPopulator<GLExposure, KeyableBean >{


  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): GLExposure {

    if(model typeis PolicyLine_Entity_GeneralLiabilityLine_Exposures_Entry) {
      var gl = (GeneralLiabilityLine)parent
      var glExpo : GLExposure = gl.addExposureWM()

      var BasisAmt = model.$Children.firstWhere( \ elt -> elt.QName.LocalPart == "BasisAmount").Text
      //glExpo.BasisAmount = BasisAmount
      var expoLocationVM = model.$Children.firstWhere( \ elt -> elt.QName.LocalPart == "Location")
      var policyLoc : PolicyLocation
      if(expoLocationVM typeis GLExposure_Location ){
        var locationNum = expoLocationVM.LocationNum
        var expLocationVM = Branch.PolicyLocations.firstWhere( \ elt -> elt.LocationNum == locationNum)
        policyLoc = expLocationVM
      }
      var glClass : String
      var glClassCode = model.$Children.firstWhere( \ elt -> elt.QName.LocalPart == "ClassCode")
      var code : String
      if(glClassCode typeis GLExposure_ClassCode){
         code = glClassCode.Code
      }
      var lookUpRecord = (Query.make(entity.GLClassCode).compare("Code", Equals, code).select().AtMostOneRow) as entity.GLClassCode
      glExpo.BasisAmount = BasisAmt
      glExpo.Location = policyLoc.Unsliced
      glExpo.ClassCode = lookUpRecord
      /*var newExposure = gl.addExposureWM()
      newExposure.LocationWM = policyLoc
      newExposure.ClassCode = lookUpRecord
      newExposure.BasisAmount = BasisAmount*/

      return glExpo
    }
    return null
  }

  override function addToParent(parent:KeyableBean, child:entity.GLExposure, name:String, model:XmlElement)  {
     //
  }
}