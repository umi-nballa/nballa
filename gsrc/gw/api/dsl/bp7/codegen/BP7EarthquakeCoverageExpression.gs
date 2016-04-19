package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7EarthquakeCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7Earthquake")
  }
  
  function withEarthquakeRateFromDivision5FireAndAlliedLines(earthquakeRateFromDivision5FireAndAlliedLines : String) : BP7EarthquakeCoverageExpression {
    _builder.withGenericTermValue("BP7EarthquakeRate", earthquakeRateFromDivision5FireAndAlliedLines)
    syncAvailability("BP7EarthquakeRate")
    return this
  }
  
  function withEarthquakeBppRateFromDivision5FireAndAlliedLines(earthquakeBppRateFromDivision5FireAndAlliedLines : String) : BP7EarthquakeCoverageExpression {
    _builder.withGenericTermValue("BP7EarthquakeBPPRate", earthquakeBppRateFromDivision5FireAndAlliedLines)
    syncAvailability("BP7EarthquakeBPPRate")
    return this
  }
  
  function withMandatoryDeductible(mandatoryDeductible : String) : BP7EarthquakeCoverageExpression {
    _builder.withGenericTermValue("BP7PercentageDeductible", mandatoryDeductible)
    syncAvailability("BP7PercentageDeductible")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7BuildingCov>() {
      override function execute(clause : BP7BuildingCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7EarthquakeCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7Earthquake {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7Earthquake
  }
  
}