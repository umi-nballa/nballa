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
class UNAUWPriorLoss47_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Theft" AND/OR Expanded Loss Cause =" Theft From On Premise Auto" OR "Theft From Off  Premise Auto" OR "Theft from Residence Premise - No Foreclosure"
// OR  "Theft from Residence Premise - Foreclosure" OR "Theft From Location Other than Residence Premise."

    //If FNOL loss Cause = "Vandalism/MM" AND/OR   Expanded Loss Cause = "V/MM - Tenant Hard Living" OR "V/MM
    // - Tenant Causes OR "V/MM - Insured Occupied Property" OR "V/MM - Vacant Property in Foreclosure" OR "V/MM
    // - Vacant Property Not in Foreclosure" OR "V/MM - Growhouse or Other Willful  Illegal Activity"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_VANDALISMMM || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_VORMM_TENANTHARDLIVING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_VORMM_TENANTCAUSED ||
                   elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_VORMM_INSUREDOCCUPIEDPROPERTY
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_VORMM_VACANTPROPERTYINFORECLOSURE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_VORMM_VACANTPROPERTY_NOTINFORECLOSURE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_VORMM_GROWHOUSEOTHERWILLFULILLEGALACTIVITY)

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}