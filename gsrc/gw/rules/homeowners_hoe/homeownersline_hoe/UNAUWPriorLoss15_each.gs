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
class UNAUWPriorLoss15_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //Any "Risk" loss with CLUE Cause of Loss of "Theft", THFSC", "VMM" in the last 5 years with a loss date after purchase date of the property AND that
    // occurred "On Premise"( per clue) AND there is no monitored alarm on the policy.



    homeowner.HOPriorLosses_Ext.each( \ elt ->
    {
      elt.ClaimPayment.each( \ elt1 ->
      {
        if(elt?.ClaimType?.equalsIgnoreCase("risk") && (elt1?.LossCause_Ext==typekey.LossCause_Ext.TC_THEFT || elt1?.LossCause_Ext==typekey.LossCause_Ext.TC_THFSC || elt1?.LossCause_Ext==typekey.LossCause_Ext.TC_VMM )
        && DateUtil.addYears(elt?.ClaimDate as java.util.Date,5)>new java.util.Date() && homeowner.Dwelling?.HomePurchaseDate_Ext<elt?.ClaimDate && (!homeowner.Dwelling?.DwellingProtectionDetails?.BurglarAlarm
        && homeowner.Dwelling?.DwellingProtectionDetails?.BurglarAlarmType!=typekey.BurglarAlarmType_HOE.TC_CENTRAL) && elt.LocationOfLoss?.containsIgnoreCase("onpremises"))
          return RuleEvaluationResult.execute()
      }

      )}
          )

    return RuleEvaluationResult.skip()

}
}