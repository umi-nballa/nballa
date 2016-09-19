package una.enhancements.entity

uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.lang.IllegalStateException

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

  /*
    Returns the LossOfUseLimit cov term depending on whether this is a fire or HO policy
  */
  property get LossOfUseLimitCovTerm() : DirectCovTerm{
    var result : DirectCovTerm

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Loss_Of_Use_HOE.DPDW_LossOfUseDwelLimit_HOETerm
    }else{
      result = this.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm
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

}
