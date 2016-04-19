package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7CondoCommlUnitOwnersOptionalCovsCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7CondoCommlUnitOwnersOptionalCovs")
  }
  
  function withLossAssessmentLimit(lossAssessmentLimit : productmodel.OptionBP7Limit26TypeValue) : BP7CondoCommlUnitOwnersOptionalCovsCoverageExpression {
    _builder.withOptionCovTerm("BP7Limit26", lossAssessmentLimit.Description)
    syncAvailability("BP7Limit26")
    return this
  }
  
  function withSubLimitForCondominiumAssociationDeductible(subLimitForCondominiumAssociationDeductible : java.math.BigDecimal) : BP7CondoCommlUnitOwnersOptionalCovsCoverageExpression {
    _builder.withDirectTerm("BP7SubLimitForCondominiumAssociationDeductible", subLimitForCondominiumAssociationDeductible)
    syncAvailability("BP7SubLimitForCondominiumAssociationDeductible")
    return this
  }
  
  function withMiscellaneousRealPropertyLimit(miscellaneousRealPropertyLimit : java.math.BigDecimal) : BP7CondoCommlUnitOwnersOptionalCovsCoverageExpression {
    _builder.withDirectTerm("BP7Limit27", miscellaneousRealPropertyLimit)
    syncAvailability("BP7Limit27")
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
  
  function changeOn(period : PolicyPeriod) : BP7CondoCommlUnitOwnersOptionalCovsCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7CondoCommlUnitOwnersOptionalCovs {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7CondoCommlUnitOwnersOptionalCovs
  }
  
}