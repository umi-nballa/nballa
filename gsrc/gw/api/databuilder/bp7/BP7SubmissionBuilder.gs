package gw.api.databuilder.bp7

uses gw.api.builder.AccountBuilder
uses gw.api.builder.SubmissionBuilder

class BP7SubmissionBuilder extends SubmissionBuilder {

  construct(lineBuilder : BP7BusinessOwnersLineBuilder, accountBuilder : AccountBuilder) {
    withProduct("BP7BusinessOwners")
    withPolicyLine(lineBuilder)
    withAccount(accountBuilder)
  }  
}
