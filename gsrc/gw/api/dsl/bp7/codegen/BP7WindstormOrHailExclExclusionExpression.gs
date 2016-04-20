package gw.api.dsl.bp7.codegen

uses gw.api.builder.ExclusionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7WindstormOrHailExclExclusionExpression extends DataBuilderExpression<ExclusionBuilder> {

  
  construct() {
    super(new ExclusionBuilder(BP7BuildingExcl))
    _builder.withPatternCode("BP7WindstormOrHailExcl")
  }
  
  function changeOn(period : PolicyPeriod) : BP7WindstormOrHailExclExclusionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7WindstormOrHailExcl {
    return new EntityRetriever<BP7BuildingExcl>(_builder).fromPeriod(period) as productmodel.BP7WindstormOrHailExcl
  }
  
}