package una.enhancements.productmodel

uses una.config.ConfigParamsUtil
uses org.apache.commons.lang3.StringUtils
/**
 * Created with IntelliJ IDEA.
 * User: akhovyev
 * Date: 1/27/17
 * Time: 5:43 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNACoveragePatternEnhacement : gw.api.productmodel.ClausePattern {

  function GetCoverageName(coverable: entity.Coverable): String{

    var policyType: typekey.HOPolicyType_HOE

    if(coverable typeis Dwelling_HOE) {

      policyType = (coverable as Dwelling_HOE).HOPolicyType
    } else{

      policyType = (coverable as HomeownersLine_HOE).HOPolicyType
    }

    var criteriaTest =  ConfigParamsUtil.getString(tc_AlternateDisplayName, coverable.PolicyLine.BaseState, "${this.CodeIdentifier}_${policyType.Code}")

    if(StringUtils.isEmpty(criteriaTest) == false){

       return displaykey.una.productmodel.coverages.ModifiedReplacementCostName
    }else{

        return this.DisplayName
    }

  }


}
