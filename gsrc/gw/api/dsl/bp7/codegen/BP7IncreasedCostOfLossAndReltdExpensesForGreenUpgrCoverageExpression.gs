package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgr")
  }
  
  function withIncreasedCostOfLoss(increasedCostOfLoss : productmodel.OptionBP7IncreasedCostOfLossPctTypeValue) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression {
    _builder.withOptionCovTerm("BP7IncreasedCostOfLossPct", increasedCostOfLoss.Description)
    syncAvailability("BP7IncreasedCostOfLossPct")
    return this
  }
  
  function withGreenUpgradesLimit(greenUpgradesLimit : String) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression {
    _builder.withGenericTermValue("BP7Limit25", greenUpgradesLimit)
    syncAvailability("BP7Limit25")
    return this
  }
  
  function withRelatedExpensesLimit(relatedExpensesLimit : String) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression {
    _builder.withGenericTermValue("BP7RelatedExpenses", relatedExpensesLimit)
    syncAvailability("BP7RelatedExpenses")
    return this
  }
  
  function withNumberOfDaysForExtendedPeriodOfRestoration(numberOfDaysForExtendedPeriodOfRestoration : productmodel.OptionBP7PeriodOfRestorationTypeValue) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression {
    _builder.withOptionCovTerm("BP7PeriodOfRestoration", numberOfDaysForExtendedPeriodOfRestoration.Description)
    syncAvailability("BP7PeriodOfRestoration")
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
  
  function changeOn(period : PolicyPeriod) : BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgrCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgr {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7IncreasedCostOfLossAndReltdExpensesForGreenUpgr
  }
  
}