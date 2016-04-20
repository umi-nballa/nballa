package gw.api.dsl.bp7.codegen

uses gw.api.builder.ExclusionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ExclSilicaSilicaRelatedDustExclusionExpression extends DataBuilderExpression<ExclusionBuilder> {

  
  construct() {
    super(new ExclusionBuilder(BP7LineExcl))
    _builder.withPatternCode("BP7ExclSilicaSilicaRelatedDust")
  }
  
  function changeOn(period : PolicyPeriod) : BP7ExclSilicaSilicaRelatedDustExclusionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ExclSilicaSilicaRelatedDust {
    return new EntityRetriever<BP7LineExcl>(_builder).fromPeriod(period) as productmodel.BP7ExclSilicaSilicaRelatedDust
  }
  
}