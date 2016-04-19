package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7BusinessIncomeScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LineSchedCovItemBuilder>(BP7LineSchedCov))
    _builder.withPatternCode("BP7BusinessIncome")
  }
  
  function withOrdinaryPayrollNumberOfDays(ordinaryPayrollNumberOfDays : productmodel.OptionBP7BusnIncomeOrdinaryPayrollNumDaysTypeValue) : BP7BusinessIncomeScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7BusnIncomeOrdinaryPayrollNumDays", ordinaryPayrollNumberOfDays.Description)
    syncAvailability("BP7BusnIncomeOrdinaryPayrollNumDays")
    return this
  }
  
  function withExemptEmployeesJobs(exemptEmployeesJobs : Boolean) : BP7BusinessIncomeScheduledCoverageExpression {
    _builder.withGenericTermValue("BP7Exempt", exemptEmployeesJobs)
    syncAvailability("BP7Exempt")
    return this
  }
  
  function withExtendedPeriodOfIndemnityNumberOfDays(extendedPeriodOfIndemnityNumberOfDays : productmodel.OptionBP7BusnIncomeExtddPeriodNumDaysTypeValue) : BP7BusinessIncomeScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7BusnIncomeExtddPeriodNumDays", extendedPeriodOfIndemnityNumberOfDays.Description)
    syncAvailability("BP7BusnIncomeExtddPeriodNumDays")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineSchedCov>() {
      override function execute(clause : BP7LineSchedCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function with(scheduleItem : BP7BusinessIncomeScheduledItemExpression) : BP7BusinessIncomeScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7BusinessIncomeScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7BusinessIncome {
    return new EntityRetriever<BP7LineSchedCov>(_builder).fromPeriod(period) as productmodel.BP7BusinessIncome
  }
  
}