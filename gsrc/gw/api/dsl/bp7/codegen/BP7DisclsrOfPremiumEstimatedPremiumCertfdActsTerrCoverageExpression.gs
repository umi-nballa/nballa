package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerr")
  }
  
  function withAPremiumThrough1231(aPremiumThrough1231 : String) : BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7ActualPremiumThrough1231051", aPremiumThrough1231)
    syncAvailability("BP7ActualPremiumThrough1231051")
    return this
  }
  
  function withBEstimatedPremiumBeyond1231(bEstimatedPremiumBeyond1231 : String) : BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7EstimatedPremiumPast123105", bEstimatedPremiumBeyond1231)
    syncAvailability("BP7EstimatedPremiumPast123105")
    return this
  }
  
  function withAdditionalInformationIfAnyConcerningTheTerrorismPremium(additionalInformationIfAnyConcerningTheTerrorismPremium : String) : BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7AdditionalInformation1", additionalInformationIfAnyConcerningTheTerrorismPremium)
    syncAvailability("BP7AdditionalInformation1")
    return this
  }
  
  function withFederalShareOfTerrorismLosses(federalShareOfTerrorismLosses : java.math.BigDecimal) : BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression {
    _builder.withDirectTerm("BP7FedShareTerrorismLossesA2", federalShareOfTerrorismLosses)
    syncAvailability("BP7FedShareTerrorismLossesA2")
    return this
  }
  
  function withYear(year : java.lang.Integer) : BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7YearA2", year)
    syncAvailability("BP7YearA2")
    return this
  }
  
  function withBP7FedShareTerrorismLossesB2(bP7FedShareTerrorismLossesB2 : java.math.BigDecimal) : BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression {
    _builder.withDirectTerm("BP7FedShareTerrorismLossesB2", bP7FedShareTerrorismLossesB2)
    syncAvailability("BP7FedShareTerrorismLossesB2")
    return this
  }
  
  function withBP7YearB2(bP7YearB2 : java.lang.Integer) : BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7YearB2", bP7YearB2)
    syncAvailability("BP7YearB2")
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
  
  function changeOn(period : PolicyPeriod) : BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerrCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerr {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7DisclsrOfPremiumEstimatedPremiumCertfdActsTerr
  }
  
}