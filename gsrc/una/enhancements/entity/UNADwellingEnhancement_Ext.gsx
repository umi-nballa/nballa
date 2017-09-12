package una.enhancements.entity

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 9/9/17
 * Time: 1:04 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNADwellingEnhancement_Ext : entity.Dwelling_HOE {
  property set HasCopperPlumbingType(copperExists : boolean){
    updatePlumbingTypeExistence(tc_copper, copperExists)
  }

  property get HasCopperPlumbingType() : boolean{
    return this.PlumbingTypes_Ext.TypeCodes?.contains(PlumbingType_HOE.TC_COPPER)
  }

  property set HasGalvanizedPlumbingType(galvanizedExists : boolean){
    updatePlumbingTypeExistence(tc_galv, galvanizedExists)
  }

  property get HasGalvanizedPlumbingType() : boolean{
    return this.PlumbingTypes_Ext.TypeCodes?.contains(PlumbingType_HOE.TC_GALV)
  }

  property get HasPVCPlumbingType() : boolean{
    return this.PlumbingTypes_Ext.TypeCodes?.contains(PlumbingType_HOE.TC_PVC)
  }

  property set HasPVCPlumbingType(pvcExists : boolean){
    updatePlumbingTypeExistence(tc_pvc, pvcExists)
  }

  property get HasSteelPlumbingType() : boolean{
    return this.PlumbingTypes_Ext.TypeCodes?.contains(PlumbingType_HOE.TC_STEEL_EXT)
  }

  property set HasSteelPlumbingType(steelExists : boolean){
    updatePlumbingTypeExistence(tc_steel_ext, steelExists)
  }

  property get HasCastIronPlumbingType() : boolean{
    return this.PlumbingTypes_Ext.TypeCodes?.contains(PlumbingType_HOE.TC_CASTIRON_EXT)
  }

  property set HasCastIronPlumbingType(castIronExists : boolean){
    updatePlumbingTypeExistence(tc_castiron_ext, castIronExists)
  }

  property get HasPolybutylenePlumbingType() : boolean{
    return this.PlumbingTypes_Ext.TypeCodes?.contains(PlumbingType_HOE.TC_POLYBUTYLENE_EXT)
  }

  property set HasPolybutylenePlumbingType(pbtExists : boolean){
    updatePlumbingTypeExistence(tc_polybutylene_ext, pbtExists)
  }

  property get HasPEXPlumbingType() : boolean{
    return this.PlumbingTypes_Ext.TypeCodes?.contains(PlumbingType_HOE.TC_PEX_EXT)
  }

  property set HasPEXPlumbingType(pexExists: boolean){
    updatePlumbingTypeExistence(tc_pex_ext, pexExists)
  }

  property set HasOtherPlumbingType(otherExists : boolean){
    updatePlumbingTypeExistence(tc_other, otherExists)
  }

  property get HasOtherPlumbingType() : boolean{
    return this.PlumbingTypes_Ext.TypeCodes?.contains(PlumbingType_HOE.TC_OTHER)
  }

  public function updatePlumbingTypeExistence(plumbingType: PlumbingType_HOE, plumbingTypeExists : Boolean){
    if(plumbingTypeExists){
      if(this.PlumbingTypes_Ext == null){
        this.PlumbingTypes_Ext = new TypekeyArray_Ext()
      }
      this.PlumbingTypes_Ext.addToTypeCodes(plumbingType)
    }else{
      this.PlumbingTypes_Ext.removeFromTypeCodes(plumbingType)
    }
  }
}
