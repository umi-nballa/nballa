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
class UWQuestionFuelTankCapDist_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

   if(homeowner.Dwelling.HOUWQuestions.propanegas == typekey.HOPropaneNaturalgas_Ext.TC_ABOVEGROUND)
      if((homeowner.Dwelling.HOUWQuestions.tankcapacity == typekey.HOCapTankGal_Ext.TC_LT500 &&
          homeowner.Dwelling.HOUWQuestions.closestdisttank ==  typekey.HOCloseseDistTank_Ext.TC_LT15FT) ||
          (homeowner.Dwelling.HOUWQuestions.tankcapacity == typekey.HOCapTankGal_Ext.TC_GTEQ500 )){
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}