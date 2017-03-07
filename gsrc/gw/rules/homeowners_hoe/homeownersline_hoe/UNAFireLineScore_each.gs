package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAFireLineScore_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//Fireline:   For HO (Adjusted Score >7;  Adjusted Score > 4 and SHIA = Yes;  Adjusted Score > 4 and protection class
// is 9 or 10; Adjusted Score > 4 and woodshake/woodshingle roof.   For DF:   Adjusted Score >3;
// Any policy with SHIA = Yes.  We do not want to re-review if same Fl scores triggered review last year


    if((typekey.HOPolicyType_HOE.TF_ALLHOTYPES.TypeKeys.contains(homeowner.Dwelling.HOPolicyType) &&    typekey.HOAdjustedHazardScore_Ext.TF_7ORMORE.TypeKeys.contains(homeowner.Dwelling.HOLocation.FirelineAdjustedHazardScoreOrOverride) ||
    (typekey.HOAdjustedHazardScore_Ext.TF_4ORMORE.TypeKeys.contains(homeowner.Dwelling.HOLocation.FirelineAdjustedHazardScoreOrOverride) && homeowner.Dwelling.HOLocation.FirelineAdjustedHazardScoreOrOverride.toString().equalsIgnoreCase("Yes") ) ||
        (typekey.HOAdjustedHazardScore_Ext.TF_4ORMORE.TypeKeys.contains(homeowner.Dwelling.HOLocation.FirelineAdjustedHazardScoreOrOverride) && typekey.ProtectionClassCode_Ext.TF_UWFIRELINEFILTER.TypeKeys.contains(homeowner.Dwelling.HOLocation.protectionClassOrOverride) ) ||
        (typekey.HOAdjustedHazardScore_Ext.TF_4ORMORE.TypeKeys.contains(homeowner.Dwelling.HOLocation.FirelineAdjustedHazardScoreOrOverride) && homeowner.Dwelling.RoofTypeOrOverride==typekey.RoofType.TC_WOODSHAKE_EXT))
    || ((typekey.HOPolicyType_HOE.TF_ALLDPTDPLPP.TypeKeys.contains(homeowner.Dwelling.HOPolicyType) && typekey.HOAdjustedHazardScore_Ext.TF_3ORMORE.TypeKeys.contains(homeowner.Dwelling.HOLocation.FirelineAdjustedHazardScoreOrOverride)) ||
            homeowner.Dwelling.HOLocation.FirelineAdjustedHazardScoreOrOverride.toString().equalsIgnoreCase("Yes") ) )
              return RuleEvaluationResult.execute()

    return RuleEvaluationResult.skip()

}
}