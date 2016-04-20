package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7MotelsCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7Motels")
  }
  
  function withGuestsPropertyLimit(guestsPropertyLimit : productmodel.OptionBP7GuestsPropLimitTypeValue) : BP7MotelsCoverageExpression {
    _builder.withOptionCovTerm("BP7GuestsPropLimit", guestsPropertyLimit.Description)
    syncAvailability("BP7GuestsPropLimit")
    return this
  }
  
  function withPerGuestLimit(perGuestLimit : productmodel.OptionBP7PerGuestLimitTypeValue) : BP7MotelsCoverageExpression {
    _builder.withOptionCovTerm("BP7PerGuestLimit", perGuestLimit.Description)
    syncAvailability("BP7PerGuestLimit")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7ClassificationCov>() {
      override function execute(clause : BP7ClassificationCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7MotelsCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7Motels {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7Motels
  }
  
}