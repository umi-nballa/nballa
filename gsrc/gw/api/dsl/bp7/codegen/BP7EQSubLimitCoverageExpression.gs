package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7EQSubLimitCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7EQSubLimit")
  }
  
  function withEarthquakeSubLimitRateFromDivision5FireAndAlliedLines(earthquakeSubLimitRateFromDivision5FireAndAlliedLines : String) : BP7EQSubLimitCoverageExpression {
    _builder.withGenericTermValue("BP7EQSubLimitRate", earthquakeSubLimitRateFromDivision5FireAndAlliedLines)
    syncAvailability("BP7EQSubLimitRate")
    return this
  }
  
  function withEqVolcanicEruptionLimitOfInsuranceBuilding(eqVolcanicEruptionLimitOfInsuranceBuilding : String) : BP7EQSubLimitCoverageExpression {
    _builder.withGenericTermValue("BP7LimitBuilding", eqVolcanicEruptionLimitOfInsuranceBuilding)
    syncAvailability("BP7LimitBuilding")
    return this
  }
  
  function withEarthquakeSubLimitBppRateFromDivision5FireAndAlliedLines(earthquakeSubLimitBppRateFromDivision5FireAndAlliedLines : String) : BP7EQSubLimitCoverageExpression {
    _builder.withGenericTermValue("BP7EQSubLimitBPPRate", earthquakeSubLimitBppRateFromDivision5FireAndAlliedLines)
    syncAvailability("BP7EQSubLimitBPPRate")
    return this
  }
  
  function withEqVolcanicEruptionLimitOfInsuranceBpp(eqVolcanicEruptionLimitOfInsuranceBpp : String) : BP7EQSubLimitCoverageExpression {
    _builder.withGenericTermValue("BP7LimitBPP", eqVolcanicEruptionLimitOfInsuranceBpp)
    syncAvailability("BP7LimitBPP")
    return this
  }
  
  function withPercentageDeductible(percentageDeductible : String) : BP7EQSubLimitCoverageExpression {
    _builder.withGenericTermValue("BP7PctDeductible", percentageDeductible)
    syncAvailability("BP7PctDeductible")
    return this
  }
  
  function withIncreasedAnnualAggregateLimitOption(increasedAnnualAggregateLimitOption : Boolean) : BP7EQSubLimitCoverageExpression {
    _builder.withGenericTermValue("BP7IncrdAnnlAggLmtOptn", increasedAnnualAggregateLimitOption)
    syncAvailability("BP7IncrdAnnlAggLmtOptn")
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
  
  function changeOn(period : PolicyPeriod) : BP7EQSubLimitCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7EQSubLimit {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7EQSubLimit
  }
  
}