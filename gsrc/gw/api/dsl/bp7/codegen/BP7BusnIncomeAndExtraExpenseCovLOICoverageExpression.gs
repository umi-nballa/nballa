package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7BusnIncomeAndExtraExpenseCovLOICoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7BusnIncomeAndExtraExpenseCovLOI")
  }
  
  function withBusinessIncomeExtraExpenseAndRelatedCoveragesLimitOfInsurance(businessIncomeExtraExpenseAndRelatedCoveragesLimitOfInsurance : productmodel.OptionBP7Limit20TypeValue) : BP7BusnIncomeAndExtraExpenseCovLOICoverageExpression {
    _builder.withOptionCovTerm("BP7Limit20", businessIncomeExtraExpenseAndRelatedCoveragesLimitOfInsurance.Description)
    syncAvailability("BP7Limit20")
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
  
  function changeOn(period : PolicyPeriod) : BP7BusnIncomeAndExtraExpenseCovLOICoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7BusnIncomeAndExtraExpenseCovLOI {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7BusnIncomeAndExtraExpenseCovLOI
  }
  
}