package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7ElectronicCommerceCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7ElectronicCommerce")
  }
  
  function withDescriptionOfBusiness(descriptionOfBusiness : String) : BP7ElectronicCommerceCoverageExpression {
    _builder.withGenericTermValue("BP7DescBusn", descriptionOfBusiness)
    syncAvailability("BP7DescBusn")
    return this
  }
  
  function withLocationOfBusiness(locationOfBusiness : String) : BP7ElectronicCommerceCoverageExpression {
    _builder.withGenericTermValue("BP7AddressID", locationOfBusiness)
    syncAvailability("BP7AddressID")
    return this
  }
  
  function withAnnualAggregateLimitOfInsurance(annualAggregateLimitOfInsurance : String) : BP7ElectronicCommerceCoverageExpression {
    _builder.withGenericTermValue("BP7Limit16", annualAggregateLimitOfInsurance)
    syncAvailability("BP7Limit16")
    return this
  }
  
  function withAntiVirusWaiver(antiVirusWaiver : Boolean) : BP7ElectronicCommerceCoverageExpression {
    _builder.withGenericTermValue("BP7AntiVirusWaiver", antiVirusWaiver)
    syncAvailability("BP7AntiVirusWaiver")
    return this
  }
  
  function withSectionIDeductible(sectionIDeductible : String) : BP7ElectronicCommerceCoverageExpression {
    _builder.withGenericTermValue("BP7Ded1", sectionIDeductible)
    syncAvailability("BP7Ded1")
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
  
  function changeOn(period : PolicyPeriod) : BP7ElectronicCommerceCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7ElectronicCommerce {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7ElectronicCommerce
  }
  
}