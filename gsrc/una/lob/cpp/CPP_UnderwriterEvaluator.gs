package una.lob.cpp


uses gw.lob.common.AbstractUnderwriterEvaluator
uses gw.policy.PolicyEvalContext
uses java.util.Set
uses gw.lang.reflect.IType

/**
 * Created with IntelliJ IDEA.
 * User: dvillapakkam
 * Date: 5/18/16
 * Time: 10:16 PM
 * To change this template use File | Settings | File Templates.
 */

class CPP_UnderwriterEvaluator extends AbstractUnderwriterEvaluator {

  private static final var  PREQUAL_IDENTIFIER = "CRP_Qual_Ext"

  construct(policyEvalContext : PolicyEvalContext) {
    super(policyEvalContext)
  }

  override function canEvaluate() : boolean {
    var allowedJobs : Set<IType> = {Submission, PolicyChange, Reinstatement, Renewal, Rewrite, Issuance, RewriteNewAccount}
    return allowedJobs.contains(typeof(_policyEvalContext.Period.Job))
  }

  override function onDefault() {
    if(_policyEvalContext.CheckingSet == UWIssueCheckingSet.TC_PREBIND) {
      validteQuestions()
    }
  }

  /*
   * Validation question response is checked for being true. If true create an underwriting issue
   */
  private function validteQuestions() {

    // Question set for CPP / CRP
    var questionSet = _policyEvalContext.Period.QuestionSets.firstWhere(\elt -> elt.CodeIdentifier == PREQUAL_IDENTIFIER)
    questionSet.Questions.each( \ elt -> {
        if (elt?.isQuestionAvailable(_policyEvalContext.Period) ) {
          var answeredTrue = _policyEvalContext.Period.getAnswerValue(elt)?.toString()
          if (null != answeredTrue && answeredTrue as boolean) {
            switch (elt.DisplayName) {
              case 'CRP_Q1_CoverageDecline_Ext':
                  var shortDescription = \-> displaykey.Ext.UWIssue.CRP.CRP_CoverageDecline_Ext
                  var longDescription = \ -> displaykey.Ext.UWIssue.CRP.long (elt.Text)
                  _policyEvalContext.addIssue('CRP_CoverageDecline_Ext','CRP_CoverageDecline_Ext', shortDescription, longDescription)
                  break
              case 'CRP_Q2_CancelRenew_Ext':
                  var shortDescription = \-> displaykey.Ext.UWIssue.CRP.CRP_CancelRenew_Ext
                  var longDescription = \ -> displaykey.Ext.UWIssue.CRP.long (elt.Text)
                  _policyEvalContext.addIssue('CRP_CancelRenew_Ext','CRP_CancelRenew_Ext', shortDescription, longDescription)
                  break
                default:
                break
            }
          }
        }
      }
    )
  }

}