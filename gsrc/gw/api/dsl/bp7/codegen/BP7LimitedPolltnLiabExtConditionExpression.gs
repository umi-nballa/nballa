package gw.api.dsl.bp7.codegen

uses gw.api.builder.PolicyConditionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7LimitedPolltnLiabExtConditionExpression extends DataBuilderExpression<PolicyConditionBuilder> {

  
  construct() {
    super(new PolicyConditionBuilder(BP7LineCond))
    _builder.withPatternCode("BP7LimitedPolltnLiabExt")
  }
  
  function withAggregateLimit(aggregateLimit : java.math.BigDecimal) : BP7LimitedPolltnLiabExtConditionExpression {
    _builder.withDirectTerm("BP7AggregateLimit4", aggregateLimit)
    syncAvailability("BP7AggregateLimit4")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineCond>() {
      override function execute(clause : BP7LineCond) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7LimitedPolltnLiabExtConditionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7LimitedPolltnLiabExt {
    return new EntityRetriever<BP7LineCond>(_builder).fromPeriod(period) as productmodel.BP7LimitedPolltnLiabExt
  }
  
}