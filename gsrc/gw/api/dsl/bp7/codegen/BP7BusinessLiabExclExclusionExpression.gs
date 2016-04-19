package gw.api.dsl.bp7.codegen

uses gw.api.builder.ExclusionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7BusinessLiabExclExclusionExpression extends DataBuilderExpression<ExclusionBuilder> {

  
  construct() {
    super(new ExclusionBuilder(BP7LocationExcl))
    _builder.withPatternCode("BP7BusinessLiabExcl")
  }
  
  function withExclusionType(exclusionType : productmodel.OptionBP7ExclTypeTypeValue) : BP7BusinessLiabExclExclusionExpression {
    _builder.withOptionCovTerm("BP7ExclType", exclusionType.Description)
    syncAvailability("BP7ExclType")
    return this
  }
  
  function withDescription(description : String) : BP7BusinessLiabExclExclusionExpression {
    _builder.withGenericTermValue("BP7ExclDesc", description)
    syncAvailability("BP7ExclDesc")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LocationExcl>() {
      override function execute(clause : BP7LocationExcl) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7BusinessLiabExclExclusionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7BusinessLiabExcl {
    return new EntityRetriever<BP7LocationExcl>(_builder).fromPeriod(period) as productmodel.BP7BusinessLiabExcl
  }
  
}