package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ElectronicDataLiabilityBroadCovCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7ElectronicDataLiabilityBroadCov")
  }
  
  function withElectronicDataLiabilityAnnualAggregateLimitOfInsurance(electronicDataLiabilityAnnualAggregateLimitOfInsurance : String) : BP7ElectronicDataLiabilityBroadCovCoverageExpression {
    _builder.withGenericTermValue("BP7AggLimit2", electronicDataLiabilityAnnualAggregateLimitOfInsurance)
    syncAvailability("BP7AggLimit2")
    return this
  }
  
  function withEachElectronicDataIncidentLimit(eachElectronicDataIncidentLimit : String) : BP7ElectronicDataLiabilityBroadCovCoverageExpression {
    _builder.withGenericTermValue("BP7Limit36", eachElectronicDataIncidentLimit)
    syncAvailability("BP7Limit36")
    return this
  }
  
  function withRetroactiveDate(retroactiveDate : java.util.Date) : BP7ElectronicDataLiabilityBroadCovCoverageExpression {
    _builder.withGenericTermValue("BP7RetroDate2", retroactiveDate)
    syncAvailability("BP7RetroDate2")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7ClassificationCov>() {
      override function execute(clause : BP7ClassificationCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7ElectronicDataLiabilityBroadCovCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ElectronicDataLiabilityBroadCov {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7ElectronicDataLiabilityBroadCov
  }
  
}