package una.lob.bp7

uses java.util.Set
uses gw.lob.common.AbstractUnderwriterEvaluator
uses gw.policy.PolicyEvalContext
uses gw.lang.reflect.IType

/**
 * Created with IntelliJ IDEA.
 * User: dvillapakkam
 * Date: 5/18/16
 * Time: 10:16 PM
 * To change this template use File | Settings | File Templates.
 */
class BP7_UnderwriterEvaluator extends AbstractUnderwriterEvaluator {

  private static final var  INELIGIBLE_QQ = "IneligibleQQ_Ext"
  private static final var  PREQUAL_IDENTIFIER = "HO_PreQual_Ext"

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
    questionSet.Questions.each( \ elt ->
      {
        if (elt != null) {

          if (elt?.isQuestionAvailable(_policyEvalContext.Period) ) {
            var answeredTrue = _policyEvalContext.Period.getAnswerValue(elt)?.toString() as boolean
            print(elt.DisplayName)
            print(answeredTrue)
            if (null != answeredTrue && answeredTrue) {
              switch (elt.DisplayName) {
               //TODO: finish this
                  default:
                  break
              }
            }
          }
        }
      }
    )
  }

  private function addIssue(issueName : String): void {
    var shortDescription : String
    /*switch (issueName) {
      case 'abc':
        shortDescription = \ -> Ext.UWIssue.HOE.HO_ATVonPremise_Ext
        break
      case 'abc':
          shortDescription = \ -> Ext.UWIssue.HOE.HO_ATVonPremise_Ext
          break
      default:
        break
    }*/
    //var shortDescription = \ -> displaykey.Ext.UWIssue.HOE.AnswerIsTrue(elt.Text)
    //_policyEvalContext.addIssue(INELIGIBLE_QQ,INELIGIBLE_QQ, shortDescription, longDescription)
  }
}