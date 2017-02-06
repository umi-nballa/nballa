package gw.accelerator.ruleeng

uses gw.api.database.Query
uses gw.api.database.Restriction
uses gw.validation.PCValidationContext

uses java.lang.Iterable
uses java.util.HashSet
uses java.util.List

/**
 * This class manages loading and evaluating validation rules.
 *
 * @param <R> The type of the root of the validation call
 */
class ValidationRulesEngine<R extends KeyableBean>
    extends RulesEngine<R, PCValidationContext, ValidationRule_Ext> {
  /**
   * Constructor.
   */
  @Param("rootObject", "The root of the object graph")
  @Param("entityGraphNodes",
      "The nodes in the graph to evaluate this rule against")
  @Param("ruleValContext", "The current validation context")
  @Param("graph", "The entity graph")
  protected construct(rootObject : R,
            entityGraphNodes : Iterable<RuleEntityGraphNode>,
            ruleValContext : PCValidationContext) {
    super(rootObject, entityGraphNodes, ruleValContext)
  }

  @Returns("A query for finding validation rules")
  override function newQuery(): Query<ValidationRule_Ext> {
    return Query.make(ValidationRule_Ext)
  }

  @Returns("A query restricted to rules applicable for the current validation "
      + "level")
  override function restrictQuery(query: Restriction <ValidationRule_Ext>) {
    var validationLevels = ValidationLevel.getTypeKeys(false)
        .where(\ level -> level.Priority >= Context.Level.Priority).toTypedArray()
    // Restrict rules to those whose validation warning or error level is below
    // the current validation level (or whose levels aren't set)
    query.and(\ and1 -> {
      and1.or(\ or1 -> {
        or1.and(\ bothNull -> {
          bothNull.compare(ValidationRule_Ext#WarningLevel, Equals, null)
          bothNull.compare(ValidationRule_Ext#ErrorLevel, Equals, null)
        })
        or1.compareIn(ValidationRule_Ext#WarningLevel, validationLevels)
        or1.compareIn(ValidationRule_Ext#ErrorLevel, validationLevels)
      })
    })
  }

  @Returns("Rules filtered to match the vehicle types on this policy, if any")
  protected override function filterRules(rules : Iterable<ValidationRule_Ext>)
      : Iterable<ValidationRule_Ext> {
    if (RootObject typeis PolicyPeriod) {
      var vehicleTypes = new HashSet<VehicleType>()
      if (RootObject.PersonalAutoLineExists) {
        vehicleTypes.addAll(
            (RootObject.PersonalAutoLine.Vehicles*.VehicleType) as List<VehicleType>)
      } else if (RootObject.BusinessAutoLineExists) {
        vehicleTypes.addAll(
            (RootObject.BusinessAutoLine.Vehicles*.VehicleType) as List<VehicleType>)
      }

      if (vehicleTypes.HasElements) {
        return rules.where(\ rule -> rule.VehicleTypes.hasMatch(\ v -> vehicleTypes.contains(v.VehicleType)))
      } else {
        return rules
      }
    } else if (RootObject typeis PersonalVehicle) {
      return rules.where(\ rule -> rule.VehicleTypes.hasMatch(\ v -> v.VehicleType == RootObject.VehicleType))
    } else if (RootObject typeis BusinessVehicle) {
      return rules.where(\ rule -> rule.VehicleTypes.hasMatch(\ v -> v.VehicleType == RootObject.VehicleType))
    }

    return rules
  }
}
