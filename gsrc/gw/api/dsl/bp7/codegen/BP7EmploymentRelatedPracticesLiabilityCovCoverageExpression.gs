package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7EmploymentRelatedPracticesLiabilityCov")
  }
  
  function withCoverageType(coverageType : productmodel.OptionBP7CovTypeTypeValue) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withOptionCovTerm("BP7CovType", coverageType.Description)
    syncAvailability("BP7CovType")
    return this
  }
  
  function withAnnualAggregateLimit(annualAggregateLimit : productmodel.OptionBP7AggLimit1TypeValue) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withOptionCovTerm("BP7AggLimit1", annualAggregateLimit.Description)
    syncAvailability("BP7AggLimit1")
    return this
  }
  
  function withSupplementalLimit(supplementalLimit : productmodel.OptionBP7SuppllLimitTypeValue) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withOptionCovTerm("BP7SuppllLimit", supplementalLimit.Description)
    syncAvailability("BP7SuppllLimit")
    return this
  }
  
  function withDeductibleAmount(deductibleAmount : productmodel.OptionBP7DedTypeValue) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withOptionCovTerm("BP7Ded", deductibleAmount.Description)
    syncAvailability("BP7Ded")
    return this
  }
  
  function withNumberOfEmployees(numberOfEmployees : java.math.BigDecimal) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withDirectTerm("BP7NumEmployees", numberOfEmployees)
    syncAvailability("BP7NumEmployees")
    return this
  }
  
  function withRetroactiveDate(retroactiveDate : java.util.Date) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withGenericTermValue("BP7RetroDate1", retroactiveDate)
    syncAvailability("BP7RetroDate1")
    return this
  }
  
  function withExtendedReportingPeriod(extendedReportingPeriod : Boolean) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withGenericTermValue("BP7ExtddRptgPeriod1", extendedReportingPeriod)
    syncAvailability("BP7ExtddRptgPeriod1")
    return this
  }
  
  function withPriorOrPendingLitigationDate(priorOrPendingLitigationDate : java.util.Date) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withGenericTermValue("BP7PriorOrPendingLitigationDate", priorOrPendingLitigationDate)
    syncAvailability("BP7PriorOrPendingLitigationDate")
    return this
  }
  
  function withEmploymentRelatedMaliciousProsecution(employmentRelatedMaliciousProsecution : Boolean) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    _builder.withGenericTermValue("BP7MaliciousProsecution", employmentRelatedMaliciousProsecution)
    syncAvailability("BP7MaliciousProsecution")
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
  
  function changeOn(period : PolicyPeriod) : BP7EmploymentRelatedPracticesLiabilityCovCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7EmploymentRelatedPracticesLiabilityCov {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7EmploymentRelatedPracticesLiabilityCov
  }
  
}