package una.enhancements.entity

uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.lang.IllegalStateException
uses una.config.ConfigParamsUtil
uses java.lang.Integer

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
      result = this.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm
    }else{
      result = this.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm
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

  property get DwellingValuationMethodCovTerm() : OptionCovTerm{
    var result : OptionCovTerm

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm
    }else{
      result = this.HODW_Dwelling_Cov_HOE.HODW_DwellingValuation_HOETerm
    }

    return result
  }

  property get IsSecondaryOrSeasonal() : boolean {
    return this.DwellingUsage != null and DwellingUsage_HOE.TF_SECONDARYORSEASONAL.TypeKeys.contains(this.DwellingUsage)
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

  property get YearBuiltOrOverride(): Integer{
    if(this.OverrideYearbuilt_Ext){
      return this.YearBuiltOverridden_Ext
    }else{
      return this.YearBuilt
    }
  }

  property get TwoOrLessStories() : boolean{
    return typekey.NumberOfStories_HOE.TF_TWOORLESSSTORIES.TypeKeys.contains(this.StoriesNumber)
  }

  property get ThreeOrLessStories() : boolean{
    return typekey.NumberOfStories_HOE.TF_THREESTORIESORLESS.TypeKeys.contains(this.StoriesNumber)
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

  function getFloodRiskTypeValue(coverable:Dwelling_HOE):FloodRiskType_Ext{
    if(coverable.HODW_FloodCoverage_HOE_ExtExists){
      if(coverable.HODW_FloodCoverage_HOE_Ext.HODW_FloodCovType_HOETerm.OptionValue.OptionCode == "DPA"){
        coverable.FloodRiskType_Ext = typekey.FloodRiskType_Ext.TC_PREFERRED
      }else if(coverable.HODW_FloodCoverage_HOE_Ext.HODW_FloodCovType_HOETerm.OptionValue.OptionCode == "PA"){
        coverable.FloodRiskType_Ext = typekey.FloodRiskType_Ext.TC_PREFERRED
      }else if(coverable.HODW_FloodCoverage_HOE_Ext.HODW_FloodCovType_HOETerm.OptionValue.OptionCode == "DA"){
        coverable.FloodRiskType_Ext = typekey.FloodRiskType_Ext.TC_STANDARD
      }
    }
    return coverable.FloodRiskType_Ext
  }

  function isFloodExcludedZipCode(dwelling : Dwelling_HOE):boolean{
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
}
