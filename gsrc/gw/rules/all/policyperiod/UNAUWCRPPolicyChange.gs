package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: rpanigrahy
 * Date: 3/1/17
 * Time: 8:56 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPPolicyChange implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    if(period.CPLineExists){
      var jobType= period.CPLine.Branch.Job.Subtype.Code
      var policyChange = typekey.Job.TC_POLICYCHANGE.Code
      if(jobType == policyChange){
        return RuleEvaluationResult.execute()
      }
    }
    return RuleEvaluationResult.skip()
  }
}