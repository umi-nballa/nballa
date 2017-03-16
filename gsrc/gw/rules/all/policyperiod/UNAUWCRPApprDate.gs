package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.api.util.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 3/1/17
 * Time: 8:35 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWCRPApprDate implements IRuleCondition<PolicyPeriod> {

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    if(period.CPLineExists)  {

            if(DateUtil.addMonths(period.AppraisalDate_Ext,30)<new java.util.Date())
              return RuleEvaluationResult.execute()


    }
    return RuleEvaluationResult.skip()
  }
}