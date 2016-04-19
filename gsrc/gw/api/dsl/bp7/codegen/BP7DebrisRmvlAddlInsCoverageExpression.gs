package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7DebrisRmvlAddlInsCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7DebrisRmvlAddlIns")
  }
  
  function withDebrisRemovalAmount(debrisRemovalAmount : java.math.BigDecimal) : BP7DebrisRmvlAddlInsCoverageExpression {
    _builder.withDirectTerm("BP7Limit21", debrisRemovalAmount)
    syncAvailability("BP7Limit21")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7BuildingCov>() {
      override function execute(clause : BP7BuildingCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7DebrisRmvlAddlInsCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7DebrisRmvlAddlIns {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7DebrisRmvlAddlIns
  }
  
}