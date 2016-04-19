package gw.api.dsl.bp7.expressions

uses gw.api.databuilder.bp7.BP7BusinessOwnersLineBuilder
uses gw.api.builder.AccountBuilder
uses gw.api.databuilder.bp7.BP7SubmissionBuilder
uses gw.api.dsl.common.SubmissionExpression
uses gw.api.builder.PolicyAddressBuilder
uses java.util.Date
uses gw.api.dsl.common.EntityRetriever

class BP7SubmissionExpression extends 
  SubmissionExpression<BP7SubmissionBuilder, BP7BusinessOwnersLineBuilder, BP7SubmissionExpression> {
  
  var _lineBuilder : BP7BusinessOwnersLineBuilder as readonly LineBuilder = new BP7BusinessOwnersLineBuilder()
  var _accountBuilder : AccountBuilder as readonly AccountBuilder = new AccountBuilder()
  var _submissionBuilder : BP7SubmissionBuilder as readonly DataBuilder
  
  construct() {
    _lineBuilder
      .withBusinessDescription("A business description")
      .withDateBusinessStarted(new Date("01/01/2013"))
    _submissionBuilder = new BP7SubmissionBuilder(_lineBuilder, _accountBuilder) 
    _submissionBuilder
      .withBaseState(TC_MN)
  }

  function with(policyAddress : PolicyAddressBuilder) : BP7SubmissionExpression {
    _submissionBuilder.withPolicyAddress(policyAddress)
    return this
  }

  function with(location : BP7LocationExpression) : BP7SubmissionExpression {
    _lineBuilder.with(location.DataBuilder)
    _submissionBuilder.withPolicyLocation(location.PolicyLocation)
    
    return this
  }
  
  function with(blanket : BP7BlanketExpression) : BP7SubmissionExpression {
    _lineBuilder.with(blanket.DataBuilder)
    return this
  }

  function with(modifier : BP7LineModifierExpression) : BP7SubmissionExpression {
    _lineBuilder.with(modifier.ModBuilder)
    return this
  }

  function withPrimary(location : BP7LocationExpression) : BP7SubmissionExpression {
    location.DataBuilder.setAsPrimary()
    _lineBuilder.with(location.DataBuilder)
    _submissionBuilder.withPrimaryPolicyLocation(location.PolicyLocation)
    
    return this
  }

  function withLineBusinessType(type : BP7PropertyType) : BP7SubmissionExpression {
    _lineBuilder.withLineBusinessType(type)
    return this
  }
  
  function withBusinessDescription(description : String) : BP7SubmissionExpression {
    _lineBuilder.withBusinessDescription(description)
    return this
  }

  function withEffectiveDate(date : Date) : BP7SubmissionExpression {
    _lineBuilder.withEffectiveDate(date)
    return this
  }

  function withExpirationDate(date : Date) : BP7SubmissionExpression {
    _lineBuilder.withExpirationDate(date)
    return this
  }

  override property get SubmissionBuilder() : BP7SubmissionBuilder {
    return _submissionBuilder
  }

  function lineFromPeriod(period : PolicyPeriod) : BP7BusinessOwnersLine {
    return new EntityRetriever<BP7BusinessOwnersLine>(_lineBuilder).fromPeriod(period)
  }
}
