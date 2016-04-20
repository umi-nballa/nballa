package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7SeedMerchantsCovErroneousDeliveryOrMixtureRsltgCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7SeedMerchantsCovErroneousDeliveryOrMixtureRsltg")
  }
  
  function changeOn(period : PolicyPeriod) : BP7SeedMerchantsCovErroneousDeliveryOrMixtureRsltgCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7SeedMerchantsCovErroneousDeliveryOrMixtureRsltg {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7SeedMerchantsCovErroneousDeliveryOrMixtureRsltg
  }
  
}