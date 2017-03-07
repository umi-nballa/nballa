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
class UNAUWPriorLoss58_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If FNOL Loss Cause = Mold/Wet or Dry Rot AND/OR  Expanded Loss Cause = "Mold - Supply or Drain Plumbing Leak" OR "Mold - Flood Related" OR
// "Mold - Surface/Ground Water Related" OR "Mold - Roof Leak" OR "Mold - Wall/Window/Door Leak" OR "Mold - Condensation" OR
// "Mold - Inadequate Ventilation" OR "Mold - Excessive Moisture or Humidity - Inadequate humidity control, or defective HVAC" OR
// "Mold - Defective/Inadequate Sump Pump" OR  "Mold - Basement Walls or Floors/Foundation Related" OR "Mold - Failure to Mitigate"


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_MOLDORWETORDRYROT && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_SUPPLYORDRAINPLUMBINGLEAK
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_FLOODRELATED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_SURFACEORGROUNDWATERRELATED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_ROOFLEAK
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_WALLORWINDOWORDOORLEAK
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_CONDENSATION
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_INADEQUATEVENTILATION
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLDEXCESSMOISTUREINADEQUATEHUMIDITY
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_DEFECTIVEINADEQUATESUMPPUMP
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_BASEMENTWALLSORFLOORSFOUNDATIONRELATED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_MOLD_FAILURETOMITIGATE))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}