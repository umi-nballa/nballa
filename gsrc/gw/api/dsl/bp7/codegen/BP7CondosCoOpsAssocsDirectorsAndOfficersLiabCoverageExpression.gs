package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7CondosCoOpsAssocsDirectorsAndOfficersLiab")
  }
  
  function withManualBaseRate(manualBaseRate : String) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withGenericTermValue("BP7ManualBaseRate", manualBaseRate)
    syncAvailability("BP7ManualBaseRate")
    return this
  }
  
  function withNamedAssociation(namedAssociation : String) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withGenericTermValue("BP7NamedAssoc", namedAssociation)
    syncAvailability("BP7NamedAssoc")
    return this
  }
  
  function withDirectorsAndOfficersLiabilityAnnualAggregateLimitOfInsurance(directorsAndOfficersLiabilityAnnualAggregateLimitOfInsurance : productmodel.OptionBP7AggLimitTypeValue) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withOptionCovTerm("BP7AggLimit", directorsAndOfficersLiabilityAnnualAggregateLimitOfInsurance.Description)
    syncAvailability("BP7AggLimit")
    return this
  }
  
  function withDeductible(deductible : productmodel.OptionBP7DeductibleTypeValue) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withOptionCovTerm("BP7Deductible", deductible.Description)
    syncAvailability("BP7Deductible")
    return this
  }
  
  function withPendingOrPriorLitigationDate(pendingOrPriorLitigationDate : java.util.Date) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withGenericTermValue("BP7PendingOrPriorLitigationDate", pendingOrPriorLitigationDate)
    syncAvailability("BP7PendingOrPriorLitigationDate")
    return this
  }
  
  function withRetroactiveDate(retroactiveDate : productmodel.OptionBP7RetroDateSelectTypeValue) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withOptionCovTerm("BP7RetroDateSelect", retroactiveDate.Description)
    syncAvailability("BP7RetroDateSelect")
    return this
  }
  
  function withEnterRetroactiveDate(enterRetroactiveDate : java.util.Date) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withGenericTermValue("BP7RetroactiveDate", enterRetroactiveDate)
    syncAvailability("BP7RetroactiveDate")
    return this
  }
  
  function withExtendedReportingPeriod(extendedReportingPeriod : Boolean) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withGenericTermValue("BP7ExtddRptgPeriod", extendedReportingPeriod)
    syncAvailability("BP7ExtddRptgPeriod")
    return this
  }
  
  function withExtendedReportingPeriodPremium(extendedReportingPeriodPremium : String) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    _builder.withGenericTermValue("BP7ExtendedReportingPeriodPremium", extendedReportingPeriodPremium)
    syncAvailability("BP7ExtendedReportingPeriodPremium")
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
  
  function changeOn(period : PolicyPeriod) : BP7CondosCoOpsAssocsDirectorsAndOfficersLiabCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7CondosCoOpsAssocsDirectorsAndOfficersLiab {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7CondosCoOpsAssocsDirectorsAndOfficersLiab
  }
  
}