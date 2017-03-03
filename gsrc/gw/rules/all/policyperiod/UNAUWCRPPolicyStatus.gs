package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/1/17
 * Time: 11:02 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPPolicyStatus implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists or period.GLLineExists)
    {
      var status_CP= period.CPLine.Branch.Job.SelectedVersion.Status.Code
      var status_GL= period.GLLine.Branch.Job.SelectedVersion.Status.Code
      var nonRenew =  typekey.PolicyPeriodStatus.TC_NONRENEWED.Code
      if(status_CP == nonRenew or status_GL == nonRenew){
        return RuleEvaluationResult.execute()
      }
    }
    return RuleEvaluationResult.skip()
  }
}