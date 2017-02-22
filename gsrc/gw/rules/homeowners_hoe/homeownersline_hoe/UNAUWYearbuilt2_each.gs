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
class UNAUWYearbuilt2_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.YearBuilt>1985 && (homeowner.Dwelling.Foundation==typekey.FoundationType_HOE.TC_SLAB || homeowner.Dwelling.Foundation==typekey.FoundationType_HOE.TC_SUBTERRANEANTUCKUNDERPARKING_EXT
    ||( homeowner.Dwelling.Foundation==typekey.FoundationType_HOE.TC_OTHER && homeowner.Dwelling.FoundationTypeOther_Ext.indexOf("Grade Foundation")!=-1   ) ))
      {
            return RuleEvaluationResult.execute()


       }
   return RuleEvaluationResult.skip()
  }


}