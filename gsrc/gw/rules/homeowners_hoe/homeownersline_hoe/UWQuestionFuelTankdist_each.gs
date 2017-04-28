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
class UWQuestionFuelTankdist_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult { // for some reason, the code in here is exactly the same as UWQuestionFuelTankCapDist_each.  not changing as part of refactor
    var isAboveGround = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.FUEL_TANKS_IF_ANY.QuestionCode).ChoiceAnswer.ChoiceCode?.equalsIgnoreCase("AboveGround")
    var tankCapacity = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.FUEL_TANK_CAPACITY.QuestionCode).ChoiceAnswer.ChoiceCode
    var closestDistanceTank = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.CLOSEST_DISTANCE_TO_FUEL_TANK.QuestionCode).ChoiceAnswer.ChoiceCode

    if(isAboveGround and (isLessThan500GallonsAnd15Ft(tankCapacity, closestDistanceTank) or isGreaterThan500GallonsAndTooClose(tankCapacity, closestDistanceTank))){
      return RuleEvaluationResult.execute()
    }else{
      return RuleEvaluationResult.skip()
    }
  }

  private function isLessThan500GallonsAnd15Ft(tankCapacity : String, closestTankDistance : String) : boolean{
    return tankCapacity?.equalsIgnoreCase("LessThan500") and closestTankDistance?.equalsIgnoreCase("LessThan15Feet")
  }

  private function isGreaterThan500GallonsAndTooClose(tankCapacity : String, closestTankDistance : String) : boolean{
    return tankCapacity?.equalsIgnoreCase("GreaterThanOrEqual500") and {"LessThan15Feet", "15To25Feet"}?.containsIgnoreCase(closestTankDistance)
  }
}