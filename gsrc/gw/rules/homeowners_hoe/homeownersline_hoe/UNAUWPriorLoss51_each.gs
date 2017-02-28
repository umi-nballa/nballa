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
class UNAUWPriorLoss51_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    //IF FNOL Loss Cause = "Broken Glass" AND the Expanded loss Cause = "Broken Glass - V/MM" OR "Broken Glass -
    // Burglary Attempt".

    //If FNOL Loss Cause = "Fire - Other" AND/OR  Expanded Loss Cause = "Fire - Appliances and Household Equipment (e.g. stove, fan, dryer, washer, air conditioner, etc.)"
    // OR "Fire - Accidental Cooking" OR "Fire - Arson" OR "Fire - Juvenile playing with fire" OR "Fire - Chemicals, Fuels, and Gases (propane, gasoline, flammable liquids, etc.)"
    // OR "Fire- Spontaneous Combustion" OR "Fire - Household Lighting" OR "Fire - Consumer Electronics" OR "Fire - Electrical (faulty wiring, faulty breaker, circuit overload,
    // electrical shorts, etc.)" OR "Fire - Electrical - Aluminum Wiring" OR "Fire- Heating Pad or Electric Blanket" OR "Fire - Fireworks" OR "Fire - Candles, other open flame
    // decorations" OR "Fire - Holiday Related (tree, holiday lights, decorations, etc.)" OR "Fire - Smoking Related (cigarettes, tobacco products, etc.)" OR  "Fire - Caused by 3rd Party".


    homeowner.HOPriorLosses_Ext.each( \ elt ->
         {

             elt.ClaimPayment.each( \ elt1 ->
             {

               if(elt1.LossCause_Ext!=typekey.LossCause_Ext.TC_FIREOTHER && (elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_APPLIANCESANDHOUSEHOLDEQUIPMENT
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_ACCIDENTALCOOKING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_ARSON
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_JUVENILEPLAYINGWITHFIRE
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_CHEMICALSFUELSANDGASES
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_SPONTANEOUSCOMBUSTION
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_HOUSEHOLDLIGHTING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_CONSUMERELECTRONICS
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_ELECTRICAL
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_ELECTRICAL_ALUMINUMWIRING
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_HEATINGPADORELECTRICBLANKET
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_FIREWORKS
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_CANDLES
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_HOLIDAYRELATED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_SMOKINGRELATED
                   || elt1.ExpandedLossCause_Ext==typekey.ExpanedLossCause_Ext.TC_FIRE_CAUSEDBY3RDPARTY))

                 return RuleEvaluationResult.execute()


             })


         })


    return RuleEvaluationResult.skip()
  }


}