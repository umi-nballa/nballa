package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7EmpBenefitsLiabCovCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7EmpBenefitsLiabCov")
  }
  
  function withEmployeeBenefitsProgram(employeeBenefitsProgram : String) : BP7EmpBenefitsLiabCovCoverageExpression {
    _builder.withGenericTermValue("BP7EmployeeBenefitsProgramDesc", employeeBenefitsProgram)
    syncAvailability("BP7EmployeeBenefitsProgramDesc")
    return this
  }
  
  function withEachEmployeeLimit(eachEmployeeLimit : java.math.BigDecimal) : BP7EmpBenefitsLiabCovCoverageExpression {
    _builder.withDirectTerm("BP7EachEmployeeLimit", eachEmployeeLimit)
    syncAvailability("BP7EachEmployeeLimit")
    return this
  }
  
  function withAggregateLimit(aggregateLimit : java.math.BigDecimal) : BP7EmpBenefitsLiabCovCoverageExpression {
    _builder.withDirectTerm("BP7AggregateLimit1", aggregateLimit)
    syncAvailability("BP7AggregateLimit1")
    return this
  }
  
  function withDeductible(deductible : java.math.BigDecimal) : BP7EmpBenefitsLiabCovCoverageExpression {
    _builder.withDirectTerm("BP7Deductible1", deductible)
    syncAvailability("BP7Deductible1")
    return this
  }
  
  function withRetroactiveDate(retroactiveDate : java.util.Date) : BP7EmpBenefitsLiabCovCoverageExpression {
    _builder.withGenericTermValue("BP7RetroDate", retroactiveDate)
    syncAvailability("BP7RetroDate")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineCov>() {
      override function execute(clause : BP7LineCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7EmpBenefitsLiabCovCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7EmpBenefitsLiabCov {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7EmpBenefitsLiabCov
  }
  
}