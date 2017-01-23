package una.forms

uses gw.forms.generic.AbstractSimpleAvailabilityForm
uses java.util.Set
uses gw.forms.FormInferenceContext
uses gw.api.productmodel.ConditionPattern
uses gw.lob.common.util.FormPatternConstants

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 12/7/16
 * Time: 5:36 PM
 * To change this template use File | Settings | File Templates.
 */
class HOFormAvailabilityUtil extends AbstractSimpleAvailabilityForm
{
  override function isAvailable(context: FormInferenceContext, availableStates: Set<Jurisdiction>): boolean {

    var formNumber = this.Pattern.FormNumber//Code
    var formCode = this.Pattern.Code
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    var hoeLine = context.Period.HomeownersLine_HOE


    if (formNumber.equals("HO 04 81") || formNumber.equals("UN LPP 04 76"))
      {
        if(dwelling!=null && dwelling.DPDW_Dwelling_Cov_HOEExists &&
            dwelling.DPDW_Dwelling_Cov_HOE.HasDPDW_ValuationMethod_HOE_ExtTerm
            && dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.Value== tc_ACV)

          return true
      }

    if (formNumber.equals("HO 04 90") || formNumber.equals("HO-101") || formNumber.equals("UI 04 90") )
    {

      if(dwelling!=null && dwelling.HODW_Personal_Property_HOEExists &&
          dwelling.HODW_Personal_Property_HOE.HasHODW_PropertyValuation_HOETerm
          && dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOETerm.OptionValue==
              "Replacement")

        return true
    }

    if (formNumber.equals("TDP-002"))
    {
      if((dwelling!=null && dwelling.DPDW_Dwelling_Cov_HOEExists &&
          dwelling.DPDW_Dwelling_Cov_HOE.HasDPDW_ValuationMethod_HOE_ExtTerm
          && dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.Value == tc_ReplCost) ||
          (dwelling!=null && dwelling.HODW_Personal_Property_HOEExists &&
              dwelling.HODW_Personal_Property_HOE.HasHODW_PropertyValuation_HOETerm
              && dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOETerm.OptionValue==
                  "Replacement"))

        return true
    }

    if (formNumber.equals("UN 09 56"))
    {
      if(dwelling!=null && dwelling.HODW_Dwelling_Cov_HOEExists &&
          dwelling.HODW_Dwelling_Cov_HOE.HasHODW_ExecutiveCov_HOE_ExtTerm)

        return true
    }

    if (formNumber.equals("UN LPP 03 12"))
    {
      if(dwelling!=null && dwelling.HODW_SectionI_Ded_HOEExists &&
          dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm)

        return true
    }

    if (formNumber.equals("UN LPP 03 51"))
    {
      if(dwelling!=null && dwelling.HODW_SectionI_Ded_HOEExists &&
          dwelling.HODW_SectionI_Ded_HOE.HasHODW_Hurricane_Ded_HOETerm)

        return true
    }

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



    //Waiting on Faye for Scheduled coverages
    if (formNumber.equals("HO 04 61"))
    {
      if(dwelling!=null && dwelling.HODW_ScheduledProperty_HOEExists &&
          dwelling.HODW_ScheduledProperty_HOE.CovTerms.length>0)
        return true
    }

    if(formCode.equals(FormPatternConstants.HO_CA_EQ_COVERAGE_FORM)){
      if(hoeLine != null and dwelling != null){
        if(!dwelling.HODW_Limited_Earthquake_CA_HOEExists and !dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists){
          return true
        }
      }
    }

    if(formCode.equals(FormPatternConstants.HO_ADDL_INSURED_LIABILITY_0788_FORM) or
        formCode.equals(FormPatternConstants.HO_ADDL_INSURED_LIABILITY_1202_FORM)){
      var polAddlInsureds = context.Period.PolicyContactRoles.where( \ elt -> elt.Subtype == typekey.PolicyContactRole.TC_POLICYADDLINSURED)
      if(hoeLine != null and polAddlInsureds != null and polAddlInsureds.length > 0){
          return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_PREMISES_LIABILITY_FORM) or
        formCode.equals(FormPatternConstants.HO_UNIT_OWNER_RENTAL_1000_FORM) or
        formCode.equals(FormPatternConstants.HO_UNIT_OWNER_RENTAL_0511_FORM) or
        formCode.equals(FormPatternConstants.HO_UNIT_OWNER_RENTAL_1093_FORM)){
       if(hoeLine != null and dwelling != null and dwelling.Occupancy == typekey.DwellingOccupancyType_HOE.TC_NONOWN){
           return true
       }
    }
    if(formCode.equals(FormPatternConstants.HO_ADDL_DESC_LOCATION_0788_FORM) or
        formCode.equals(FormPatternConstants.HO_ADDL_DESC_LOCATION_1202_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_AdditionalInsuredSchedDescribedLocationExists){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_CONDO_UNIT_OWNER_COV_FORM)){
      if(hoeLine != null and dwelling != null and (dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO or
          dwelling.ResidenceType == typekey.ResidenceType_HOE.TC_CONDO)){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_WIND_OR_HAIL_DEDUCTIBLE__0511_FORM) or
        formCode.equals(FormPatternConstants.HO_WIND_OR_HAIL_DEDUCTIBLE_0901_FORM)){
         if(hoeLine != null and dwelling != null and dwelling.HODW_SectionI_Ded_HOEExists and
             dwelling.HODW_SectionI_Ded_HOE?.HasHODW_WindHail_Ded_HOETerm){
              return true
         }
    }

    if(formCode.equals(FormPatternConstants.HO_PERSONAL_PROPERTY_REPLACEMENT_COST_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_Personal_Property_HOEExists and
        dwelling.HODW_Personal_Property_HOE?.HasHODW_PropertyValuation_HOETerm and
        dwelling.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOETerm.OptionValue.CodeIdentifier == "Replacement"){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_SUPP_LOSS_ASSESSMENT_COVERAGE_FORM)){
        if(hoeLine != null and dwelling != null and dwelling.HODW_LossAssessmentCov_HOE_ExtExists
          and dwelling.HODW_LossAssessmentCov_HOE_Ext?.HasHOPL_LossAssCovLimit_HOETerm and
            (dwelling.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm.Value == "5000" or
                dwelling.HODW_LossAssessmentCov_HOE_Ext.HOPL_LossAssCovLimit_HOETerm.Value == "10000")){
             return true
        }
    }

    if(formCode.equals(FormPatternConstants.HO_PERSONAL_PROPERTY_OTHER_RESIDENCES_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_PersonalPropertyOffResidence_HOEExists and
          dwelling.HODW_PersonalPropertyOffResidence_HOE?.HasHOLI_PPOtherResidence_Limit_HOETerm and
          dwelling.HODW_Dwelling_Cov_HOEExists and dwelling.HODW_Dwelling_Cov_HOE?.HasHODW_Dwelling_Limit_HOETerm and
          dwelling.HODW_PersonalPropertyOffResidence_HOE?.HOLI_PPOtherResidence_Limit_HOETerm.Value > (1.1 * dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm.Value)){
            return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_CC_INCREASED_FORM)){
       if(hoeLine != null and dwelling != null and dwelling.HODW_CC_EFT_HOE_ExtExists and
           dwelling.HODW_CC_EFT_HOE_Ext?.HasHODW_CC_EFTLimit_HOETerm and
           dwelling.HODW_CC_EFT_HOE_Ext?.HODW_CC_EFTLimit_HOETerm.Value > "500"){
              return true
       }
    }

    if(formCode.equals(FormPatternConstants.HO_FIRST_TIME_IMP_NOTICE_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HomeNewPurchase_Ext and dwelling.BuilderWarranty_Ext
          and dwelling.HODW_CC_EFT_HOE_ExtExists){
         return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_NAMED_STORM_DEDUCTIBLE_TERM_FORM) or
        formCode.equals(FormPatternConstants.HO_NAMED_STORM_PERCENTAGE_DEDUCTIBLE_FORM) or
        formCode.equals(FormPatternConstants.HO_NAMED_STORM_DEDUCTIBLE_ENDORSEMENT_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_SectionI_Ded_HOEExists and
          dwelling.HODW_SectionI_Ded_HOE?.HasHODW_NamedStrom_Ded_HOE_ExtTerm){
        return true
      }
    }

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

    if(formCode.equals(FormPatternConstants.HO_EXECUTIVE_COVERAGE_FORM)){
      if(hoeLine != null and dwelling != null and
          dwelling.HODW_Dwelling_Cov_HOEExists and dwelling.HODW_Dwelling_Cov_HOE?.HasHODW_ExecutiveCov_HOE_ExtTerm){
        return true
      }
    }

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

    if(formCode.equals(FormPatternConstants.HO_CONSENT_TO_RATE_HO3_FORM) or
        formCode.equals(FormPatternConstants.HO_CONSENT_TO_RATE_HO4_FORM) or
        formCode.equals(FormPatternConstants.HO_CONSENT_TO_RATE_HO6_FORM)){
      if(hoeLine != null and dwelling != null and context.Period.ConsentToRateReceived_Ext){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_ADDL_INSURED_DESCRIBED_LOCATION_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_AdditionalInsuredSchedDescribedLocationExists){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_DP3_PROTECTION_SYSTEM_CA_FL_FORM)){
      if(hoeLine != null and dwelling != null and (dwelling.DwellingProtectionDetails?.FireAlarm or
          dwelling.DwellingProtectionDetails?.FireAlarmReportFireStn or dwelling.DwellingProtectionDetails?.FireAlarmReportCntlStn or
          dwelling.DwellingProtectionDetails?.FireAlarmReportPoliceStn or
          dwelling.DwellingProtectionDetails?.SprinklerSystemType == typekey.SprinklerSystemType_HOE.TC_FULL or
          dwelling.DwellingProtectionDetails?.SprinklerSystemType == typekey.SprinklerSystemType_HOE.TC_PARTIAL)){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_DP3_PROTECTION_SYSTEM_HI_FORM)){
      if(hoeLine != null and dwelling != null and (dwelling.DwellingProtectionDetails?.FireAlarm or
          dwelling.DwellingProtectionDetails?.FireAlarmReportFireStn or dwelling.DwellingProtectionDetails?.FireAlarmReportCntlStn or
          dwelling.DwellingProtectionDetails?.FireAlarmReportPoliceStn or
          dwelling.DwellingProtectionDetails?.SprinklerSystemType == typekey.SprinklerSystemType_HOE.TC_FULL)){
        return true
      }
    }

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

    if(formCode.equals(FormPatternConstants.HO_NO_DWELLING_FIRE_OTHER_STRUCTURE_FORM)){
      if(hoeLine != null and dwelling != null and !dwelling?.DPDW_Other_Structures_HOEExists){
        return true
      }
    }

    return false
  }
}

