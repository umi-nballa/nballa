package gw.api.dsl.bp7.codegen

uses gw.api.builder.PolicyConditionBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7LimitationsOfCovForCertfdActsTerrsmConditionExpression extends DataBuilderExpression<PolicyConditionBuilder> {

  
  construct() {
    super(new PolicyConditionBuilder(BP7LineCond))
    _builder.withPatternCode("BP7LimitationsOfCovForCertfdActsTerrsm")
  }
  
  function withDescriptionOfPropertyOrCoverage(descriptionOfPropertyOrCoverage : String) : BP7LimitationsOfCovForCertfdActsTerrsmConditionExpression {
    _builder.withGenericTermValue("BP7DescriptionOfPropertyOr", descriptionOfPropertyOrCoverage)
    syncAvailability("BP7DescriptionOfPropertyOr")
    return this
  }
  
  function withCertifiedActsSubLimit(certifiedActsSubLimit : String) : BP7LimitationsOfCovForCertfdActsTerrsmConditionExpression {
    _builder.withGenericTermValue("BP7CertifiedActsSubLimit", certifiedActsSubLimit)
    syncAvailability("BP7CertifiedActsSubLimit")
    return this
  }
  
  function withExceptionNonApplicabilityOfCertifiedActsSubLimitToCertainFireLossesReferToParagraphB2PropertyCoverageLocatedInTheFollowingStateS(exceptionNonApplicabilityOfCertifiedActsSubLimitToCertainFireLossesReferToParagraphB2PropertyCoverageLocatedInTheFollowingStateS : String) : BP7LimitationsOfCovForCertfdActsTerrsmConditionExpression {
    _builder.withGenericTermValue("BP7StateExceptionSFP2", exceptionNonApplicabilityOfCertifiedActsSubLimitToCertainFireLossesReferToParagraphB2PropertyCoverageLocatedInTheFollowingStateS)
    syncAvailability("BP7StateExceptionSFP2")
    return this
  }
  
  function withCertifiedActsOfTerrorismAggregateLimitReferToParagraphC2LiabilityAndMedicalExpensesCoverage(certifiedActsOfTerrorismAggregateLimitReferToParagraphC2LiabilityAndMedicalExpensesCoverage : String) : BP7LimitationsOfCovForCertfdActsTerrsmConditionExpression {
    _builder.withGenericTermValue("BP7CertifiedActsOfTerrorismAggregateLimit", certifiedActsOfTerrorismAggregateLimitReferToParagraphC2LiabilityAndMedicalExpensesCoverage)
    syncAvailability("BP7CertifiedActsOfTerrorismAggregateLimit")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineCond>() {
      override function execute(clause : BP7LineCond) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7LimitationsOfCovForCertfdActsTerrsmConditionExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7LimitationsOfCovForCertfdActsTerrsm {
    return new EntityRetriever<BP7LineCond>(_builder).fromPeriod(period) as productmodel.BP7LimitationsOfCovForCertfdActsTerrsm
  }
  
}