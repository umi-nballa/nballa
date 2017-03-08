package una.forms

uses gw.forms.generic.AbstractSimpleAvailabilityForm
uses java.util.Set
uses gw.forms.FormInferenceContext
uses gw.lob.common.util.FormPatternConstants
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 12/7/16
 * Time: 5:36 PM
 * To change this template use File | Settings | File Templates.
 */
class HOFormAvailabilityUtil extends AbstractSimpleAvailabilityForm
{
    var formNumber = this.Pattern.FormNumber//Code
    var formCode = this.Pattern.Code

  override function isAvailable(context: FormInferenceContext, availableStates: Set<Jurisdiction>): boolean {

    var formAttachFlag : boolean

    formAttachFlag= dwellingCoverageValuationMethod(context,availableStates)
    formAttachFlag= personalPropertyCoveragePropertyValuation(context,availableStates)
    formAttachFlag= dwellingCoveragePropertyValuation(context,availableStates)
    formAttachFlag= dwellingCoverage(context,availableStates)
    formAttachFlag= section1DeductibleCoverage(context,availableStates)
    formAttachFlag= scheduledPropertyCoverage(context,availableStates)
    formAttachFlag= carliforniaEarthQuakeCoverage(context,availableStates)
    formAttachFlag= addnlInsuredLiability(context,availableStates)
    formAttachFlag= homeOwnersRental(context,availableStates)
    formAttachFlag= condoUnitOwnerCoverage(context,availableStates)
    formAttachFlag= windHallDeductible(context,availableStates)
    formAttachFlag= personalPropertyReplacementCost(context,availableStates)
    formAttachFlag= suppLossAssessmentCov(context,availableStates)
    formAttachFlag= personalPropertyOtherResidenes(context,availableStates)
    formAttachFlag= ccIncreased(context,availableStates)
    formAttachFlag= firstTimeIMPNotice(context,availableStates)
    formAttachFlag= namedStorm(context,availableStates)
    formAttachFlag= covDecreasedLimit1(context,availableStates)
    formAttachFlag= covDecreasedLimit2(context,availableStates)
    formAttachFlag= exclusiveCoverage(context,availableStates)
    formAttachFlag= addlnInsuredPropertyManager(context,availableStates)
    formAttachFlag= CTR(context,availableStates)
    formAttachFlag= protectionSystemForCA(context,availableStates)
    formAttachFlag= protectionSystemHI(context,availableStates)
    formAttachFlag= protectionSystem(context,availableStates)
    formAttachFlag= lossAssessmentCoverage(context,availableStates)
    formAttachFlag= noDwellingFireOtherStructures(context,availableStates)
    formAttachFlag= businessPropertyIncreasedLimits(context,availableStates)
    formAttachFlag= homeOwnersOrdianceLaw(context,availableStates)
    formAttachFlag= residenceHeldOnTrust(context,availableStates)
    formAttachFlag= residenceHeldOnTrustOnly(context,availableStates)
    formAttachFlag= lossAssessmentResType(context,availableStates)
    formAttachFlag= personalPropertyValuationMethod(context,availableStates)
    formAttachFlag= otherStructuresDecreasedLimit(context,availableStates)
    formAttachFlag= homeOwnersOtherStructuresDecreasedLimit(context,availableStates)
    formAttachFlag= hurricaneDeductible(context,availableStates)
    formAttachFlag= hurricaneDeductibleForDP3(context,availableStates)
    formAttachFlag= limitedEarthQuake(context,availableStates)
    formAttachFlag= dwellingFire(context,availableStates)
    formAttachFlag= dwellingFirePersonalLiability(context,availableStates)
    formAttachFlag= dwellingFireSignaturePage(context,availableStates)
    formAttachFlag= diffCovNotSelected(context,availableStates)
    formAttachFlag= carliforniaEarthQuakeCovNotSelected(context,availableStates)
    formAttachFlag= premisesLiability(context,availableStates)
    formAttachFlag= homeOwnersOtherStructures(context,availableStates)
    formAttachFlag= rewriteForRenewals(context,availableStates)
    formAttachFlag= rewriteForRenewalsForTX(context,availableStates)
    formAttachFlag= dwellingFireOrdianceLaw1(context,availableStates)
    formAttachFlag= dwellingFireOrdianceLaw2(context,availableStates)
    formAttachFlag= fungiWetDry1(context,availableStates)
    formAttachFlag= fungiWetDry2(context,availableStates)
    formAttachFlag= rewriteForRenewalsForHOB(context,availableStates)
    formAttachFlag= carliforniaEarthQuakeCov(context,availableStates)
    formAttachFlag= lossAssessment(context,availableStates)
    formAttachFlag= fungiWetForm(context,availableStates)
    formAttachFlag= additionalInsured(context,availableStates)
    formAttachFlag= dwellingFireForTX1(context,availableStates)
    formAttachFlag= dwellingFireForTX2(context,availableStates)
    formAttachFlag= unscheduleLimit(context,availableStates)
    formAttachFlag= section1Deductible(context,availableStates)
    formAttachFlag= specialLimitsPersonalProperty(context,availableStates)
    formAttachFlag= propertyIncreasedLimits(context,availableStates)
    formAttachFlag= rewriteForRenewals2(context,availableStates)
    formAttachFlag= rewriteForSubmission(context,availableStates)
    formAttachFlag= rewriteForRenewals3(context,availableStates)
    formAttachFlag= rewriteForSubmission2(context,availableStates)
    formAttachFlag= rewriteForRenewals4(context,availableStates)
    formAttachFlag= rewriteForSubmission3(context,availableStates)
    formAttachFlag= rewriteForRenewals5(context,availableStates)
    formAttachFlag= ordianceLaw(context,availableStates)

    return formAttachFlag
  }


  public  function dwellingCoverageValuationMethod(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if (formNumber.equals("HO 04 81") || formNumber.equals("UN LPP 04 76"))
    {
      if(hoeLine!= null and dwelling!=null && dwelling.DPDW_Dwelling_Cov_HOEExists &&
          dwelling.DPDW_Dwelling_Cov_HOE.HasDPDW_ValuationMethod_HOE_ExtTerm
          && dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.Value== tc_ACV)

        return true
    }
    return false
    }

  public function personalPropertyCoveragePropertyValuation(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if (formNumber.equals("HO 04 90") || formNumber.equals("HO-101") || formNumber.equals("UI 04 90") )
    {

      if(hoeLine!= null and dwelling!=null && dwelling.HODW_Personal_Property_HOEExists &&
          dwelling.HODW_Personal_Property_HOE.HasHODW_PropertyValuation_HOE_ExtTerm
          && dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOE_ExtTerm.Value == tc_PersProp_ReplCost)

        return true
    }
    return false
  }

  public function dwellingCoveragePropertyValuation(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if (formNumber.equals("TDP-002"))
    {
      if(( hoeLine!= null and dwelling!=null && dwelling.DPDW_Dwelling_Cov_HOEExists &&
          dwelling.DPDW_Dwelling_Cov_HOE.HasDPDW_ValuationMethod_HOE_ExtTerm
          && dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.Value == tc_ReplCost) ||
          (dwelling!=null && dwelling.HODW_Personal_Property_HOEExists &&
              dwelling.HODW_Personal_Property_HOE.HasHODW_PropertyValuation_HOE_ExtTerm
              && dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOE_ExtTerm.Value == tc_PersProp_ReplCost))

        return true
    }
    return false
  }

  public function dwellingCoverage(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if (formNumber.equals("UN 09 56"))
    {
      if(hoeLine != null and dwelling!=null && dwelling.HODW_Dwelling_Cov_HOEExists &&
          dwelling.HODW_Dwelling_Cov_HOE.HasHODW_ExecutiveCov_HOE_ExtTerm)

        return true
    }
    return false
  }

  public function section1DeductibleCoverage(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if (formNumber.equals("UN LPP 03 12"))
    {
      if(hoeLine != null and dwelling!=null && dwelling.HODW_SectionI_Ded_HOEExists &&
          dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm)

        return true
    }
    if (formNumber.equals("UN LPP 03 51"))
    {
      if(hoeLine != null and dwelling!=null && dwelling.HODW_SectionI_Ded_HOEExists &&
          dwelling.HODW_SectionI_Ded_HOE.HasHODW_Hurricane_Ded_HOETerm)

        return true
    }
    return false
  }


  public function scheduledPropertyCoverage(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    //Waiting on Faye for Scheduled coverages
    if (formNumber.equals("HO 04 61"))
    {
      if(dwelling!=null && dwelling.HODW_ScheduledProperty_HOEExists &&
          dwelling.HODW_ScheduledProperty_HOE.CovTerms.length>0)
        return true
    }
    return false
  }

  public function carliforniaEarthQuakeCoverage(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_CA_EQ_COVERAGE_FORM)){
      if(hoeLine != null and dwelling != null){
        if(!dwelling.HODW_Limited_Earthquake_CA_HOEExists and !dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists){
          return true
        }
      }
    }
    return false
  }

  public function addnlInsuredLiability(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_ADDL_INSURED_LIABILITY_0788_FORM) or
        formCode.equals(FormPatternConstants.HO_ADDL_INSURED_LIABILITY_1202_FORM)){
      var polAddlInsureds = context.Period.PolicyContactRoles.where( \ elt -> elt.Subtype == typekey.PolicyContactRole.TC_POLICYADDLINSURED)
      if(hoeLine != null and polAddlInsureds != null and polAddlInsureds.length > 0){
        return true
      }
    }
    return false
  }


  public function homeOwnersRental(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_PREMISES_LIABILITY_FORM) or
        formCode.equals(FormPatternConstants.HO_UNIT_OWNER_RENTAL_1000_FORM) or
        formCode.equals(FormPatternConstants.HO_UNIT_OWNER_RENTAL_0511_FORM) or
        formCode.equals(FormPatternConstants.HO_UNIT_OWNER_RENTAL_1093_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.Occupancy == typekey.DwellingOccupancyType_HOE.TC_NONOWN){
        return true
      }
    }
    return false
  }
  public  function condoUnitOwnerCoverage(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    /* waiting on faye
    if (formCode.equals("UICNA 03 51"))
     {
       if(dwelling!=null && dwelling.HODW_SectionI_Ded_HOEExists &&
           dwelling.HODW_SectionI_Ded_HOE.HasHasHODW_Hurricane_Ded_HOETerm)

         return true
     }

     if (formCode.equals("UICNA 04 51"))
     {
       if(dwelling!=null && dwelling.HODW_SectionI_Ded_HOEExists &&
           dwelling.HODW_SectionI_Ded_HOE.HasHODW_Hurricane_Ded_HOETerm)

         return true
     }
      */
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_CONDO_UNIT_OWNER_COV_FORM)){
      if(hoeLine != null and dwelling != null and (dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO or
          dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO)){
        return true
      }
    }
    return false
    }

  public  function windHallDeductible(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_WIND_OR_HAIL_DEDUCTIBLE__0511_FORM) or
        formCode.equals(FormPatternConstants.HO_WIND_OR_HAIL_DEDUCTIBLE_0901_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_SectionI_Ded_HOEExists and
          dwelling.HODW_SectionI_Ded_HOE?.HasHODW_WindHail_Ded_HOETerm){
        return true
      }
    }
    return false
    }


  public function personalPropertyReplacementCost(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_PERSONAL_PROPERTY_REPLACEMENT_COST_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_Personal_Property_HOEExists and
          dwelling.HODW_Personal_Property_HOE?.HasHODW_PropertyValuation_HOE_ExtTerm and
          dwelling.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm.Value == tc_PersProp_ReplCost){
        return true
      }
    }
    return false
  }

  public function suppLossAssessmentCov(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_SUPP_LOSS_ASSESSMENT_COVERAGE_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_LossAssessmentCov_HOE_ExtExists
          and dwelling.HODW_LossAssessmentCov_HOE_Ext?.HasHOPL_LossAssCovLimit_HOETerm and
          (dwelling.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm.Value == "5000" or
              dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value == "10000")){
        return true
      }
    }
    return false
  }

  public function personalPropertyOtherResidenes(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_PERSONAL_PROPERTY_OTHER_RESIDENCES_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_PersonalPropertyOffResidence_HOEExists and
          dwelling.HODW_PersonalPropertyOffResidence_HOE?.HasHOLI_PPOtherResidence_Limit_HOETerm and
          dwelling.HODW_Dwelling_Cov_HOEExists and dwelling.HODW_Dwelling_Cov_HOE?.HasHODW_Dwelling_Limit_HOETerm and
          dwelling.HODW_PersonalPropertyOffResidence_HOE?.HOLI_PPOtherResidence_Limit_HOETerm.Value > (1.1 * dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm.Value)){
        return true
      }
    }
    return false
  }

  public function ccIncreased(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_CC_INCREASED_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_CC_EFT_HOE_ExtExists and
          dwelling.HODW_CC_EFT_HOE_Ext?.HasHODW_CC_EFTLimit_HOETerm and
          dwelling.HODW_CC_EFT_HOE_Ext?.HODW_CC_EFTLimit_HOETerm.Value > "500"){
        return true
      }
    }
    return false
  }

  public function firstTimeIMPNotice(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_FIRST_TIME_IMP_NOTICE_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HomeNewPurchase_Ext and dwelling.BuilderWarranty_Ext
          and dwelling.HODW_CC_EFT_HOE_ExtExists){
        return true
      }
    }
    return false
  }

  public function namedStorm(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_NAMED_STORM_DEDUCTIBLE_TERM_FORM) or
        formCode.equals(FormPatternConstants.HO_NAMED_STORM_PERCENTAGE_DEDUCTIBLE_FORM) or
        formCode.equals(FormPatternConstants.HO_NAMED_STORM_DEDUCTIBLE_ENDORSEMENT_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_SectionI_Ded_HOEExists and
          dwelling.HODW_SectionI_Ded_HOE?.HasHODW_NamedStrom_Ded_HOE_ExtTerm){
        return true
      }
    }
    return false
  }

  public  function covDecreasedLimit1(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_COVB_DECREASED_LIMIT_0117_FORM) or
        formCode.equals(FormPatternConstants.HO_COVB_DECREASED_LIMIT_0308_FORM)){
      if(hoeLine != null and dwelling != null and hoeLine.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 and
          dwelling.HODW_Other_Structures_HOEExists and
          dwelling.HODW_Other_Structures_HOE?.HasHODW_OtherStructures_Limit_HOETerm and
          dwelling.HODW_Dwelling_Cov_HOEExists and
          dwelling.HODW_Dwelling_Cov_HOE?.HasHODW_Dwelling_Limit_HOETerm and
          dwelling.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm.Value < (0.2 * dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm.Value)){
        return true
      }
    }
    return false
    }


  public function covDecreasedLimit2(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE

    if(formCode.equals(FormPatternConstants.HO_COVB_DECREASED_LIMIT_0307_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.DPDW_Other_Structures_HOEExists and
          dwelling.DPDW_Other_Structures_HOE?.HasDPDW_OtherStructuresLimit_HOETerm and
          dwelling.HODW_Dwelling_Cov_HOEExists and
          dwelling.HODW_Dwelling_Cov_HOE?.HasHODW_Dwelling_Limit_HOETerm and
          (0 < dwelling.DPDW_Other_Structures_HOE?.DPDW_OtherStructuresLimit_HOETerm.Value) and
          dwelling.DPDW_Other_Structures_HOE?.DPDW_OtherStructuresLimit_HOETerm.Value < (0.2 * dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm.Value)){
        return true
      }
    }
    return false
  }


  public function exclusiveCoverage(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_EXECUTIVE_COVERAGE_FORM)){
      if(hoeLine != null and dwelling != null and
          dwelling.HODW_Dwelling_Cov_HOEExists and dwelling.HODW_Dwelling_Cov_HOE?.HasHODW_ExecutiveCov_HOE_ExtTerm){
        return true
      }
    }
    return false
  }

  public function addlnInsuredPropertyManager(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    var formRet = false
    if(formCode.equals(FormPatternConstants.HO_ADDL_INSURED_PROPERTY_MANAGER_FORM)){
      var polAddlInterest = context.Period.PolicyContactRoles.where( \ elt -> elt.Subtype == typekey.PolicyContactRole.TC_POLICYADDLINTEREST)
      polAddlInterest.each( \ elt -> {
        if(elt typeis PolicyAddlInterest){
          var details = elt.AdditionalInterestDetails
          details.each( \ elt1 -> {
            if(elt1.AdditionalInterestType == typekey.AdditionalInterestType.TC_PROPERTYMANAGER_EXT){
              formRet = true
            }
          })
        }
      })
      if(formRet and hoeLine != null and dwelling != null){
        return true
      }
    }
    return false
  }

  public function CTR(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_CONSENT_TO_RATE_HO3_FORM) or
        formCode.equals(FormPatternConstants.HO_CONSENT_TO_RATE_HO4_FORM) or
        formCode.equals(FormPatternConstants.HO_CONSENT_TO_RATE_HO6_FORM)){
      if(hoeLine != null and dwelling != null and context.Period.ConsentToRateReceived_Ext){
        return true
      }
    }
    return false
  }

  public function protectionSystemForCA(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DP3_PROTECTION_SYSTEM_CA_FL_FORM)){
      if(hoeLine != null and dwelling != null) {
        var policyType = hoeLine.HOPolicyType.Code
        var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
        if( policyType == DP3typeKeyCode and (dwelling.DwellingProtectionDetails?.FireAlarm or
            dwelling.DwellingProtectionDetails?.FireAlarmReportFireStn or dwelling.DwellingProtectionDetails?.FireAlarmReportCntlStn or
            dwelling.DwellingProtectionDetails?.FireAlarmReportPoliceStn or
            dwelling.DwellingProtectionDetails?.SprinklerSystemType == typekey.SprinklerSystemType_HOE.TC_FULL or
            dwelling.DwellingProtectionDetails?.SprinklerSystemType == typekey.SprinklerSystemType_HOE.TC_PARTIAL)){
          return true
        }
      }
    }
    return false
  }

  public  function protectionSystemHI(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DP3_PROTECTION_SYSTEM_HI_FORM)){
      if(hoeLine != null and dwelling != null) {
        var policyType = hoeLine.HOPolicyType.Code
        var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
        if( policyType == DP3typeKeyCode and (dwelling.DwellingProtectionDetails?.FireAlarm or
            dwelling.DwellingProtectionDetails?.FireAlarmReportFireStn or dwelling.DwellingProtectionDetails?.FireAlarmReportCntlStn or
            dwelling.DwellingProtectionDetails?.FireAlarmReportPoliceStn or
            dwelling.DwellingProtectionDetails?.SprinklerSystemType == typekey.SprinklerSystemType_HOE.TC_FULL)){
          return true
        }
      }
    }
    return false
    }

  public function protectionSystem(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_HO3_HO4_HO6_PROTECTION_SYSTEM_HI_FORM)){
      if(hoeLine != null and dwelling != null and (dwelling.DwellingProtectionDetails?.FireAlarm or
          dwelling.DwellingProtectionDetails?.FireAlarmReportFireStn or dwelling.DwellingProtectionDetails?.FireAlarmReportCntlStn or
          dwelling.DwellingProtectionDetails?.FireAlarmReportPoliceStn or
          dwelling.DwellingProtectionDetails?.Deadbolts or dwelling.DwellingProtectionDetails?.FireExtinguishers or
          dwelling.DwellingProtectionDetails?.BurglarAlarm or dwelling.DwellingProtectionDetails?.BurglarAlarmReportCntlStn or
          dwelling.DwellingProtectionDetails?.BurglarAlarmReportPoliceStn or
          dwelling.DwellingProtectionDetails?.GatedCommunity or
          dwelling.DwellingProtectionDetails?.SprinklerSystemType == typekey.SprinklerSystemType_HOE.TC_FULL or
          dwelling.DwellingProtectionDetails?.SprinklerSystemType == typekey.SprinklerSystemType_HOE.TC_PARTIAL)){
        return true
      }
    }
    return false
  }

  public function lossAssessmentCoverage(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_LOSS_ASSESSMENT_COVERAGE_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_LossAssessmentCov_HOE_ExtExists
          and dwelling.HODW_LossAssessmentCov_HOE_Ext?.HasHOPL_LossAssCovLimit_HOETerm and
          dwelling.HODW_Dwelling_Cov_HOEExists and dwelling.HODW_Dwelling_Cov_HOE?.HasHODW_ExecutiveCov_HOE_ExtTerm
          and (dwelling.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm.Value == "5000" or
              dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value == "10000")){
        return true
      }else if(hoeLine != null and dwelling != null and
          (dwelling.HOLocation.PolicyLocation.State == typekey.State.TC_CA or dwelling.HOLocation.PolicyLocation.State == typekey.State.TC_HI) and
          dwelling.HODW_LossAssessmentCov_HOE_ExtExists
          and dwelling.HODW_LossAssessmentCov_HOE_Ext?.HasHOPL_LossAssCovLimit_HOETerm and
          (!dwelling.HODW_Dwelling_Cov_HOE?.HasHODW_ExecutiveCov_HOE_ExtTerm) and
          (dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value == "10000")){
        return true
      }
    }
    return false
  }

  public function noDwellingFireOtherStructures(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_NO_DWELLING_FIRE_OTHER_STRUCTURE_FORM)){
      if(hoeLine != null and dwelling != null){
        var policyType = hoeLine.HOPolicyType.Code
        var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
        var isCovExists = dwelling.DPDW_Other_Structures_HOEExists
        if(policyType == DP3typeKeyCode and !isCovExists){
          return true
        }
      }
    }
    return false
  }

  public function businessPropertyIncreasedLimits(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_BUSINESS_PROPERTY_INCREASED_LIMITS_FORM)){
      if(hoeLine != null and dwelling != null){
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        if(( policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode) and dwelling.HODW_BusinessProperty_HOE_ExtExists
            and dwelling.HODW_BusinessProperty_HOE_Ext?.HasHODW_OnPremises_Limit_HOETerm
            and dwelling.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.OptionValue.Value > 2500) {
          return true
        }
      }
    }
    return false
  }

  public  function homeOwnersOrdianceLaw(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_HOMEOWENERS_ORDIANCE_LAW_FORM)){
      var policyType = hoeLine.HOPolicyType.Code
      var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
      var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
      var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
      if(hoeLine != null and dwelling != null and( policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode) and dwelling.HODW_OrdinanceCov_HOEExists
          and dwelling.HODW_OrdinanceCov_HOE?.HasHODW_OrdinanceLimit_HOETerm
          and dwelling.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm.OptionValue.Value > 0.10) {
        return true
      }
    }
    return false
    }


  public function residenceHeldOnTrust(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_RESIDENCE_HELD_IN_TRUST_FORM)){
      if(hoeLine != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var org_Type=  hoeLine.Branch.Policy.Account.AccountOrgType.Value
        var party_residence = hoeLine.Branch.TrustResidings.TrustResident.Code
        var grantor = typekey.TrustResident_Ext.TC_GRANTOR.Code
        var benificiary = typekey.TrustResident_Ext.TC_BENEFICIARY.Code
        var trusty = typekey.AccountOrgType.TC_TRUST_EXT.Code
        if(org_Type != null and party_residence != null and( policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode)
            and org_Type ==  trusty and ( party_residence.contains(grantor)  or party_residence.contains(benificiary) ) ) {
          return true
        }
      }
    }
    return false
  }

  public function residenceHeldOnTrustOnly(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_RESIDENCE_HELD_IN_TRUST_ONLY_FORM)){
      if(hoeLine != null){
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var org_Type=  hoeLine.Branch.Policy.Account.AccountOrgType.Value
        var trusty = typekey.AccountOrgType.TC_TRUST_EXT.Code
        if( org_Type != null and (policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode) and org_Type ==  trusty )  {
          return true
        }
      }
    }
    return false
  }

  public function lossAssessmentResType(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_LOSS_ASSESSMENT_RES_TYPE_FORM)){
      if(hoeLine != null and  dwelling != null){
        var policyType = hoeLine.HOPolicyType.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var condo_Code = typekey.ResidenceType_HOE.TC_CONDO.Code
        var isCovExists = dwelling.HODW_LossAssessmentCov_HOE_ExtExists
        var res_Type = dwelling.ResidenceType.Code
        if( res_Type != null and isCovExists != null  and condo_Code != null and isCovExists  and policyType == HO6typeKeyCode and res_Type == condo_Code )  {
          return true
        }
      }
    }
    return false
  }

  public function personalPropertyValuationMethod(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_PERSONAL_PROPERTY_VALUATION_METHOD_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var isCovExists = dwelling.HODW_Personal_Property_HOEExists
        var isTermExists = dwelling.HODW_Personal_Property_HOE.HasHODW_PropertyValuation_HOE_ExtTerm
        var inputValMethodName = dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOE_ExtTerm.Value.Code
        var replCost = typekey.ValuationMethod.TC_PERSPROP_REPLCOST.Code
        var replCostACV = typekey.ValuationMethod.TC_PERSPROP_REPLCOSTVALWACVHOLDBACK.Code
        if((policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode) and isCovExists and isTermExists and  (inputValMethodName == replCost or inputValMethodName == replCostACV ) )  {
          return true
        }
      }
    }
    return false
  }

  public function otherStructuresDecreasedLimit(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_OTHER_STRUCTURES_DECREASED_LIMIT_FORM)){
      if(hoeLine != null and  dwelling != null){
        var policyType = hoeLine.HOPolicyType.Code
        var HOATypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HOBTypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var isCovExists = dwelling.DPDW_Other_Structures_HOEExists
        var isTermExists = dwelling.DPDW_Other_Structures_HOE.HasDPDW_OtherStructuresLimit_HOETerm
        var otherStTermLimitValue = dwelling.DPDW_Other_Structures_HOE.DPDW_OtherStructuresLimit_HOETerm.Value
        var isDwellCovExists = dwelling.HODW_Dwelling_Cov_HOEExists
        var isDwellCovLimitExists = dwelling.HODW_Dwelling_Cov_HOE.HasHODW_Dwelling_Limit_HOETerm
        var dwellTermLimitValue = dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
        if( isCovExists and isTermExists and isDwellCovExists and isDwellCovLimitExists and (policyType == HOATypeKeyCode or policyType == HOBTypeKeyCode ) and  (otherStTermLimitValue < dwellTermLimitValue *  BigDecimal.valueOf(0.20)) )  {
          return true
        }
      }
    }
    return false
  }

  public  function homeOwnersOtherStructuresDecreasedLimit(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_HOMEOWNERS_OTHER_STRUCTURES_DECREASED_LIMIT_FORM)){
      if(hoeLine != null and  dwelling != null){
        var isCovExists = dwelling.HODW_Other_Structures_HOEExists
        var isTermExists = dwelling.HODW_Other_Structures_HOE.HasHODW_OtherStructures_Limit_HOETerm
        var otherStTermLimitValue = dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.Value
        var isDwellCovExists = dwelling.HODW_Dwelling_Cov_HOEExists
        var isDwellCovLimitExists = dwelling.HODW_Dwelling_Cov_HOE.HasHODW_Dwelling_Limit_HOETerm
        var isHO6CovLimitExists = dwelling.HODW_Dwelling_Cov_HOE.HasLimit_HO6_HOETerm
        var dwellTermLimitValue = dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
        var HO6TermLimitValue = dwelling.HODW_Dwelling_Cov_HOE.Limit_HO6_HOETerm.Value
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        if( isCovExists and isTermExists and isDwellCovExists and isDwellCovLimitExists and (policyType == HO3typeKeyCode) and  (otherStTermLimitValue < dwellTermLimitValue *  BigDecimal.valueOf(0.20)) )  {
          return true
        }
      }
    }
    return false
    }

  public function hurricaneDeductible(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_HURRICANE_DEDUCTIBLE_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists = dwelling.HODW_SectionI_Ded_HOEExists
        var isTermExists = dwelling.HODW_SectionI_Ded_HOE.HasHODW_Hurricane_Ded_HOETerm
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        if( isCovExists and isTermExists and (policyType == HO3typeKeyCode or policyType == HO4typeKeyCode or policyType == HO6typeKeyCode))  {
          return true
        }
      }
    }
    return false
  }

  public function hurricaneDeductibleForDP3(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_HURRICANE_DEDUCTIBLE_EXCLUDE_DP3_FORM)){
      if(hoeLine != null and  dwelling != null  ){
        var isCovExists = dwelling.HODW_SectionI_Ded_HOEExists
        var isTermExists = dwelling.HODW_SectionI_Ded_HOE.HasHODW_Hurricane_Ded_HOETerm

        var policyType = hoeLine.HOPolicyType.Code
        var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code

        if(isCovExists and isTermExists and policyType == DP3typeKeyCode)  {
          return true
        }
      }
    }
    return false
  }
  public function limitedEarthQuake(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_CARLIFORNIA_EARTHQUAKE_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var homeBuilt = dwelling.YearBuilt
        var isCovExists_1 = dwelling.HODW_Limited_Earthquake_CA_HOEExists
        var isCovExists_2 = dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var policyChange = typekey.Job.TC_POLICYCHANGE.Code
        if(jobType != policyChange and (isCovExists_1 or isCovExists_2) and (policyType == HO3typeKeyCode or policyType == HO4typeKeyCode or policyType == HO6typeKeyCode) and homeBuilt < 1973 )  {
        return true
      }
      }
    }
    return false
  }

  public function dwellingFire(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DWELLING_FIRE_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists = dwelling.DPDW_Dwelling_Cov_HOEExists
        var isTermExists = dwelling.DPDW_Dwelling_Cov_HOE.HasDPDW_ValuationMethod_HOE_ExtTerm
        var covTermName = dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.Value.Code
        var actCashValue = typekey.ValuationMethod.TC_PERSPROP_ACV.Code
        var policyType = hoeLine.HOPolicyType.Code
        var LPP3typeKeyCode = typekey.HOPolicyType_HOE.TC_LPP_EXT.Code
        if(isCovExists and  isTermExists and policyType == LPP3typeKeyCode and covTermName ==  actCashValue)  {
          return true
        }
      }
    }
    return false
  }

  public  function dwellingFirePersonalLiability(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DWELLING_FIRE_PERSONAL_LIABILITY_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists = dwelling.DPDW_Dwelling_Cov_HOEExists
        var isTermExists = dwelling.DPDW_Dwelling_Cov_HOE.HasDPDW_ValuationMethod_HOE_ExtTerm
        var covTermName = dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.Value.Code
        var actCashValue = typekey.ValuationMethod.TC_PERSPROP_ACV.Code
        var policyType = hoeLine.HOPolicyType.Code
        var LPP3typeKeyCode = typekey.HOPolicyType_HOE.TC_LPP_EXT.Code
        if(isCovExists and  isTermExists and policyType == LPP3typeKeyCode and covTermName ==  actCashValue)  {
          return true
        }
      }
    }
    return false
    }

  public function dwellingFireSignaturePage(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DWELLING_FIRE_SIGNATURE_PAGE_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var jobType= hoeLine.branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var policyType = hoeLine.HOPolicyType.Code
        var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
        if( policyType == DP3typeKeyCode and jobType == rewrite)  {
          return true
        }
      }
    }
    return false
  }

  public function diffCovNotSelected(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DIFFERENCE_COVERAGE_NOTSELECTD_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists = dwelling.HODW_DifferenceConditions_HOE_ExtExists
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var policyChange = typekey.Job.TC_POLICYCHANGE.Code
        if(( policyType == HO3typeKeyCode or policyType == HO4typeKeyCode or policyType == HO6typeKeyCode) and !isCovExists and jobType != policyChange)  {
          return true
        }
      }
    }
    return false
  }

  public function carliforniaEarthQuakeCovNotSelected(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_CARLIFORNIA_EARTHQUAKE_COVERAGE_NOTSELECTD_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists_1 = dwelling.HODW_Limited_Earthquake_CA_HOEExists
        var isCovExists_2 = dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var policyChange = typekey.Job.TC_POLICYCHANGE.Code
        if(( policyType == HO3typeKeyCode or policyType == HO4typeKeyCode or policyType == HO6typeKeyCode) and !isCovExists_1 and !isCovExists_2 and jobType != policyChange)  {
          return true
        }
      }
    }
    return false
  }

  public function premisesLiability(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_PREMISES_LIABILITY_SELECTED_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var input_Premises = dwelling.DwellingUsage.Code
        var typekey_Premises = typekey.DwellingUsage_HOE.TC_PRIM.Code
        var policyType = hoeLine.HOPolicyType.Code
        var TP1typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP1_EXT.Code
        var TP2typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP2_EXT.Code
        var TP3typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP3_EXT.Code
        if(( policyType == TP1typeKeyCode or policyType == TP2typeKeyCode or policyType == TP3typeKeyCode) and input_Premises == typekey_Premises )  {
          return true
        }
      }
    }
    return false
  }

  public function homeOwnersOtherStructures(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_HOMEOWNERS_OTHERSTRUCTURES_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists = dwelling.HODW_Other_Structures_HOEExists
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        if( policyType == HO3typeKeyCode and !isCovExists )  {
          return true
        }
      }
    }
    return false
  }
  public  function rewriteForRenewals(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOAtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var HCONBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HCONB_EXT.Code
        var TDP1typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP1_EXT.Code
        var TDP2typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP2_EXT.Code
        var TDP3typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP3_EXT.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var renewal = typekey.Job.TC_RENEWAL.Code
        var account = typekey.Job.TC_REWRITENEWACCOUNT.Code
        var isCovPresent = dwelling.HODW_EquipBreakdown_HOE_ExtExists
        if((jobType == rewrite or jobType == renewal or jobType == account ) and (policyType == HOAtypeKeyCode or policyType == HOBtypeKeyCode or policyType == HCONBtypeKeyCode or policyType == TDP1typeKeyCode or policyType == TDP2typeKeyCode or policyType == TDP3typeKeyCode) and isCovPresent ){
          var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
          if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
            return true
          }
        }
      }
    }
    return false
    }


  public function rewriteForRenewalsForTX(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS_TX_FORM)){
      if(hoeLine != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOAtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var renewal = typekey.Job.TC_RENEWAL.Code
        var account = typekey.Job.TC_REWRITENEWACCOUNT.Code
        if((jobType == rewrite or jobType == renewal or jobType == account ) and (policyType == HOAtypeKeyCode or policyType == HOBtypeKeyCode) ){
          var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
          if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
          return true
        }
        }
      }
    }
    return false
  }

  public function dwellingFireOrdianceLaw1(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DWELLING_FIRE_ORDIANCE_LAW1_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
        var isCovExists = dwelling.DPDW_OrdinanceCovTX_HOE_ExtExists
        var isTermExists = dwelling.DPDW_OrdinanceCovTX_HOE_Ext.HasDPDW_OrdinanceCovTXLimit_HOETerm
        if(isCovExists and isTermExists and policyType == DP3typeKeyCode){
          var termValue =  dwelling.DPDW_OrdinanceCovTX_HOE_Ext.DPDW_OrdinanceCovTXLimit_HOETerm.OptionValue.Value
          if(termValue > 0.10){
            return true
          }
        }
      }
    }
    return false
  }

   public function dwellingFireOrdianceLaw2(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
     var dwelling = context.Period.HomeownersLine_HOE.Dwelling
     var hoeLine = context.Period.HomeownersLine_HOE
     if(formCode.equals(FormPatternConstants.HO_DWELLING_FIRE_ORDIANCE_LAW2_FORM)){
       if(hoeLine != null and  dwelling != null ){
         var policyType = hoeLine.HOPolicyType.Code
         var LPP3typeKeyCode = typekey.HOPolicyType_HOE.TC_LPP_EXT.Code
         var isCovExists = dwelling.DPDW_OrdinanceCovTX_HOE_ExtExists
         var isTermExists = dwelling.DPDW_OrdinanceCovTX_HOE_Ext.HasDPDW_OrdinanceCovTXLimit_HOETerm
         if(isCovExists and isTermExists and policyType == LPP3typeKeyCode){
           var termValue =  dwelling.DPDW_OrdinanceCovTX_HOE_Ext.DPDW_OrdinanceCovTXLimit_HOETerm.OptionValue.Value
           if(termValue > 0.10){
             return true
           }
         }
       }
     }
     return false
   }

  public function fungiWetDry1(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_FUNGI_WET_DRY1_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var isCovExists1= dwelling.HODW_FungiCov_HOEExists
        var isCovExists2= dwelling.HODW_UnitOwnersPPSpecial_HOE_ExtExists
        var isCovExists3= dwelling.HODW_UnitOwnersCovASpecialLimits_HOE_ExtExists
        if(isCovExists1 and (!isCovExists2 or !isCovExists3) and policyType == HO6typeKeyCode){
          return true
        }
      }
    }
    return false
  }

  public  function fungiWetDry2(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_FUNGI_WET_DRY2_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var isCovExists1= dwelling.HODW_FungiCov_HOEExists
        var isCovExists2= dwelling.HODW_UnitOwnersPPSpecial_HOE_ExtExists
        var isCovExists3= dwelling.HODW_UnitOwnersCovASpecialLimits_HOE_ExtExists
        if(isCovExists1 and (isCovExists2 or isCovExists3) and policyType == HO6typeKeyCode){
          return true
        }
      }
    }
    return false
    }

 public function rewriteForRenewalsForHOB(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
   var dwelling = context.Period.HomeownersLine_HOE.Dwelling
   var hoeLine = context.Period.HomeownersLine_HOE
   if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS_HOB_FORM)){
     if(hoeLine != null and  dwelling != null ){
       var policyType = hoeLine.HOPolicyType.Code
       var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
       var jobType= hoeLine.Branch.Job.Subtype.Code
       var rewrite = typekey.Job.TC_REWRITE.Code
       var renewal = typekey.Job.TC_RENEWAL.Code
       var account = typekey.Job.TC_REWRITENEWACCOUNT.Code
       var territoryCode = dwelling.HOLocation.TerritoryCodeTunaReturned_Ext
       var territoryCodeArray : String [] = {"2", "3", "4","16C","17","19C","19N"}
       var isConditionPresent = hoeLine.HODW_ReplaceCostCovAPaymentSched_HOEExists
       if((jobType == rewrite or jobType == renewal or jobType == account) and  policyType == HOBtypeKeyCode and territoryCodeArray.contains(territoryCode) and !isConditionPresent ){
         var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
         if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
         return true
       }
         /*var transactionTypeCount = hoeLine.Branch.Policy.BoundPeriods.countWhere( \ elt -> elt.Job typeis Renewal)
         if(transactionTypeCount > 0){
           return true
         }*/
       }
     }
   }
   return false
 }

  public function carliforniaEarthQuakeCov(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_CARLIFORNIA_EARTHQUAKE_COV_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var homeBuilt = dwelling.YearBuilt
        var isCovExists_1 = dwelling.HODW_Limited_Earthquake_CA_HOEExists
        var isCovExists_2 = dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists
        var policyType = hoeLine.HOPolicyType.Code
        var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
        if((!isCovExists_1 or !isCovExists_2) and policyType == DP3typeKeyCode  and homeBuilt < 1973 )  {
        return true
      }
      }
    }
    return false
  }

  public function lossAssessment(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_LOSS_ASSESSMENT_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists = dwelling.HODW_LossAssessmentCov_HOE_ExtExists
        var policyType = hoeLine.HOPolicyType.Code
        var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
        var resType = dwelling.ResidenceType
        var condoTypeCode = typekey.ResidenceType_HOE.TC_CONDO.Code
        if( isCovExists  and policyType == DP3typeKeyCode  and resType == condoTypeCode )  {
          return true
        }
      }
    }
    return false
  }
  public function fungiWetForm(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_FUNGI_WET_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists = dwelling.HODW_FungiCov_HOEExists
        var isSec1LimitPresent = dwelling.HODW_FungiCov_HOE.HasHODW_FungiSectionILimit_HOETerm
        var isSec1AgreLimitPresent = dwelling.HODW_FungiCov_HOE.HasHODW_FungiSectionII_HOETerm
        var sec1LimitValue =  dwelling.HODW_FungiCov_HOE.HODW_FungiSectionILimit_HOETerm.OptionValue.Value
        var sec1AgreLimitValue = dwelling.HODW_FungiCov_HOE.HODW_FungiSectionII_HOETerm.OptionValue.Value
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        if( isCovExists and (isSec1LimitPresent or isSec1AgreLimitPresent ) and (policyType == HO3typeKeyCode or policyType == HO4typeKeyCode  or policyType == HO6typeKeyCode ) and  ( sec1LimitValue > 10000 or sec1AgreLimitValue > 10000 ))  {
          return true
        }
      }
    }
    return false
  }

  public  function additionalInsured(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_ADDNL_INSURED_FORM)){
      if(hoeLine != null ){
        var addnlInsuredValue = hoeLine.AdditionalInsureds*.PolicyAdditionalInsuredDetails.Count
        var policyType = hoeLine.HOPolicyType.Code
        var HOAtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var HCOtypeKeyCode = typekey.HOPolicyType_HOE.TC_HCONB_EXT.Code
        if( (policyType == HOAtypeKeyCode or policyType == HOBtypeKeyCode  or policyType == HCOtypeKeyCode ) and addnlInsuredValue > 0 )  {
          return true
        }
      }
    }
    return false
  }

   public function dwellingFireForTX1( context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DWELLING_FIRE_TX1_FORM)){
    if(hoeLine != null and  dwelling != null ){
    var policyType = hoeLine.HOPolicyType.Code
    var TDP1typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP1_EXT.Code
    var TDP2typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP2_EXT.Code
    var isCovExists = dwelling.DPDW_OrdinanceCovTX_HOE_ExtExists
    var isTermPresent = dwelling.DPDW_OrdinanceCovTX_HOE_Ext.HasDPDW_OrdinanceCovTXLimit_HOETerm
    var limitValue = dwelling.DPDW_OrdinanceCovTX_HOE_Ext.DPDW_OrdinanceCovTXLimit_HOETerm.OptionValue.Value
    if( isCovExists and isTermPresent and (policyType == TDP1typeKeyCode or policyType == TDP2typeKeyCode ) and limitValue > 5000 )  {
    return true
    }
    }
    }
    return false
  }

   public function dwellingFireForTX2( context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_DWELLING_FIRE_TX2_FORM)){
    if(hoeLine != null and  dwelling != null ){
    var policyType = hoeLine.HOPolicyType.Code
    var TDP3typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP3_EXT.Code
    var isCovExists = dwelling.DPDW_OrdinanceCovTX_HOE_ExtExists
    var isTermPresent = dwelling.DPDW_OrdinanceCovTX_HOE_Ext.HasDPDW_OrdinanceCovTXLimit_HOETerm
    var limitValue = dwelling.DPDW_OrdinanceCovTX_HOE_Ext.DPDW_OrdinanceCovTXLimit_HOETerm.OptionValue.Value
    if( isCovExists and isTermPresent and policyType == TDP3typeKeyCode and limitValue > 5000 )  {
    return true
    }
    }
    }
    return false
  }

   public function unscheduleLimit( context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_UNSCHEDULE_LIMIT_FORM)){
    if(hoeLine != null and  dwelling != null ){
    var policyType = hoeLine.HOPolicyType.Code
    var HOAtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
    var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
    var HCOtypeKeyCode = typekey.HOPolicyType_HOE.TC_HCONB_EXT.Code
    var isCovExists = dwelling.HODW_UnscheduledJewelryFurs_HOE_ExtExists
    var isTermPresent = dwelling.HODW_UnscheduledJewelryFurs_HOE_Ext.HasHODW_UnschdJewelryFurs_Value_HOETerm
    var limitValue = dwelling.HODW_UnscheduledJewelryFurs_HOE_Ext.HODW_UnschdJewelryFurs_Value_HOETerm.Value
    if( isCovExists and isTermPresent and  (policyType == HOAtypeKeyCode or policyType == HOBtypeKeyCode  or policyType == HCOtypeKeyCode ) and limitValue > 500 )  {
    return true
    }
    }
    }
    return false
    }

    public function section1Deductible( context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
        var dwelling = context.Period.HomeownersLine_HOE.Dwelling
        var hoeLine = context.Period.HomeownersLine_HOE
        if(formCode.equals(FormPatternConstants.HO_SECTION1_DEDUCTIBLE_FORM)){
        if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOAtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var HCOtypeKeyCode = typekey.HOPolicyType_HOE.TC_HCONB_EXT.Code
        var isCovExists = dwelling.HODW_SectionI_Ded_HOEExists
        var isTermPresent = dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm
        var limitValue = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm.OptionValue.Value
        if( isCovExists and isTermPresent and  (policyType == HOAtypeKeyCode or policyType == HOBtypeKeyCode  or policyType == HCOtypeKeyCode ) and limitValue > 0 )  {
        return true
        }
        }
        }
        return false
    }

  public function specialLimitsPersonalProperty(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_SPECIAL_LIMITS_PERSONAL_PROPERTY_FORM)){
      if(hoeLine != null and dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
        var isCovExists = dwelling.HODW_SpecialLimitsCovC_HOEExists
        var isTermsExists = dwelling.HODW_SpecialLimitsCovC_HOE.HasHODW_ElectronicApparatus_Limit_HOETerm or dwelling.HODW_SpecialLimitsCovC_HOE.HasHODW_Firearms_Limit_HOETerm or dwelling.HODW_SpecialLimitsCovC_HOE.HasHODW_JewelryWatchesFurs_Limit_HOETerm or dwelling.HODW_SpecialLimitsCovC_HOE.HasHODW_Money_Limit_HOETerm or dwelling.HODW_SpecialLimitsCovC_HOE.HasHODW_Securties_Limit_HOETerm or dwelling.HODW_SpecialLimitsCovC_HOE.HasHODW_SilverGoldPewter_Limit_HOETerm
        var termValue1 =  dwelling.HODW_SpecialLimitsCovC_HOE.HODW_ElectronicApparatus_Limit_HOETerm.OptionValue.Value
        var termValue2 =   dwelling.HODW_SpecialLimitsCovC_HOE.HODW_Firearms_Limit_HOETerm.OptionValue.Value
        var termValue3 =   dwelling.HODW_SpecialLimitsCovC_HOE.HODW_JewelryWatchesFurs_Limit_HOETerm.OptionValue.Value
        var termValue4 =   dwelling.HODW_SpecialLimitsCovC_HOE.HODW_Money_Limit_HOETerm.OptionValue.Value
        var termValue5 =   dwelling.HODW_SpecialLimitsCovC_HOE.HODW_SilverGoldPewter_Limit_HOETerm.OptionValue.Value
        var termValue6 =  dwelling.HODW_SpecialLimitsCovC_HOE.HODW_Securties_Limit_HOETerm.OptionValue.Value
        if(( policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode) and  isCovExists and isTermsExists and
            (termValue1 > 1000   or termValue2 > 2000 or termValue3 > 1000 or   termValue4 > 200 or  termValue5 > 2500 or  termValue6 > 1000 )
        ) {
          return true
        }
      }
    }
     return false
    }
    public  function propertyIncreasedLimits(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
      var dwelling = context.Period.HomeownersLine_HOE.Dwelling
      var hoeLine = context.Period.HomeownersLine_HOE
      if(formCode.equals(FormPatternConstants.HO_PROPERTY_INCREASED_LIMITS_FORM)){
        if(hoeLine != null and dwelling != null ){
          var policyType = hoeLine.HOPolicyType.Code
          var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
          var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
          var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
          if(( policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode) and dwelling.HODW_BusinessProperty_HOE_ExtExists
              and dwelling.HODW_BusinessProperty_HOE_Ext?.HasHODW_OnPremises_Limit_HOETerm
              and dwelling.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.OptionValue.Value > 2500) {
            return true
          }
        }
      }
      return false
      }

      public function rewriteForRenewals2(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
        var hoeLine = context.Period.HomeownersLine_HOE
        if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS2_FORM)){
          if(hoeLine != null ){
            var policyType = hoeLine.HOPolicyType.Code
            var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
            var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
            var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
            var jobType= hoeLine.Branch.Job.Subtype.Code
            var rewrite = typekey.Job.TC_REWRITE.Code
            var renewal = typekey.Job.TC_RENEWAL.Code
            if( jobType == rewrite  and (policyType == HO3typeKeyCode or policyType == HO4typeKeyCode or policyType== HO6typeKeyCode) ){
              var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
              if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
              return true
            }
            }
          }
        }
  return false
  }

public function rewriteForSubmission(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean  {
  var hoeLine = context.Period.HomeownersLine_HOE
  if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_SUBMISSION_FORM)){
        if(hoeLine != null){
          var policyType = hoeLine.HOPolicyType.Code
          var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
          var jobType= hoeLine.Branch.Job.Subtype.Code
          var rewrite = typekey.Job.TC_REWRITE.Code
          var sub = typekey.Job.TC_SUBMISSION.Code
          var rewriteNewAcc = typekey.Job.TC_REWRITENEWACCOUNT.Code
          if( ( jobType == rewrite or  jobType == sub or jobType == rewriteNewAcc ) and policyType == DP3typeKeyCode  ){
            var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
            if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == sub ){
              return true
            }
          }
        }
      }
      return false
}

  public function rewriteForRenewals3(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean  {
     var hoeLine = context.Period.HomeownersLine_HOE
      if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS3_FORM)){
      if(hoeLine != null ){
      var policyType = hoeLine.HOPolicyType.Code
      var DP3typeKeyCode = typekey.HOPolicyType_HOE.TC_DP3_EXT.Code
      var jobType= hoeLine.Branch.Job.Subtype.Code
      var rewrite = typekey.Job.TC_REWRITE.Code
      var renewal = typekey.Job.TC_RENEWAL.Code
      var account = typekey.Job.TC_REWRITENEWACCOUNT.Code
      if((jobType == rewrite or jobType == renewal or jobType == account) and policyType == DP3typeKeyCode){
      var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
      if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
      return true
      }
      }
      }
      }
    return false
}

  public function rewriteForSubmission2(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean  {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_SUBMISSION2_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOATXtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HCONBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HCONB_EXT.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var sub = typekey.Job.TC_SUBMISSION.Code
        var rewriteNewAcc = typekey.Job.TC_REWRITENEWACCOUNT.Code
        var cancellation = typekey.Job.TC_CANCELLATION.Code
        if( ( jobType == rewrite or  jobType == sub or jobType == rewriteNewAcc ) and (policyType == HOATXtypeKeyCode  or policyType == HCONBtypeKeyCode)){
          var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
          if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == sub ){
          return true
        }
        }
      }
    }
    return false
  }

  public function rewriteForRenewals4(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean  {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS4_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOATXtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HCONBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HCONB_EXT.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var renewal = typekey.Job.TC_RENEWAL.Code
        var rewriteNewAcc = typekey.Job.TC_REWRITENEWACCOUNT.Code
        var cancellation = typekey.Job.TC_CANCELLATION.Code
        if( ( jobType == rewrite or  jobType == renewal or jobType == rewriteNewAcc ) and (policyType == HOATXtypeKeyCode  or policyType == HCONBtypeKeyCode)){
          var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
          if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
          return true
        }
        }
      }
    }
    return false
  }

  public function rewriteForSubmission3(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean  {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_SUBMISSION3_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var sub = typekey.Job.TC_SUBMISSION.Code
        var cancellation = typekey.Job.TC_CANCELLATION.Code
        if( ( jobType == rewrite or  jobType == sub ) and  policyType == HOBtypeKeyCode){
          var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
          if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == sub ){
          return true
        }
        }
      }
    }
    return false
  }

  public function rewriteForRenewals5(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean  {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS5_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var jobType= hoeLine.Branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var cancellation = typekey.Job.TC_CANCELLATION.Code
        var renewal = typekey.Job.TC_RENEWAL.Code
        if( jobType == rewrite and  policyType == HOBtypeKeyCode ){
          var allPreviousJobTypeNames = hoeLine.Branch.Policy.BoundPeriods*.Job.Subtype.Code.reverse()
          if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
            return true
          }
        }
      }
    }
   return false
  }

  public  function ordianceLaw(context: FormInferenceContext, availableStates: Set<Jurisdiction> ) : boolean {
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE
    if(formCode.equals(FormPatternConstants.HO_ORDIANCE_LAW_FORM)){
      var policyType = hoeLine.HOPolicyType.Code
      var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
      var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
      var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
      if(hoeLine != null and dwelling != null and( policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode) and dwelling.HODW_OrdinanceCov_HOEExists
          and dwelling.HODW_OrdinanceCov_HOE?.HasHODW_OrdinanceLimit_HOETerm
          and dwelling.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm.OptionValue.Value > 0.10) {
        return true
      }
    }
   return false
  }
}

