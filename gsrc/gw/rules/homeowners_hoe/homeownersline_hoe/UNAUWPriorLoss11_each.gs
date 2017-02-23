package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses java.lang.Double
uses gw.api.util.DateUtil
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWPriorLoss11_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount


    var clmcount:int = 0
        homeowner.HOPriorLosses_Ext.each( \ elt ->
        {
          elt.ClaimPayment.each( \ elt1 ->
          {
            if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_BROKENGLASS
              && elt1.ClaimAmount!=null && Double.parseDouble(elt1.ClaimAmount)>0 && elt.ClaimDate!=null && DateUtil.addYears(elt.ClaimDate as Date, 3)>new java.util.Date()
            && !(homeowner.AssociatedPolicyPeriod.BaseState.Code=="CA" && homeowner.HOPolicyType==typekey.HOPolicyType_HOE.TC_DP3_EXT))
            clmcount++

          }

        )}
        )
    if(clmcount>3)
      return RuleEvaluationResult.execute()



    return RuleEvaluationResult.skip()

}
}