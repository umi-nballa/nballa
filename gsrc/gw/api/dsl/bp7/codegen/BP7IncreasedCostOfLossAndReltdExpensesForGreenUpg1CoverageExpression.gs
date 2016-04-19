package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1CoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1")
  }
  
  function withIncreasedCostOfLoss(increasedCostOfLoss : productmodel.OptionBP7IncreasedCostOfLossPct1TypeValue) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1CoverageExpression {
    _builder.withOptionCovTerm("BP7IncreasedCostOfLossPct1", increasedCostOfLoss.Description)
    syncAvailability("BP7IncreasedCostOfLossPct1")
    return this
  }
  
  function withGreenUpgradesLimit(greenUpgradesLimit : String) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1CoverageExpression {
    _builder.withGenericTermValue("BP7Limit37", greenUpgradesLimit)
    syncAvailability("BP7Limit37")
    return this
  }
  
  function withRelatedExpensesLimit(relatedExpensesLimit : String) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1CoverageExpression {
    _builder.withGenericTermValue("BP7RelatedExpenses1", relatedExpensesLimit)
    syncAvailability("BP7RelatedExpenses1")
    return this
  }
  
  function withNumberOfDaysForExtendedPeriodOfRestoration(numberOfDaysForExtendedPeriodOfRestoration : productmodel.OptionBP7PeriodOfRestoration1TypeValue) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1CoverageExpression {
    _builder.withOptionCovTerm("BP7PeriodOfRestoration1", numberOfDaysForExtendedPeriodOfRestoration.Description)
    syncAvailability("BP7PeriodOfRestoration1")
    return this
  }
  
  function withDescriptionOfProperty(descriptionOfProperty : String) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1CoverageExpression {
    _builder.withGenericTermValue("BP7DescriptionOfProperty", descriptionOfProperty)
    syncAvailability("BP7DescriptionOfProperty")
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
  
  function changeOn(period : PolicyPeriod) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1CoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1 {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7IncreasedCostOfLossAndReltdExpensesForGreenUpg1
  }
  
}