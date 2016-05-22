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

  private static final var  INELIGIBLE_QQ = "IneligibleQQ_Ext"
  private static final var  PREQUAL_IDENTIFIER = "IneligibleQQ_Ext"

  construct(policyEvalContext : PolicyEvalContext) {
    super(policyEvalContext)
  }

  override function canEvaluate() : boolean {
    var allowedJobs : Set<IType> = {Submission, PolicyChange, Reinstatement, Renewal, Rewrite, Issuance, RewriteNewAccount}
    return allowedJobs.contains(typeof(_policyEvalContext.Period.Job))
  }

  override function onPrequote() {
      validteQuestions()
  }

  /*
   * Validation question response is checked for being true. If true create an underwriting issue
   */
  private function validteQuestions() {

    // Question set for HO
    var questionSet = _policyEvalContext.Period.QuestionSets.firstWhere(\elt -> elt.CodeIdentifier == PREQUAL_IDENTIFIER)

    questionSet.Questions.each( \ elt -> {
      print (' elt ' + elt)
      print('elt?.isQuestionAvailable(_policyEvalContext.Period) ' + elt.isQuestionAvailable(_policyEvalContext.Period))
        if (elt?.isQuestionAvailable(_policyEvalContext.Period) ) {
          print(' data ' +  _policyEvalContext.Period.getAnswerValue(elt)  )
          var answeredTrue = _policyEvalContext.Period.getAnswerValue(elt)?.toString()
          print(answeredTrue)
          if (null != answeredTrue && answeredTrue) {
            var shortDescription = \ -> displaykey.Ext.UWIssue.HOE.AnswerIsTrue(elt.Text)
            var longDescription = \ -> displaykey.Ext.UWIssue.HOE.AnswerIsTrue (elt.Text)
            _policyEvalContext.addIssue(INELIGIBLE_QQ,INELIGIBLE_QQ, shortDescription, longDescription)
          }
        }
      }
    )
  }

}