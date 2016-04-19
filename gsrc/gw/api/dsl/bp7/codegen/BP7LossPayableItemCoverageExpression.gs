package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7LossPayableItemCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BldgSchedCovItemCov))
    _builder.withPatternCode("BP7LossPayableItem")
  }
  
  function withLossPayeeType(lossPayeeType : productmodel.OptionBP7TypePayeeTypeValue) : BP7LossPayableItemCoverageExpression {
    _builder.withOptionCovTerm("BP7TypePayee", lossPayeeType.Description)
    syncAvailability("BP7TypePayee")
    return this
  }
  
  function withDescriptionOfProperty(descriptionOfProperty : String) : BP7LossPayableItemCoverageExpression {
    _builder.withGenericTermValue("BP7PropertyDesc", descriptionOfProperty)
    syncAvailability("BP7PropertyDesc")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7BldgSchedCovItemCov>() {
      override function execute(clause : BP7BldgSchedCovItemCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7LossPayableItemCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7LossPayableItem {
    return new EntityRetriever<BP7BldgSchedCovItemCov>(_builder).fromPeriod(period) as productmodel.BP7LossPayableItem
  }
  
}