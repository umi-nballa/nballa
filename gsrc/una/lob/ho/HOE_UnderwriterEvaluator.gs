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
            if (null != answeredTrue && answeredTrue) {
              switch (elt.DisplayName) {
                case 'HO_OwnATV_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_OwnATV_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_OwnATV_Ext','HO_OwnATV_Ext', shortDescription, longDescription)
                    break
                case 'HO_ATVonPremise_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_ATVonPremise_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_ATVonPremise_Ext','HO_ATVonPremise_Ext', shortDescription, longDescription)
                    break
                case 'HO_OpenClaim_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_OpenClaim_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_OpenClaim_Ext','HO_OpenClaim_Ext', shortDescription, longDescription)
                    break
                case 'HO_Damage_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Damage_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Damage_Ext','HO_Damage_Ext', shortDescription, longDescription)
                    break
                case 'HO_Crime_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Crime_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Crime_Ext','HO_Crime_Ext', shortDescription, longDescription)
                    break
                case 'HO_Fraud_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Fraud_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Fraud_Ext','HO_Fraud_Ext', shortDescription, longDescription)
                    break
                case 'HO_FamilyFelony_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_FamilyFelony_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_FamilyFelony_Ext','HO_FamilyFelony_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lapse_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lapse_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lapse_Ext','HO_Lapse_Ext', shortDescription, longDescription)
                    break
                case 'HO_LapseHO_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_LapseHO_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_LapseHO_Ext','HO_LapseHO_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lapse45_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lapse45_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lapse45_Ext','HO_Lapse45_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lapse60_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lapse60_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lapse60_Ext','HO_Lapse60_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lapse3years_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lapse3years_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lapse3years_Ext','HO_Lapse3years_Ext', shortDescription, longDescription)
                    break
                case 'HO_Sinkhole_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Sinkhole_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Sinkhole_Ext','HO_Sinkhole_Ext', shortDescription, longDescription)
                    break
                case 'HO_Sinkholeother_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Sinkholeother_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Sinkholeother_Ext','HO_Sinkholeother_Ext', shortDescription, longDescription)
                    break
           case 'HO_PropertyLoss1_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_PropertyLoss1_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_PropertyLoss1_Ext','HO_PropertyLoss1_Ext', shortDescription, longDescription)
                    break
                case 'HO_PropertyLossv2_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_PropertyLossv2_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_PropertyLossv2_Ext','HO_PropertyLossv2_Ext', shortDescription, longDescription)
                    break
                case 'HO_Propertyv3_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Propertyv3_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Propertyv3_Ext','HO_Propertyv3_Ext', shortDescription, longDescription)
                    break
                case 'HO_Propertyv4_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Propertyv4_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Propertyv4_Ext','HO_Propertyv4_Ext', shortDescription, longDescription)
                    break
                case 'HO_Any3Loss_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Any3Loss_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Any3Loss_Ext','HO_Any3Loss_Ext', shortDescription, longDescription)
                    break
                case 'HO_Weather_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Weather_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Weather_Ext','HO_Weather_Ext', shortDescription, longDescription)
                    break
                case 'HO_Weatherissues_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Weatherissues_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Weatherissues_Ext','HO_Weatherissues_Ext', shortDescription, longDescription)
                    break
                case 'HO_Lease_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Lease_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Lease_Ext','HO_Lease_Ext', shortDescription, longDescription)
                    break
                case 'HO_DwellingQA_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_DwellingQA_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_DwellingQA_Ext','HO_DwellingQA_Ext', shortDescription, longDescription)
                    break
                case 'HO_DwellingDP_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_DwellingDP_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_DwellingDP_Ext','HO_DwellingDP_Ext', shortDescription, longDescription)
                    break
                case 'Question_HO_Farm_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Farm_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Farm_Ext','HO_Farm_Ext', shortDescription, longDescription)
                    break
                case 'HO_island_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_island_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_island_Ext','HO_island_Ext', shortDescription, longDescription)
                    break
                case 'HO_Island_DP_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_Island_DP_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_Island_DP_Ext','HO_Island_DP_Ext', shortDescription, longDescription)
                    break
                case 'HO_DwellingQAflip_Ext':
                    var shortDescription = \-> displaykey.Ext.UWIssue.HOE.HO_DwellingQAflip_Ext
                    var longDescription = \ -> displaykey.Ext.UWIssue.HOE.long (elt.Text)
                    _policyEvalContext.addIssue('HO_DwellingQAflip_Ext','HO_DwellingQAflip_Ext', shortDescription, longDescription)
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