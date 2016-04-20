package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7VacancyPermitCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7VacancyPermit")
  }
  
  function withExceptedCausesOfLoss(exceptedCausesOfLoss : productmodel.OptionBP7CauseOfLossTypeValue) : BP7VacancyPermitCoverageExpression {
    _builder.withOptionCovTerm("BP7CauseOfLoss", exceptedCausesOfLoss.Description)
    syncAvailability("BP7CauseOfLoss")
    return this
  }
  
  function withStartDate(startDate : java.util.Date) : BP7VacancyPermitCoverageExpression {
    _builder.withGenericTermValue("BP7StartDate", startDate)
    syncAvailability("BP7StartDate")
    return this
  }
  
  function withEndDate(endDate : java.util.Date) : BP7VacancyPermitCoverageExpression {
    _builder.withGenericTermValue("BP7EndDate", endDate)
    syncAvailability("BP7EndDate")
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
  
  function changeOn(period : PolicyPeriod) : BP7VacancyPermitCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7VacancyPermit {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7VacancyPermit
  }
  
}