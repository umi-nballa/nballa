package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UWQuestionBusInsuredLoc_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

    if (homeowner.Dwelling.HOUWQuestions.businesscond  &&
        (homeowner.Dwelling.HOUWQuestions.whattypeofbus == typekey.HOTypeofBusiness_Ext.TC_HOMEOFFICE ||
            homeowner.Dwelling.HOUWQuestions.whattypeofbus == typekey.HOTypeofBusiness_Ext.TC_RETAIL   ||
            homeowner.Dwelling.HOUWQuestions.whattypeofbus == typekey.HOTypeofBusiness_Ext.TC_SERVICE  ||
           homeowner.Dwelling.HOUWQuestions.whattypeofbus == typekey.HOTypeofBusiness_Ext.TC_OTHER )) {
            return RuleEvaluationResult.execute()
    }
   return RuleEvaluationResult.skip()
   }
}