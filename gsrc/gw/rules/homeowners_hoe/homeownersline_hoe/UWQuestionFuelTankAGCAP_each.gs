package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.UNAProductModelUtil.DwellingUWQuestionCodes

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UWQuestionFuelTankAGCAP_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var result : RuleEvaluationResult

    if(shouldExecuteRule(homeowner)){
      result = RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

    return result
  }

  private function shouldExecuteRule(hoLine : HomeownersLine_HOE) : boolean{
    var isAboveGroundFuelTank = hoLine.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.FUEL_TANKS_IF_ANY.QuestionCode).ChoiceAnswer.ChoiceCode == "AboveGround"
    var doesNotMeetLocalBuildingCodes = hoLine.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.FUEL_TANK_CODE_COMPLIANT.QuestionCode).ChoiceAnswer.ChoiceCode == "No"

    return isAboveGroundFuelTank and doesNotMeetLocalBuildingCodes
  }
}