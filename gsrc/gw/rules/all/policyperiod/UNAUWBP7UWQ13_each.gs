package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWBP7UWQ13_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if(period.BP7LineExists)
    {

      var questionSet = period.QuestionSets.firstWhere(\elt -> elt.CodeIdentifier == "BP7UnderwritingQuestions_Ext")
      var ans1=false
      var ans2 = false
    questionSet.Questions.each( \ elt ->
    {
      if (elt != null)
      {

        if (elt?.isQuestionAvailable(period)  && elt.CodeIdentifier=="IsWholesaleDistributor")
        {            var answer1 = period.getAnswer(elt).BooleanAnswer

          if (answer1)  ans1=true
        }

        if (elt?.isQuestionAvailable(period)  && elt.CodeIdentifier=="WholesalePercentageOpenToPublic")
        {
        var answer2 = period.getAnswer(elt).TextAnswer
          if (answer2>25)  ans2=false
        }


      }
    })
      if(ans1 && ans2)
        return RuleEvaluationResult.execute()

    }
   return RuleEvaluationResult.skip()
  }


}