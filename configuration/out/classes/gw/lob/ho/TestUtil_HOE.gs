package gw.lob.ho

uses gw.api.builder.PolicyChangeBuilder
uses gw.transaction.Transaction
uses java.util.Date
uses gw.api.builder.CancellationBuilder

class TestUtil_HOE {

  construct() {
  }
  
  static function addPolicyChange(submission : PolicyPeriod, effDate : Date) : PolicyPeriod {
    var period: PolicyPeriod;
    Transaction.runWithNewBundle(\bundle -> {
      period = new PolicyChangeBuilder()
        .withBasedOnPeriod( submission )
        .withStatus(DRAFT)
        .withPolicyNumber( submission.PolicyNumber + "-1" )
        .withEffectiveDate(effDate)
        .withEffectiveTimeFromPlugin(false)
        .create(bundle)
    })
    return period
  }

  static function cancelAndBindForRewrite(policy : PolicyPeriod) : PolicyPeriod {
    var cancellation = new CancellationBuilder()
      .withBasedOnPeriod( policy )
      .canceledByCarrier()
      .withCancelReasonCode("flatrewrite")
      .isBound()
      .createAndCommit()
    return cancellation
  }
  
  
}
