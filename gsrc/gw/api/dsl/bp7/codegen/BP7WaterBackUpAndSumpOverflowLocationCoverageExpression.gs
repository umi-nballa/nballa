package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7WaterBackUpAndSumpOverflowLocationCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LocationCov))
    _builder.withPatternCode("BP7WaterBackUpAndSumpOverflowLocation")
  }
  
  function withCoveredPropertyAnnualAggregateLimit(coveredPropertyAnnualAggregateLimit : productmodel.OptionBP7CoveredPropertyAnnualAggregateLimitTypeValue) : BP7WaterBackUpAndSumpOverflowLocationCoverageExpression {
    _builder.withOptionCovTerm("BP7CoveredPropertyAnnualAggregateLimit", coveredPropertyAnnualAggregateLimit.Description)
    syncAvailability("BP7CoveredPropertyAnnualAggregateLimit")
    return this
  }
  
  function withCoveredPropertyAnnualAggregateLimitOverride(coveredPropertyAnnualAggregateLimitOverride : String) : BP7WaterBackUpAndSumpOverflowLocationCoverageExpression {
    _builder.withGenericTermValue("BP7CoveredPropertyAnnualAggregateLimitOverride", coveredPropertyAnnualAggregateLimitOverride)
    syncAvailability("BP7CoveredPropertyAnnualAggregateLimitOverride")
    return this
  }
  
  function withBusinessIncomeAndExtraExpenseAnnualAggregateLimit(businessIncomeAndExtraExpenseAnnualAggregateLimit : productmodel.OptionBP7BusinessIncomeExtraExpenseAnnualAggregateLimitTypeValue) : BP7WaterBackUpAndSumpOverflowLocationCoverageExpression {
    _builder.withOptionCovTerm("BP7BusinessIncomeExtraExpenseAnnualAggregateLimit", businessIncomeAndExtraExpenseAnnualAggregateLimit.Description)
    syncAvailability("BP7BusinessIncomeExtraExpenseAnnualAggregateLimit")
    return this
  }
  
  function withBusinessIncomeAndExtraExpenseAnnualAggregateLimitOverride(businessIncomeAndExtraExpenseAnnualAggregateLimitOverride : String) : BP7WaterBackUpAndSumpOverflowLocationCoverageExpression {
    _builder.withGenericTermValue("BP7BusinessIncomeExtraExpenseAnnualAggLimitOverrid", businessIncomeAndExtraExpenseAnnualAggregateLimitOverride)
    syncAvailability("BP7BusinessIncomeExtraExpenseAnnualAggLimitOverrid")
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
  
  function changeOn(period : PolicyPeriod) : BP7WaterBackUpAndSumpOverflowLocationCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7WaterBackUpAndSumpOverflowLocation {
    return new EntityRetriever<BP7LocationCov>(_builder).fromPeriod(period) as productmodel.BP7WaterBackUpAndSumpOverflowLocation
  }
  
}