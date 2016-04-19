package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7SpoilgCovCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7SpoilgCov")
  }
  
  function withLimit(limit : java.math.BigDecimal) : BP7SpoilgCovCoverageExpression {
    _builder.withDirectTerm("BP7Limit32", limit)
    syncAvailability("BP7Limit32")
    return this
  }
  
  function withDeductible(deductible : productmodel.OptionBP7Ded2TypeValue) : BP7SpoilgCovCoverageExpression {
    _builder.withOptionCovTerm("BP7Ded2", deductible.Description)
    syncAvailability("BP7Ded2")
    return this
  }
  
  function withCoverageType(coverageType : productmodel.OptionBP7CovType2TypeValue) : BP7SpoilgCovCoverageExpression {
    _builder.withOptionCovTerm("BP7CovType2", coverageType.Description)
    syncAvailability("BP7CovType2")
    return this
  }
  
  function withClassification(classification : productmodel.OptionBP7ClassTypeValue) : BP7SpoilgCovCoverageExpression {
    _builder.withOptionCovTerm("BP7Class", classification.Description)
    syncAvailability("BP7Class")
    return this
  }
  
  function withRefrigerationMaintenanceAgreement(refrigerationMaintenanceAgreement : productmodel.OptionBP7MaintenanceAgreement1TypeValue) : BP7SpoilgCovCoverageExpression {
    _builder.withOptionCovTerm("BP7MaintenanceAgreement1", refrigerationMaintenanceAgreement.Description)
    syncAvailability("BP7MaintenanceAgreement1")
    return this
  }
  
  function withDescriptionOfPerishableStock(descriptionOfPerishableStock : String) : BP7SpoilgCovCoverageExpression {
    _builder.withGenericTermValue("BP7PerishableStockDesc", descriptionOfPerishableStock)
    syncAvailability("BP7PerishableStockDesc")
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
  
  function changeOn(period : PolicyPeriod) : BP7SpoilgCovCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7SpoilgCov {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7SpoilgCov
  }
  
}