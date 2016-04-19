package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7EquipmentBreakdownProtectionCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LocationCov))
    _builder.withPatternCode("BP7EquipmentBreakdownProtection")
  }
  
  function withIncluded(included : Boolean) : BP7EquipmentBreakdownProtectionCoverageExpression {
    _builder.withGenericTermValue("BP7Included", included)
    syncAvailability("BP7Included")
    return this
  }
  
  function withOptionalDeductible(optionalDeductible : productmodel.OptionBP7OptionalPropDamgDedTypeValue) : BP7EquipmentBreakdownProtectionCoverageExpression {
    _builder.withOptionCovTerm("BP7OptionalPropDamgDed", optionalDeductible.Description)
    syncAvailability("BP7OptionalPropDamgDed")
    return this
  }
  
  function withOptionalTimeDeductible(optionalTimeDeductible : productmodel.OptionBP7OptionalTimeDedTypeValue) : BP7EquipmentBreakdownProtectionCoverageExpression {
    _builder.withOptionCovTerm("BP7OptionalTimeDed", optionalTimeDeductible.Description)
    syncAvailability("BP7OptionalTimeDed")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LocationCov>() {
      override function execute(clause : BP7LocationCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7EquipmentBreakdownProtectionCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7EquipmentBreakdownProtection {
    return new EntityRetriever<BP7LocationCov>(_builder).fromPeriod(period) as productmodel.BP7EquipmentBreakdownProtection
  }
  
}