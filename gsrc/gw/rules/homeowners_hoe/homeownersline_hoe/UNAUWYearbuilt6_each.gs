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
class UNAUWYearbuilt6_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.YearBuilt<1937 && (homeowner.Dwelling.Foundation==typekey.FoundationType_HOE.TC_STILTSPILINGS_EXT || homeowner.Dwelling.Foundation==typekey.FoundationType_HOE.TC_POSTPIERBEAMOPEN_EXT)
        &&  typekey.NumberOfStories_HOE.TF_MORETHAN3STORIES.TypeKeys.contains( homeowner.Dwelling.NumberStoriesOrOverride) && homeowner.Dwelling.HOUWQuestions.hilslide)

            return RuleEvaluationResult.execute()

   return RuleEvaluationResult.skip()
  }


}