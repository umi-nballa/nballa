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
class UNAUWBP7UWQ1_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if(period.BP7LineExists)
    {

      var questionSet = period.QuestionSets.firstWhere(\elt -> elt.CodeIdentifier == "BP7UnderwritingQuestions_Ext")
    questionSet.Questions.each( \ elt ->
    {
      if (elt != null)
      {
        if (elt?.isQuestionAvailable(period)  && elt.CodeIdentifier=="OwnerExperience")
        {
          var answer = period.getAnswer(elt).ChoiceAnswer?.ChoiceCode?.toString()
          if (answer=="LessThan1" || answer=="1" )
            return RuleEvaluationResult.execute()
        }
      }
    })
     }
   return RuleEvaluationResult.skip()
  }


}