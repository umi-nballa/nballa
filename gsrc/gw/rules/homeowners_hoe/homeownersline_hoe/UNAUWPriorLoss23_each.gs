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
class UNAUWPriorLoss23_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   // Loss /Claim Date  -  HOPriorLoss_Ext.ClaimDate
   // Loss cause –  HOPriorLosses_Ext.ClaimPayment.LossCause_Ext
   // Loss/ Claim status – HOPriorLosses_Ext.ClaimStatus
   // Claim Weather (only for NC ) - HOPriorLosses_Ext.ClaimPayment.Weather
   // Source “CLUE” - HOPriorLoss_Ext .Source_Ext
   // Claim Amount - HOPriorLosses_Ext.ClaimPayment. ClaimAmount

    //Any "Risk" or  "Subject" loss with CLUE Cause of Loss of "Theft", "THFSC", "VMM" in the last 3 years  with a loss date after purchase date of the property AND
    // the loss location per CLUE is "Unknown" AND there is no monitored alarm on the policy



    homeowner.HOPriorLosses_Ext.each( \ elt ->
    {
      elt.ClaimPayment.each( \ elt1 ->
      {
        if((elt.ClaimType.equalsIgnoreCase("risk") || elt.ClaimType.equalsIgnoreCase("subject")) && (elt1.LossCause_Ext==typekey.LossCause_Ext.TC_THEFT || elt1.LossCause_Ext==typekey.LossCause_Ext.TC_THFSC || elt1.LossCause_Ext==typekey.LossCause_Ext.TC_VMM )
        && DateUtil.addYears(elt.ClaimDate as java.util.Date,3)>new java.util.Date() && homeowner.Dwelling.HomePurchaseDate_Ext<elt.ClaimDate && (!homeowner.Dwelling.DwellingProtectionDetails.BurglarAlarm
        && homeowner.Dwelling.DwellingProtectionDetails.BurglarAlarmType!=typekey.BurglarAlarmType_HOE.TC_CENTRAL) && elt.LocationOfLoss.containsIgnoreCase("unknown"))
          return RuleEvaluationResult.execute()
      }

      )}
          )

    return RuleEvaluationResult.skip()

}
}