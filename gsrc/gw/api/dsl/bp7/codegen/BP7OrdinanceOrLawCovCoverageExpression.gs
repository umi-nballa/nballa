package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7OrdinanceOrLawCovCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7OrdinanceOrLawCov")
  }
  
  function withCoverage(coverage : productmodel.OptionBP7TypeValue) : BP7OrdinanceOrLawCovCoverageExpression {
    _builder.withOptionCovTerm("BP7", coverage.Description)
    syncAvailability("BP7")
    return this
  }
  
  function withCoverage2Limit(coverage2Limit : java.math.BigDecimal) : BP7OrdinanceOrLawCovCoverageExpression {
    _builder.withDirectTerm("BP7Limit22", coverage2Limit)
    syncAvailability("BP7Limit22")
    return this
  }
  
  function withCoverage3Limit(coverage3Limit : java.math.BigDecimal) : BP7OrdinanceOrLawCovCoverageExpression {
    _builder.withDirectTerm("BP7Limit23", coverage3Limit)
    syncAvailability("BP7Limit23")
    return this
  }
  
  function withCombinedCoverage2And3Limit(combinedCoverage2And3Limit : java.math.BigDecimal) : BP7OrdinanceOrLawCovCoverageExpression {
    _builder.withDirectTerm("BP7Limit24", combinedCoverage2And3Limit)
    syncAvailability("BP7Limit24")
    return this
  }
  
  function withBusinessIncomeAndExtraExpenseOptionalCoverage(businessIncomeAndExtraExpenseOptionalCoverage : Boolean) : BP7OrdinanceOrLawCovCoverageExpression {
    _builder.withGenericTermValue("BP7BusnIncomeAndExtraExpenseOptional", businessIncomeAndExtraExpenseOptionalCoverage)
    syncAvailability("BP7BusnIncomeAndExtraExpenseOptional")
    return this
  }
  
  function withNumberOfHoursWaitingPeriodForPeriodOfRestoration(numberOfHoursWaitingPeriodForPeriodOfRestoration : productmodel.OptionBP7HoursWaitingPeriodTypeValue) : BP7OrdinanceOrLawCovCoverageExpression {
    _builder.withOptionCovTerm("BP7HoursWaitingPeriod", numberOfHoursWaitingPeriodForPeriodOfRestoration.Description)
    syncAvailability("BP7HoursWaitingPeriod")
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
  
  function changeOn(period : PolicyPeriod) : BP7OrdinanceOrLawCovCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7OrdinanceOrLawCov {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7OrdinanceOrLawCov
  }
  
}