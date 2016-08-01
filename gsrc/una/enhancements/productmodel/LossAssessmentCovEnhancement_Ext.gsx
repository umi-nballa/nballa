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
  static function isAvailable(hoLine : entity.HomeownersLine_HOE) : boolean{
    var result = true

    if(hoLine.BaseState == TC_FL and hoLine.HOPolicyType == TC_DP3_Ext){
      result = hoLine.DPLI_Personal_Liability_HOEExists or hoLine.Dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO
    }

    return result
  }

  function setDefaults(){
    setDefaultDeductibleValue()
    setDefaultLimit()
  }

  private function setDefaultDeductibleValue(){
    if(this.HasHOPL_Deductible_HOETerm){
      var result = ConfigParamsUtil.getBigDecimal(TC_LossAssessmentDeductibleDefault, this.HOLine.BaseState, this.HOLine.HOPolicyType)
      if(this.HOLine.BaseState == TC_FL){
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
      }else if(this.HOLine.HOPolicyType == TC_HO6){
        this.HOPL_Deductible_HOETerm.Value = this.HOLine.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm.Value
      }
    }else{
      this.HOPL_Deductible_HOETerm.Value = null
    }
  }

  private function setDefaultLimit(){
    if(this.HasHOPL_LossAssCovLimit_HOETerm and this.HOPL_LossAssCovLimit_HOETerm.Value == null){
      this.HOPL_LossAssCovLimit_HOETerm.setOptionValue(this.HOPL_LossAssCovLimit_HOETerm.AvailableOptions.orderBy(\ o -> o.Value).first())
    }
  }
}
