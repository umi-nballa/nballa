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
class UNAUWPersonalPropExcl_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( /*(homeowner.AssociatedPolicyPeriod.BaseState.Code=="TX"
        ) &&
        (homeowner.HOPolicyType==typekey.HOPolicyType_HOE.TC_HOA_EXT ||
            homeowner.HOPolicyType==typekey.HOPolicyType_HOE.TC_HOB_EXT ||
            typekey.HOPolicyType_HOE.TF_ALLTDPTYPES.TypeKeys.contains(homeowner.HOPolicyType)) && */
         homeowner.HODW_PersonalPropertyExc_HOE_ExtExists)
      return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}