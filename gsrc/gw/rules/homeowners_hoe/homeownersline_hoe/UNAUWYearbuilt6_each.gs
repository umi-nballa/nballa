package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.UNAProductModelUtil.DwellingUWQuestionCodes

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWYearbuilt6_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var result : RuleEvaluationResult

    if(shouldExecute(homeowner)){
      result = RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

   return result
  }

  private function shouldExecute(hoLine : HomeownersLine_HOE) : boolean{
    var builtOnSteepHillside = hoLine.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.BUILT_ON_STEEP_HILLSIDE_DF.QuestionCode).BooleanAnswer
    var isMoreThan3Stories = typekey.NumberOfStories_HOE.TF_MORETHAN3STORIES.TypeKeys.contains( hoLine.Dwelling.NumberStoriesOrOverride)

    return hoLine.Dwelling.YearBuilt < 1937 and isBuiltOnStiltPilingsOrPostPier(hoLine) and isMoreThan3Stories and builtOnSteepHillside
  }

  private function isBuiltOnStiltPilingsOrPostPier(hoLine : HomeownersLine_HOE) : boolean{
    return hoLine.Dwelling.Foundation==typekey.FoundationType_HOE.TC_STILTSPILINGS_EXT or hoLine.Dwelling.Foundation==typekey.FoundationType_HOE.TC_POSTPIERBEAMOPEN_EXT
  }
}