package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.ValidationRuleExecution
uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.validation.PCValidationContext

/**
 * Created with IntelliJ IDEA.
 * User: tvang
 * Date: 8/16/17
 * Time: 12:36 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class DocumentRequestRuleExecution extends ValidationRuleExecution<PolicyPeriod> implements IRuleCondition<PolicyPeriod> {
  abstract function shouldGenerateDocumentRequest(period : PolicyPeriod) : boolean
  abstract property get DocumentType() : DocumentRequestType_Ext

  override final function evaluateRuleCriteria(policyPeriod : PolicyPeriod): RuleEvaluationResult {
    var result : RuleEvaluationResult

    if(shouldGenerateDocumentRequest(policyPeriod)){
      result = RuleEvaluationResult.execute()
    }else{
      policyPeriod.Job.removeDocumentRequest(DocumentType, AssociatedEntity)
      result = RuleEvaluationResult.skip()
    }

    return result
  }

  override final function satisfied(target: PolicyPeriod, context : PCValidationContext, result : RuleEvaluationResult){
    target.Job.generateDocumentRequest(DocumentType, AssociatedEntity)
  }

  protected property get AssociatedEntity() : KeyableBean{
    return null
  }
}