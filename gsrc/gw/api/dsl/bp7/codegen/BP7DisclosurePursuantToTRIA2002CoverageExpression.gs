package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7DisclosurePursuantToTRIA2002CoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7DisclosurePursuantToTRIA2002")
  }
  
  function withAdditionalInformationIfAnyConcerningTheTerrorismPremium(additionalInformationIfAnyConcerningTheTerrorismPremium : String) : BP7DisclosurePursuantToTRIA2002CoverageExpression {
    _builder.withGenericTermValue("BP7AdditionalInfo", additionalInformationIfAnyConcerningTheTerrorismPremium)
    syncAvailability("BP7AdditionalInfo")
    return this
  }
  
  function withFederalShareOfTerrorismLosses(federalShareOfTerrorismLosses : java.math.BigDecimal) : BP7DisclosurePursuantToTRIA2002CoverageExpression {
    _builder.withDirectTerm("BP7FedShareTerrorismLossesA", federalShareOfTerrorismLosses)
    syncAvailability("BP7FedShareTerrorismLossesA")
    return this
  }
  
  function withYear(year : java.lang.Integer) : BP7DisclosurePursuantToTRIA2002CoverageExpression {
    _builder.withGenericTermValue("BP7YearA", year)
    syncAvailability("BP7YearA")
    return this
  }
  
  function withBP7FedShareTerrorismLossesB(bP7FedShareTerrorismLossesB : java.math.BigDecimal) : BP7DisclosurePursuantToTRIA2002CoverageExpression {
    _builder.withDirectTerm("BP7FedShareTerrorismLossesB", bP7FedShareTerrorismLossesB)
    syncAvailability("BP7FedShareTerrorismLossesB")
    return this
  }
  
  function withBP7YearB(bP7YearB : java.lang.Integer) : BP7DisclosurePursuantToTRIA2002CoverageExpression {
    _builder.withGenericTermValue("BP7YearB", bP7YearB)
    syncAvailability("BP7YearB")
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
  
  function changeOn(period : PolicyPeriod) : BP7DisclosurePursuantToTRIA2002CoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7DisclosurePursuantToTRIA2002 {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7DisclosurePursuantToTRIA2002
  }
  
}