package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWPriorLoss19_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount


//Any "Risk" loss with CLUE Cause of Loss of "Theft", THFSC", "VMM" in the last 3 years with a loss date after purchase date of the property AND
// that occurred "On Premise"( per clue) AND there is no monitored alarm on the policy.




    homeowner.HOPriorLosses_Ext.each( \ elt ->
    {
      elt?.ClaimPayment?.each( \ elt1 ->
      {
        if(elt?.ClaimType!=null && elt?.ClaimType==typekey.ClaimType_Ext.TC_RISK && (elt1?.LossCause_Ext==typekey.LossCause_Ext.TC_THEFT || elt1?.LossCause_Ext==typekey.LossCause_Ext.TC_THFSC || elt1?.LossCause_Ext==typekey.LossCause_Ext.TC_VMM )
        && elt?.ClaimDate!=null && DateUtil.addYears(elt.ClaimDate as java.util.Date,3)>new java.util.Date() && homeowner?.Dwelling?.HomePurchaseDate_Ext<elt.ClaimDate && (!homeowner?.Dwelling?.DwellingProtectionDetails?.BurglarAlarm
        && homeowner?.Dwelling?.DwellingProtectionDetails?.BurglarAlarmType!=typekey.BurglarAlarmType_HOE.TC_CENTRAL) && elt?.LocationOfLoss?.containsIgnoreCase("onpremises"))
          return RuleEvaluationResult.execute()
      }

      )}
          )

    return RuleEvaluationResult.skip()

}
}