package gw.api.dsl.bp7.codegen

uses gw.api.builder.ExclusionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ExclOfLossDueToByProdsOfProductionOrProcessingOExclusionExpression extends DataBuilderExpression<ExclusionBuilder> {

  
  construct() {
    super(new ExclusionBuilder(BP7BuildingExcl))
    _builder.withPatternCode("BP7ExclOfLossDueToByProdsOfProductionOrProcessingO")
  }
  
  function withDescriptionOfRentalUnit(descriptionOfRentalUnit : String) : BP7ExclOfLossDueToByProdsOfProductionOrProcessingOExclusionExpression {
    _builder.withGenericTermValue("BP7DescriptionOfRentalUnit", descriptionOfRentalUnit)
    syncAvailability("BP7DescriptionOfRentalUnit")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7BuildingExcl>() {
      override function execute(clause : BP7BuildingExcl) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7ExclOfLossDueToByProdsOfProductionOrProcessingOExclusionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ExclOfLossDueToByProdsOfProductionOrProcessingO {
    return new EntityRetriever<BP7BuildingExcl>(_builder).fromPeriod(period) as productmodel.BP7ExclOfLossDueToByProdsOfProductionOrProcessingO
  }
  
}