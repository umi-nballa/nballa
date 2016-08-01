package una.enhancements.entity

uses gw.api.domain.covterm.DirectCovTerm

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/21/16
 * Time: 10:21 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement DwellingEnhancement_Ext : entity.Dwelling_HOE {
  property get DwellingLimitCovTerm() : DirectCovTerm{
    var result : DirectCovTerm

    if(HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm
    }else{
      result = this.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm
    }

    return result
  }

  property get OtherStructuresLimitCovTerm() : DirectCovTerm{
    var result : DirectCovTerm

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm
    }else{
      result = this.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm
    }

    return result
  }

  property get PersonalPropertyLimitCovTerm() : DirectCovTerm{
    var result : DirectCovTerm

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Personal_Property_HOE.DPDW_PersonalPropertyLimit_HOETerm
    }else{
      result = this.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm
    }

    return result
  }

  property get LossOfUseLimitCovTerm() : DirectCovTerm{
    var result : DirectCovTerm

    if(typekey.HOPolicyType_HOE.TF_FIRETYPES.TypeKeys.contains(this.HOPolicyType)){
      result = this.DPDW_Loss_Of_Use_HOE.DPDW_LossOfUseDwelLimit_HOETerm
    }else{
      result = this.HODW_Loss_Of_Use_HOE.HODW_LossOfUseDwelLimit_HOETerm
    }

    return result
  }
}
