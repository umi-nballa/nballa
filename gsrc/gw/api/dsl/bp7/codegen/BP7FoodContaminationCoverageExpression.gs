package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7FoodContaminationCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7FoodContamination")
  }
  
  function withFoodContaminationLimit(foodContaminationLimit : java.math.BigDecimal) : BP7FoodContaminationCoverageExpression {
    _builder.withDirectTerm("BP7Limit28", foodContaminationLimit)
    syncAvailability("BP7Limit28")
    return this
  }
  
  function withAdditionalAdvertisingExpenseLimit(additionalAdvertisingExpenseLimit : java.math.BigDecimal) : BP7FoodContaminationCoverageExpression {
    _builder.withDirectTerm("BP7AddlAdvertisingExpenseLimit", additionalAdvertisingExpenseLimit)
    syncAvailability("BP7AddlAdvertisingExpenseLimit")
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
  
  function changeOn(period : PolicyPeriod) : BP7FoodContaminationCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7FoodContamination {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7FoodContamination
  }
  
}