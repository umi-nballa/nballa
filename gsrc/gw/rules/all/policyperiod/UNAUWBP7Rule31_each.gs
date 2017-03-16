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
class UNAUWBP7Rule31_each implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if(period.BP7LineExists)
    {

      var questionSet = period.QuestionSets.firstWhere(\elt -> elt.CodeIdentifier == "BP7_Prequal_Ext")
    questionSet.Questions.each( \ elt ->
    {
      if (elt != null)
      {
        if (elt?.isQuestionAvailable(period)  && elt.CodeIdentifier=="BP7_Q9_Underwriting_Ext")
        {
          var answeredTrue = period.getAnswerValue(elt)?.toString() as boolean
          if (null != answeredTrue && answeredTrue )
            return RuleEvaluationResult.execute()
        }
      }
    })
      }
   return RuleEvaluationResult.skip()
  }


}