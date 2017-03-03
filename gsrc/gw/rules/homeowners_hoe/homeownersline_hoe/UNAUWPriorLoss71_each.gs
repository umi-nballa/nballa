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
class UNAUWPriorLoss71_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = "Collapse" AND/OR Expanded Loss Cause = "Collapse - Caused by Windstorm or Hail"
// OR "Collapse - Caused by Fire/Lightning" OR "Collapse - Caused by Explosion" OR "Collapse - Caused by Volcano"
// OR "Collapse - Caused by Vehicle/Aircraft" OR "Collapse - Caused by Weight of Ice/Sleet/Snow"
// OR "Collapse - Caused by Weight of Accumulated Rain" OR "Collapse - Caused by Weight of Contents, Equipment, Animals,
// or People" OR "Collapse - Caused by Defective Material or Defective Construction/Remodeling Methods"
// OR "Collapse - Caused by Decay" OR "Collapse - Caused by Insect/Vermin" OR "Collapse - Other"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_COLLAPSE && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYWINDSTORMORHAIL
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYFIREORLIGHTNING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYEXPLOSION
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYVOLCANO
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYVEHICLEORAIRCRAFT
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYWEIGHTICESLEETSNOW
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYWEIGHTOFACCUMULATEDRAIN
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEWEIGHTCONTENTSEQUIPMENTANIMALSPEOPLE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_DFCTVMATERIALDEFECTIVECONSTRUCTIONREMODEL
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYDECAY
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_CAUSEDBYINSECTORVERMIN
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_COLLAPSE_OTHER))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}