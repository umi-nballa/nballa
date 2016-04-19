package gw.api.dsl.bp7.codegen

uses gw.api.builder.PolicyConditionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7LimitationsOnCovForRoofSurfacingConditionExpression extends DataBuilderExpression<PolicyConditionBuilder> {

  
  construct() {
    super(new PolicyConditionBuilder(BP7BuildingCond))
    _builder.withPatternCode("BP7LimitationsOnCovForRoofSurfacing")
  }
  
  function withIndicateApplicability(indicateApplicability : productmodel.OptionBP7ApplicabilityTypeValue) : BP7LimitationsOnCovForRoofSurfacingConditionExpression {
    _builder.withOptionCovTerm("BP7Applicability", indicateApplicability.Description)
    syncAvailability("BP7Applicability")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7BuildingCond>() {
      override function execute(clause : BP7BuildingCond) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7LimitationsOnCovForRoofSurfacingConditionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7LimitationsOnCovForRoofSurfacing {
    return new EntityRetriever<BP7BuildingCond>(_builder).fromPeriod(period) as productmodel.BP7LimitationsOnCovForRoofSurfacing
  }
  
}