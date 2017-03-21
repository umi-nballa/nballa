package una.lob.bp7

uses java.util.Set
uses gw.lob.common.AbstractUnderwriterEvaluator
uses gw.policy.PolicyEvalContext
uses gw.lang.reflect.IType
uses gw.accelerator.ruleeng.RulesEngineInterface

/**
 * Created with IntelliJ IDEA.
 * User: dvillapakkam
 * Date: 5/18/16
 * Time: 10:16 PM
 * To change this template use File | Settings | File Templates.
 */
class BP7_UnderwriterEvaluator extends AbstractUnderwriterEvaluator {

  private static final var  PREQUAL_IDENTIFIER = "BP7_Prequal_Ext"

  construct(policyEvalContext : PolicyEvalContext) {
    super(policyEvalContext)
  }

  override function canEvaluate() : boolean {
    var allowedJobs : Set<IType> = {Submission, PolicyChange, Reinstatement, Renewal, Rewrite, Issuance, RewriteNewAccount}
    return allowedJobs.contains(typeof(_policyEvalContext.Period.Job))
  }

  override  function onDefault() {
    if(_policyEvalContext.CheckingSet == UWIssueCheckingSet.TC_PREBIND) {
      validteQuestions()
      }
  }

  function invokeRulesEngine() {
    RulesEngineInterface.evaluatePolicy(
        _policyEvalContext,
            "BP7Line")
  }

  override function onPrequote() {

    invokeRulesEngine()
  }

  override function onPreBind(){
   // invokeRulesEngine()

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
            // uim-svallabhapurapu - DE97 : do not generate UW issues for Internal User(i.e UW issues will be generated for External user only)
            if (null != answeredTrue && answeredTrue and User.util.CurrentUser.ExternalUser) {
              switch (elt.DisplayName) {
                case 'BP7_Q1_Businesshours_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_Businesshours_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_Businesshours_Ext','BP7_Businesshours_Ext', shortDescription, longDescription)
                    break
                case 'BP7_Q2_Homebased_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_Homebased_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_Homebased_Ext','BP7_Homebased_Ext', shortDescription, longDescription)
                    break
                case 'BP7_Q3_Litigation_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_Litigation_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_Litigation_Ext','BP7_Litigation_Ext', shortDescription, longDescription)
                    break
                case 'BP7_Q4_CivilLitigation_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_CivilLitigation_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_CivilLitigation_Ext','BP7_CivilLitigation_Ext', shortDescription, longDescription)
                    break
                case 'BP7_Q5_Occupancy_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_Occupancy_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_Occupancy_Ext','BP7_Occupancy_Ext', shortDescription, longDescription)
                    break
                case 'BP7_Q6_Pincode_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_Pincode_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_Pincode_Ext','BP7_Pincode_Ext', shortDescription, longDescription)
                    break
                case 'BP7_Q7_Cooking_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_Cooking_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_Cooking_Ext','BP7_Cooking_Ext', shortDescription, longDescription)
                    break
                case 'BP7_Q9_Underwriting_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_Underwriting_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_Underwriting_Ext','BP7_Underwriting_Ext', shortDescription, longDescription)
                    break
                case 'BP7_Q8_Liquor_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.BP7.BP7_Liquor_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.BP7.long (elt.Text)
                    _policyEvalContext.addIssue('BP7_Liquor_Ext','BP7_Liquor_Ext', shortDescription, longDescription)
                    break
                default:
                   break
              }
            }
          }
        }
      }
    )
  }

}