package gw.accelerator.ruleeng

uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext

/**
 * This type manages execution of validation rules.
 */
class ValidationRuleExecution<T>
    extends BaseRuleExecution<T, PCValidationContext, ValidationRule_Ext>
    implements IRuleAction<T, PCValidationContext> {
  /**
   * Adapter class for PCValidationBase.
   */
  private static class RulesFrameworkValidation extends PCValidationBase {
    construct(validationContext: PCValidationContext) {
      super(validationContext)
    }

    override function validateImpl() {
      Context.addToVisited(this, "validate")
    }
  }

  construct(rule : ValidationRule_Ext) {
    super(rule)
  }

  construct(){

  }

  /**
   * Updates the validation context's visited list before evaluating the
   * condition.
   */
  override function evaluate(target : T,
                             context : PCValidationContext,
                             condition : IRuleCondition<T>) {
    context.addToVisited(new RulesFrameworkValidation(context),
        this.IntrinsicType.Name)
    // Short-circuit evaluation if the vehicle types don't match
    var vehicleType : typekey.VehicleType = null
    if (target typeis PersonalVehicle) {
      vehicleType = (target as PersonalVehicle).VehicleType
    } else if (target typeis BusinessVehicle) {
      vehicleType = (target as BusinessVehicle).VehicleType
    }
    if ((vehicleType != null) and not Rule.VehicleTypes.hasMatch(
        \ v -> v.VehicleType == vehicleType)) {
      Logger.debug("Skipping vehicle " + target
          + " because rule doesn't apply to vehicle type "
          + vehicleType)
    } else {
      super.evaluate(target, context, condition)
    }
  }

  /**
   * Adds a validation warning or error.
   */
  override function satisfied(target: T,
                              context : PCValidationContext,
                              result : RuleEvaluationResult) {
    var msgBody = displaykey.Accelerator.RulesFramework.ValidationFailed(
        result.PrimaryValue,
        Rule.RuleMessage,
        RuleClass)

    var invalidBean : KeyableBean = null
    if (target typeis KeyableBean) {
      invalidBean = target as KeyableBean
    } else if (target typeis Object) {
      var array = target as KeyableBean[]
      if (array.length > 0) {
        invalidBean = (target as KeyableBean[])[0]
      }
    }
    // compare valContext to rule's WarningLevel and ErrorLevel
    if ((Rule.ErrorLevel != null) and context.isAtLeast(Rule.ErrorLevel)) {
      context.Result.addError(invalidBean, context.Level, msgBody)
    } else {
      context.Result.addWarning(invalidBean, context.Level, msgBody)
    }
  }
}
