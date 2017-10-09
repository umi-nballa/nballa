package una.enhancements.entity

uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.lang.IllegalStateException
uses una.config.ConfigParamsUtil
uses java.lang.Integer
uses gw.api.domain.covterm.TypekeyCovTerm
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/21/16
 * Time: 10:21 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement DwellingEnhancement_Ext : entity.Dwelling_HOE {
  /*
    Returns the DwellingLimit cov term depending on whether this is a fire or HO policy
  */
  property get DwellingLimitCovTerm() : DirectCovTerm{
    var result : DirectCovTerm

    if(HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm
    }else{
      result = this.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm
    }

    return result
  }

  /*
    Returns the OtherStructures cov term depending on whether this is a fire or HO policy
  */
  property get OtherStructuresLimitCovTerm() : DirectCovTerm{
    var result : DirectCovTerm

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm
    }else{
      result = this.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm
    }

    return result
  }

  /*
    Returns the PersonalPropertyLimit cov term depending on whether this is a fire or HO policy
  */
  property get PersonalPropertyLimitCovTerm() : DirectCovTerm{
    var result : DirectCovTerm

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm
    }else{
      result = this.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm
    }

    return result
  }

  property get DwellingValuationMethodCovTerm() : TypekeyCovTerm{
    var result : TypekeyCovTerm

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm
    }else{
      result = this.HODW_Dwelling_Cov_HOE.HODW_DwellingValuation_HOE_ExtTerm
    }

    return result
  }

  property get IsSecondary() : boolean {
    return this.DwellingUsage != null and this.DwellingUsage == DwellingUsage_HOE.TC_SEC
  }

  /*
    Returns either the All Perils or All Other Perils Limt Cov Term.
    Either one or the other will exist for the dwelling and never both.
  */
  property get AllPerilsOrAllOtherPerilsCovTerm() : OptionCovTerm{
    var result : OptionCovTerm

    if(this.HODW_SectionI_Ded_HOE.HasHODW_OtherPerils_Ded_HOETerm){
      result = this.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm
    }else if(this.HODW_SectionI_Ded_HOE.HasHODW_AllPeril_HOE_ExtTerm){
      result = this.HODW_SectionI_Ded_HOE.HODW_AllPeril_HOE_ExtTerm
    }

    return result
  }

  property get EarthquakeDeductibleValue(): DwellingCov_HOE {
    var result: DwellingCov_HOE

      if(this.HODW_Comp_Earthquake_CA_HOE_ExtExists) {

      } else if(this.HODW_Earthquake_HOEExists) {

      } else if(this.HODW_Limited_Earthquake_CA_HOEExists) {

      }

     return result
  }

  property get HasAllRenovations() : boolean {

    return this.ElectricalSystemUpgrade and this.HeatingUpgrade and this.PlumbingUpgrade and this.RoofingUpgrade

  }

  property get MostRecentRenovationYear() : int {

    var renovationYears = {this?.ElectricalSystemUpgradeDate, this?.RoofingUpgradeDate, this?.HeatingUpgradeDate, this?.PlumbingUpgradeDate}

    try{
      return renovationYears.min()
    }catch(e : IllegalStateException){
      return 0
    }

  }

  property get YearBuiltOrOverride() : Integer{
    if(this.OverrideYearbuilt_Ext and this.YearBuiltOverridden_Ext != null){
      return this.YearBuiltOverridden_Ext
    }else{
      return this.YearBuilt
    }
  }


  /*
  * @param date to calculate age off of
  * */
  function getAgeOfHome(date: Date): Integer{
    if(date.YearOfDate != null and this.YearBuiltOrOverride != null){
      return date.YearOfDate - this.YearBuiltOrOverride
    }else{
      return null
    }
  }

  property get FloodZoneOrOverride() : typekey.FloodZoneOverridden_Ext
  {
    var floodZoneOverrideValue:FloodZoneOverridden_Ext

    if(this.OverridePropFloodVal_Ext and this.PropFloodValOverridden_Ext!=null){
      floodZoneOverrideValue = this.PropFloodValOverridden_Ext
    }else{
      floodZoneOverrideValue = this.PropFloodVal_Ext
    }
    return floodZoneOverrideValue
  }

  property get NumberStoriesOrOverride() : typekey.NumberOfStories_HOE{
    if(this.OverrideStoriesNumber_Ext and this.NoofStoriesOverridden_Ext != null){
      return this.NoofStoriesOverridden_Ext
    }else{
      return this.StoriesNumber
    }
  }

  property get ConstructionTypeOrOverride() : typekey.ConstructionType_HOE{
    if(this.OverrideConstructionType_Ext and this.ConstTypeOverridden_Ext != null){
      return this.ConstTypeOverridden_Ext
    }else{
      return this.ConstructionType
    }
  }

  property get ConstructionTypeL1OrOverride() : typekey.ConstructionType_HOE{
    if(this.OverrideConstructionType_Ext and this.ConstTypeOverridden_Ext != null){
      return this.ConstTypeOverridden_Ext
    }else{
      return this.ConstructionType
    }
  }

  property get ConstructionTypeL2OrOverride() : typekey.ConstructionType_HOE{
    if(this.OverrideConstructionTypeL2_Ext and this.ConstTypeOverriddenL2_Ext != null){
      return this.ConstTypeOverriddenL2_Ext
    }else{
      return this.ConstructionTypeL2_Ext
    }
  }

  property get ExteriorWallFinishOrOverride() : typekey.ExteriorWallFinish_Ext{
    if(this.OverrideExteriorWFval_Ext and this.ExteriorWFvalueOverridden_Ext != null){
      return this.ExteriorWFvalueOverridden_Ext
    }else{
      return this.ExteriorWallFinish_Ext
    }
  }

  property get ExteriorWallFinishL1OrOverride() : typekey.ExteriorWallFinish_Ext{
    if(this.OverrideExteriorWFvalL1_Ext and this.ExteriorWFvalueOverridL1_Ext != null){
      return this.ExteriorWFvalueOverridL1_Ext
    }else{
      return this.ExteriorWallFinishL1_Ext
    }
  }

  property get ExteriorWallFinishL2OrOverride() : typekey.ExteriorWallFinish_Ext{
    if(this.OverrideExteriorWFvalL2_Ext and this.ExteriorWFvalueOverridL2_Ext != null){
      return this.ExteriorWFvalueOverridL2_Ext
    }else{
      return this.ExteriorWallFinishL2_Ext
    }
  }

  property get TerritoryCodeOrOverride() : String{
    if(this.HOLocation.OverrideTerritoryCode_Ext and this.HOLocation.TerritoryCodeOverridden_Ext != null){
      return this.HOLocation.TerritoryCodeOverridden_Ext
    }else{
      return this.HOLocation.TerritoryCodeTunaReturned_Ext
    }
  }

 property get RoofTypeOrOverride():typekey.RoofType
  {
    if(this.OverrideRoofType_Ext && this.RoofingMaterialOverridden_Ext!=null)
      return this.RoofingMaterialOverridden_Ext
    else
      return this.RoofType
  }

  property get SquareFootageOrOverride() : String{
    if(this.OverrideTotalSqFtVal_Ext and this.TotalSqFtValOverridden_Ext != null){
      return this.TotalSqFtValOverridden_Ext
    }else{
      return this.SquareFootage_Ext
    }
  }
      
  property get EarthQuakeTerritoryOrOverride() : String{
    if(this.OverrideEarthquakeTer_Ext and this.EarthquakeTerOverridden_Ext != null){
      return this.EarthquakeTerOverridden_Ext
    }else{
      return this.EarthQuakeTer_Ext
    }
  }

  property get BCEGOrOverride() : typekey.BCEGGrade_Ext{
    if(this.HOLocation.OverrideBCEG_Ext and this.HOLocation.BCEGOverridden_Ext != null){
      return this.HOLocation.BCEGOverridden_Ext
    }else{
      return this.HOLocation.BCEG_Ext
    }


  }

  property get ProtectionClassCodeOrOverride() : String{

    if(this.HOLocation.OverrideDwellingPCCode_Ext and this.HOLocation.OverrideDwellingPCCode_Ext != null){
      return this.HOLocation.DwellingPCCodeOverridden_Ext
    } else{
      return this.HOLocation.DwellingProtectionClasscode
    }


  }


  property get isPolicyHOTypes() : boolean {
    return typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(this.HOPolicyType) ? true : false
  }

  property get isPolicyDPTypes() : boolean {
    return typekey.HOPolicyType_HOE.TC_DP3_EXT == this.HOPolicyType ? true : false
  }

  property get isPolicyTDPTypes() : boolean {
    return typekey.HOPolicyType_HOE.TF_ALLTDPTYPES.TypeKeys.contains(this.HOPolicyType) ? true : false
  }

  //Flood Risk Type field on the dwelling screen will have value when Flood Coverage Question in dwelling Screen is Yes
  function getFloodRiskTypeValue(coverable:Dwelling_HOE):FloodRiskType_Ext{
    if(coverable.HODW_FloodCoverage_HOE_ExtExists){
      if(coverable.HODW_FloodCoverage_HOE_Ext.HODW_FloodCoverageTypeTerm.Value == TC_DPPA){
        coverable.FloodRiskType_Ext = typekey.FloodRiskType_Ext.TC_PREFERRED
      }else if(coverable.HODW_FloodCoverage_HOE_Ext.HODW_FloodCoverageTypeTerm.Value == TC_PPA){
        coverable.FloodRiskType_Ext = typekey.FloodRiskType_Ext.TC_PREFERRED
      }else if(coverable.HODW_FloodCoverage_HOE_Ext.HODW_FloodCoverageTypeTerm.Value == TC_DA){
        coverable.FloodRiskType_Ext = typekey.FloodRiskType_Ext.TC_STANDARD
      }
    }else{
      coverable.FloodRiskType_Ext = null
    }
    return coverable.FloodRiskType_Ext
  }

  function isFloodEligibleZipCode(dwelling: Dwelling_HOE):boolean{
    var zipCodeExists:boolean
    var floodExcludedZips = ConfigParamsUtil.getList(TC_FloodExcludedZipCodes, dwelling.PolicyLine.BaseState)
    if(floodExcludedZips.HasElements){
      var zipCode = dwelling.HOLocation.PolicyLocation.PostalCode?.trim()
      if(zipCode.length >= 5){
        zipCode = zipCode.substring(0, 5)
        zipCodeExists = !floodExcludedZips.contains(zipCode)
      }
    }
   return zipCodeExists
  }
  
  function floodZipCodesToWatch(dwelling:Dwelling_HOE):boolean{
    var floodZipCodeToWatch:boolean
    var floodIneligibleZips = ConfigParamsUtil.getList(TC_FloodCoverageIneligibleZipCodes, dwelling.PolicyLine.BaseState)
    if(floodIneligibleZips.HasElements){
      var zipCode = dwelling.HOLocation.PolicyLocation.PostalCode?.trim()
      if(zipCode.length >= 5){
        zipCode = zipCode.substring(0, 5)
        floodZipCodeToWatch = !floodIneligibleZips.contains(zipCode)
      }
    }
    return floodZipCodeToWatch
  }

  function eastORWestCoastLocation(dwelling : Dwelling_HOE):CoastLocation_Ext{
    var countyDirection:CoastLocation_Ext
    var eastCoastLocations = ConfigParamsUtil.getList(TC_EastCoastLocation, dwelling.PolicyLine.BaseState)
    var westCoastLocations = ConfigParamsUtil.getList(TC_WestCoastLocation, dwelling.PolicyLine.BaseState)
    var county = dwelling.HOLocation.PolicyLocation.County
    if(eastCoastLocations.HasElements && eastCoastLocations.hasMatch( \ ecl -> ecl.equalsIgnoreCase(county))){
      countyDirection = typekey.CoastLocation_Ext.TC_EAST
    }else if(westCoastLocations.HasElements && westCoastLocations.hasMatch( \ wcl -> wcl.equalsIgnoreCase(county))){
      countyDirection = typekey.CoastLocation_Ext.TC_WEST
    }
    return countyDirection
  }

  function isCoastLocationCountyExists(dwelling : Dwelling_HOE):boolean{
    var countyExists = false
    var eastCoastLocations = ConfigParamsUtil.getList(TC_EastCoastLocation, dwelling.PolicyLine.BaseState)
    var westCoastLocations = ConfigParamsUtil.getList(TC_WestCoastLocation, dwelling.PolicyLine.BaseState)
    var county = dwelling.HOLocation.PolicyLocation.County
    if( (eastCoastLocations.HasElements && eastCoastLocations.contains(county)) || (westCoastLocations.HasElements && westCoastLocations.contains(county)) ){
      countyExists = true
    }
    return countyExists
  }

  function dwellingUsageValues(dwelling : Dwelling_HOE):List<DwellingUsage_HOE>{
    if (dwelling.HOPolicyType == HOPolicyType_HOE.TC_HO4){
      return DwellingUsage_HOE.TF_ALLEXCEPTRENTAL.TypeKeys
    }
    //DE1340/CR 151 - TX TDPs
    if (this.HOLine.JobType == TC_Submission && this.HOLine.BaseState == TC_TX &&
        (this.HOLine.HOPolicyType == "TDP1_Ext" || this.HOLine.HOPolicyType == "TDP2_Ext" || this.HOLine.HOPolicyType == "TDP3_Ext")){
      return DwellingUsage_HOE.TF_ALLEXCEPTSECONDARY.TypeKeys
    }
    return typekey.DwellingUsage_HOE.TF_ALL.TypeKeys
  }

  //FL HO, FL DP, CA HO, CA DP, NC HO, NC DP, SC HO, TX HO, TX TDP, NV HO
  function isPaidNonWeatherClaimsFieldVisible(dwelling:Dwelling_HOE):boolean{
    if( (dwelling.PolicyPeriod.BaseState == TC_NC || dwelling.PolicyPeriod.BaseState == TC_FL || dwelling.PolicyPeriod.BaseState == TC_CA || dwelling.PolicyPeriod.BaseState == TC_SC
        || dwelling.PolicyPeriod.BaseState == TC_TX || dwelling.PolicyPeriod.BaseState == TC_NV) && (HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(dwelling.HOPolicyType) or
            HOPolicyType_HOE.TF_ALLTDPTYPES.TypeKeys.contains(dwelling.HOPolicyType) or dwelling.HOPolicyType == TC_DP3_Ext) ){
      return true
    }
    return false
  }

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
      this.PlumbingTypes_Ext?.removeFromTypeCodes(plumbingType)
    }
  }
}
