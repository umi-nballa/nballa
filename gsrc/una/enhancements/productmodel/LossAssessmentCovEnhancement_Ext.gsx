package una.enhancements.productmodel

uses una.config.ConfigParamsUtil
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/18/16
 * Time: 3:53 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement LossAssessmentCovEnhancement_Ext : productmodel.HODW_LossAssessmentCov_HOE_Ext {
  static function isAvailable(dwelling : entity.Dwelling_HOE) : boolean{
    var result = true

    if(dwelling.Branch.BaseState == TC_FL and dwelling.HOPolicyType == TC_DP3_Ext){
      result = dwelling.HOLine.DPLI_Personal_Liability_HOEExists or dwelling.HOLine.Dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO
    }

    return result
  }

  function setDefaults(){
    setDefaultDeductibleValue()
    this.HOPL_LossAssCovLimit_HOETerm.setDefaultLimit(this.Dwelling)
  }

  private function setDefaultDeductibleValue(){
    if(this.HasHOPL_Deductible_HOETerm){
      var result = ConfigParamsUtil.getBigDecimal(TC_LossAssessmentDeductibleDefault, this.Branch.BaseState, this.Dwelling.HOPolicyType)
      if(this.Branch.BaseState == TC_FL){
        setDefaultDeductibleValueForFL(result)
      }else if(result != null){
        this.HOPL_Deductible_HOETerm.Value = result
      }
    }
  }

  private function setDefaultDeductibleValueForFL(value : BigDecimal){
    if(this.HOPL_LossAssCovLimit_HOETerm.Value > 2000){
      if(value != null){
        this.HOPL_Deductible_HOETerm.Value = value
      }else if(this.Dwelling.HOPolicyType == TC_HO6){
        this.HOPL_Deductible_HOETerm.Value = this.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
      }
    }else{
      this.HOPL_Deductible_HOETerm.Value = null
    }
  }
}