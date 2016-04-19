package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7AddlInsdManagersLessorsPremisesItemCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LocSchedCovItemCov))
    _builder.withPatternCode("BP7AddlInsdManagersLessorsPremisesItem")
  }
  
  function withRiskType(riskType : productmodel.OptionBP7TypeRisk1TypeValue) : BP7AddlInsdManagersLessorsPremisesItemCoverageExpression {
    _builder.withOptionCovTerm("BP7TypeRisk1", riskType.Description)
    syncAvailability("BP7TypeRisk1")
    return this
  }
  
  function withGeneralLiabilityClassCode(generalLiabilityClassCode : String) : BP7AddlInsdManagersLessorsPremisesItemCoverageExpression {
    _builder.withGenericTermValue("BP7CGLClassCode5", generalLiabilityClassCode)
    syncAvailability("BP7CGLClassCode5")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LocSchedCovItemCov>() {
      override function execute(clause : BP7LocSchedCovItemCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7AddlInsdManagersLessorsPremisesItemCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7AddlInsdManagersLessorsPremisesItem {
    return new EntityRetriever<BP7LocSchedCovItemCov>(_builder).fromPeriod(period) as productmodel.BP7AddlInsdManagersLessorsPremisesItem
  }
  
}