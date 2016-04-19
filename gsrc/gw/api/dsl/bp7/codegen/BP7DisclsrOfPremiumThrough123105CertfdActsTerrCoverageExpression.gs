package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7DisclsrOfPremiumThrough123105CertfdActsTerrCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7DisclsrOfPremiumThrough123105CertfdActsTerr")
  }
  
  function withTerrorismPremiumCertifiedActsThrough1231(terrorismPremiumCertifiedActsThrough1231 : String) : BP7DisclsrOfPremiumThrough123105CertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7ActualPremiumThrough123105", terrorismPremiumCertifiedActsThrough1231)
    syncAvailability("BP7ActualPremiumThrough123105")
    return this
  }
  
  function withAdditionalInformationIfAnyConcerningTheTerrorismPremium(additionalInformationIfAnyConcerningTheTerrorismPremium : String) : BP7DisclsrOfPremiumThrough123105CertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7AdditionalInformation", additionalInformationIfAnyConcerningTheTerrorismPremium)
    syncAvailability("BP7AdditionalInformation")
    return this
  }
  
  function withFederalShareOfTerrorismLosses(federalShareOfTerrorismLosses : java.math.BigDecimal) : BP7DisclsrOfPremiumThrough123105CertfdActsTerrCoverageExpression {
    _builder.withDirectTerm("BP7FedShareTerrorismLossesA1", federalShareOfTerrorismLosses)
    syncAvailability("BP7FedShareTerrorismLossesA1")
    return this
  }
  
  function withYear(year : java.lang.Integer) : BP7DisclsrOfPremiumThrough123105CertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7YearA1", year)
    syncAvailability("BP7YearA1")
    return this
  }
  
  function withBP7FedShareTerrorismLossesB1(bP7FedShareTerrorismLossesB1 : java.math.BigDecimal) : BP7DisclsrOfPremiumThrough123105CertfdActsTerrCoverageExpression {
    _builder.withDirectTerm("BP7FedShareTerrorismLossesB1", bP7FedShareTerrorismLossesB1)
    syncAvailability("BP7FedShareTerrorismLossesB1")
    return this
  }
  
  function withBP7YearB1(bP7YearB1 : java.lang.Integer) : BP7DisclsrOfPremiumThrough123105CertfdActsTerrCoverageExpression {
    _builder.withGenericTermValue("BP7YearB1", bP7YearB1)
    syncAvailability("BP7YearB1")
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
  
  function changeOn(period : PolicyPeriod) : BP7DisclsrOfPremiumThrough123105CertfdActsTerrCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7DisclsrOfPremiumThrough123105CertfdActsTerr {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7DisclsrOfPremiumThrough123105CertfdActsTerr
  }
  
}