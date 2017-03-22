package una.lob.cpp


uses gw.lob.common.AbstractUnderwriterEvaluator
uses gw.policy.PolicyEvalContext
uses java.util.Set
uses gw.lang.reflect.IType
uses gw.accelerator.ruleeng.RulesEngineInterface

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


  function invokeRulesEngine() {
    RulesEngineInterface.evaluatePolicy(
        _policyEvalContext,
            "CPLine")
  }

  override function onPrequote() {

    invokeRulesEngine()
  }

  override function onPreBind(){
    invokeRulesEngine()

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
          // uim-svallabhapurapu - DE97 : do not generate UW issues for Internal User(i.e UW issues will be generated for External user only)
          if (null != answeredTrue && answeredTrue as boolean and User.util.CurrentUser.ExternalUser) {
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