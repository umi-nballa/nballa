package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7PhotoAmendmentOfCovTerritoryWorldwideCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7PhotoAmendmentOfCovTerritoryWorldwide")
  }
  
  function withSpecifiedExceptedCountriesOrJurisdictions(specifiedExceptedCountriesOrJurisdictions : String) : BP7PhotoAmendmentOfCovTerritoryWorldwideCoverageExpression {
    _builder.withGenericTermValue("BP7SpecifiedExceptedCountriesOrJurisdictions", specifiedExceptedCountriesOrJurisdictions)
    syncAvailability("BP7SpecifiedExceptedCountriesOrJurisdictions")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineCov>() {
      override function execute(clause : BP7LineCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7PhotoAmendmentOfCovTerritoryWorldwideCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7PhotoAmendmentOfCovTerritoryWorldwide {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7PhotoAmendmentOfCovTerritoryWorldwide
  }
  
}