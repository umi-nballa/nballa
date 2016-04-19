package gw.api.dsl.bp7.codegen

uses gw.api.builder.ExclusionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ExclErroneousDeliveryOrMixAndRsltgFailrOfSeedToExclusionExpression extends DataBuilderExpression<ExclusionBuilder> {

  
  construct() {
    super(new ExclusionBuilder(BP7ClassificationExcl))
    _builder.withPatternCode("BP7ExclErroneousDeliveryOrMixAndRsltgFailrOfSeedTo")
  }
  
  function changeOn(period : PolicyPeriod) : BP7ExclErroneousDeliveryOrMixAndRsltgFailrOfSeedToExclusionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ExclErroneousDeliveryOrMixAndRsltgFailrOfSeedTo {
    return new EntityRetriever<BP7ClassificationExcl>(_builder).fromPeriod(period) as productmodel.BP7ExclErroneousDeliveryOrMixAndRsltgFailrOfSeedTo
  }
  
}