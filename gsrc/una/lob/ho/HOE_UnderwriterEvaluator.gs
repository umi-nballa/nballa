package una.lob.ho


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
class HOE_UnderwriterEvaluator extends AbstractUnderwriterEvaluator {

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

  private function validteQuestions() {
   //TODO: only skeleton. To be filled
/*
\rint(' inside validate Question ')
    var qs =       _policyEvalContext.Period.QuestionSets.where( \ elt -> elt.CodeIdentifier== 'HO_PreQual_Ext').first()
    print('print' +_policyEvalContext.Period.hasAnswerForQuestionSet(qs))
    var shortDescription = \ -> displaykey.UWIssue.PersonalAuto.TooManyVehicles.ShortDesc
    var longDescription = \ -> displaykey.UWIssue.PersonalAuto.TooManyVehicles.LongDesc(0)
    _policyEvalContext.addIssue("IneligibleQualificationQuestion_Ext", "IneligibleQualificationQuestion_Ext",
        shortDescription, longDescription, 0)
*/
    var qs =       _policyEvalContext.Period.QuestionSets.where( \ elt -> elt.CodeIdentifier== 'HO_PreQual_Ext').first()

    print('print' +_policyEvalContext.Period.hasAnswerForQuestionSet(qs))
    var shortDescription = \ -> displaykey.UWIssue.PersonalAuto.TooManyVehicles.ShortDesc
    var longDescription = \ -> displaykey.UWIssue.PersonalAuto.TooManyVehicles.LongDesc(0)
    _policyEvalContext.addIssue("IneligibleQualificationQuestion_Ext", "IneligibleQualificationQuestion_Ext",
        shortDescription, longDescription, 0)

  }
}