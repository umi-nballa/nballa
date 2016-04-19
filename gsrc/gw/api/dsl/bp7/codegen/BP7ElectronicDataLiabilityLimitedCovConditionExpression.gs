package gw.api.dsl.bp7.codegen

uses gw.api.builder.PolicyConditionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ElectronicDataLiabilityLimitedCovConditionExpression extends DataBuilderExpression<PolicyConditionBuilder> {

  
  construct() {
    super(new PolicyConditionBuilder(BP7ClassificationCond))
    _builder.withPatternCode("BP7ElectronicDataLiabilityLimitedCov")
  }
  
  function withLossOfElectronicDataLimit(lossOfElectronicDataLimit : String) : BP7ElectronicDataLiabilityLimitedCovConditionExpression {
    _builder.withGenericTermValue("BP7Limit35", lossOfElectronicDataLimit)
    syncAvailability("BP7Limit35")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7ClassificationCond>() {
      override function execute(clause : BP7ClassificationCond) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7ElectronicDataLiabilityLimitedCovConditionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ElectronicDataLiabilityLimitedCov {
    return new EntityRetriever<BP7ClassificationCond>(_builder).fromPeriod(period) as productmodel.BP7ElectronicDataLiabilityLimitedCov
  }
  
}