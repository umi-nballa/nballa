package gw.lob.common

uses gw.validation.PCValidationBase
uses gw.accelerator.ruleeng.RulesEngineInterface
uses gw.validation.PCValidationContext
uses gw.validation.ValidationUtil

/**
 * Example use of the Rules Framework for validating answers on the
 * PolicyInfo step of the wizard.
 */
class PolicyInfoValidation extends PCValidationBase {
  static final var POLICYINFO_WIZARD_STEP = "PolicyInfo"

  var _policyPeriod : PolicyPeriod as PolicyPeriod

  construct (context : PCValidationContext, period : PolicyPeriod) {
    super(context)
    _policyPeriod = period
  }

  static function validatePolicyInfo(policyPeriod : PolicyPeriod) {
    var context = ValidationUtil.createContext(typekey.ValidationLevel.TC_DEFAULT)
    new PolicyInfoValidation(context, policyPeriod).validate()
    context.raiseExceptionIfProblemsFound()
  }

  override function validateImpl() {
    Context.addToVisited(this, "validate")

    invokeRulesEngine()
  }

  private function invokeRulesEngine() {
    Context.addToVisited(this, "invokeRulesEngine")
    RulesEngineInterface.validate(_policyPeriod, Context, "PolicyPeriod")
  }
}