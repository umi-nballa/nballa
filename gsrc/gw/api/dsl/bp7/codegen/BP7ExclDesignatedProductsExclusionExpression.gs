package gw.api.dsl.bp7.codegen

uses gw.api.builder.ExclusionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ExclDesignatedProductsExclusionExpression extends DataBuilderExpression<ExclusionBuilder> {

  
  construct() {
    super(new ExclusionBuilder(BP7LineExcl))
    _builder.withPatternCode("BP7ExclDesignatedProducts")
  }
  
  function withDesignatedProducts(designatedProducts : String) : BP7ExclDesignatedProductsExclusionExpression {
    _builder.withGenericTermValue("BP7DesignatedProducts", designatedProducts)
    syncAvailability("BP7DesignatedProducts")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineExcl>() {
      override function execute(clause : BP7LineExcl) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7ExclDesignatedProductsExclusionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ExclDesignatedProducts {
    return new EntityRetriever<BP7LineExcl>(_builder).fromPeriod(period) as productmodel.BP7ExclDesignatedProducts
  }
  
}