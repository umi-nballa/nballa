package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ApartmentBuildingsTenantsAutosItemCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineSchedCovItemCov))
    _builder.withPatternCode("BP7ApartmentBuildingsTenantsAutosItem")
  }
  
  function withLimit(limit : java.math.BigDecimal) : BP7ApartmentBuildingsTenantsAutosItemCoverageExpression {
    _builder.withDirectTerm("BP7NumLimits", limit)
    syncAvailability("BP7NumLimits")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineSchedCovItemCov>() {
      override function execute(clause : BP7LineSchedCovItemCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7ApartmentBuildingsTenantsAutosItemCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ApartmentBuildingsTenantsAutosItem {
    return new EntityRetriever<BP7LineSchedCovItemCov>(_builder).fromPeriod(period) as productmodel.BP7ApartmentBuildingsTenantsAutosItem
  }
  
}