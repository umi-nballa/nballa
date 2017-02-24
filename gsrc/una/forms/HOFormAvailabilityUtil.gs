package una.forms

uses gw.forms.generic.AbstractSimpleAvailabilityForm
uses java.util.Set
uses gw.forms.FormInferenceContext
uses gw.api.productmodel.ConditionPattern
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
          dwelling.HODW_Personal_Property_HOE.HasHODW_PropertyValuation_HOE_ExtTerm
          && dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOE_ExtTerm.Value == tc_PersProp_ReplCost)

        return true
    }

    if (formNumber.equals("TDP-002"))
    {
      if((dwelling!=null && dwelling.DPDW_Dwelling_Cov_HOEExists &&
          dwelling.DPDW_Dwelling_Cov_HOE.HasDPDW_ValuationMethod_HOE_ExtTerm
          && dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.Value == tc_ReplCost) ||
          (dwelling!=null && dwelling.HODW_Personal_Property_HOEExists &&
              dwelling.HODW_Personal_Property_HOE.HasHODW_PropertyValuation_HOE_ExtTerm
              && dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOE_ExtTerm.Value == tc_PersProp_ReplCost))

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
        dwelling.HODW_Personal_Property_HOE?.HasHODW_PropertyValuation_HOE_ExtTerm and
        dwelling.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm.Value == tc_PersProp_ReplCost){
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


    if(formCode.equals(FormPatternConstants.HO_BUSINESS_PROPERTY_INCREASED_LIMITS_FORM)){
      var policyType = hoeLine.HOPolicyType.Code
      var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
      var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
      var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code
      if(hoeLine != null and dwelling != null and( policyType == HO3typeKeyCode or  policyType == HO4typeKeyCode or  policyType == HO6typeKeyCode) and dwelling.HODW_BusinessProperty_HOE_ExtExists
          and dwelling.HODW_BusinessProperty_HOE_Ext?.HasHODW_OnPremises_Limit_HOETerm
          and dwelling.HODW_BusinessProperty_HOE_Ext.HODW_OnPremises_Limit_HOETerm.OptionValue.OptionCode == "2500") {
        return true
      }
      }
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

    if(formCode.equals(FormPatternConstants.HO_CARLIFORNIA_EARTHQUAKE_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var homeBuilt = dwelling.YearBuilt
        var isCovExists_1 = dwelling.HODW_Limited_Earthquake_CA_HOEExists
        var isCovExists_2 = dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists

        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code

        if((isCovExists_1 or isCovExists_2) and (policyType == HO3typeKeyCode or policyType == HO4typeKeyCode or policyType == HO6typeKeyCode) and homeBuilt < 1973 )  {
          return true
        }
      }

    }

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

    if(formCode.equals(FormPatternConstants.HO_DIFFERENCE_COVERAGE_NOTSELECTD_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var isCovExists = dwelling.HODW_DifferenceConditions_HOE_ExtExists
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code

        if(( policyType == HO3typeKeyCode or policyType == HO4typeKeyCode or policyType == HO6typeKeyCode) and !isCovExists)  {
          return true
        }
      }
    }

    if(formCode.equals(FormPatternConstants.HO_CARLIFORNIA_EARTHQUAKE_COVERAGE_NOTSELECTD_FORM)){
      if(hoeLine != null and  dwelling != null ){
       var isCovExists_1 = dwelling.HODW_Limited_Earthquake_CA_HOEExists
       var isCovExists_2 = dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists
        var policyType = hoeLine.HOPolicyType.Code
        var HO3typeKeyCode = typekey.HOPolicyType_HOE.TC_HO3.Code
        var HO4typeKeyCode = typekey.HOPolicyType_HOE.TC_HO4.Code
        var HO6typeKeyCode = typekey.HOPolicyType_HOE.TC_HO6.Code

        if(( policyType == HO3typeKeyCode or policyType == HO4typeKeyCode or policyType == HO6typeKeyCode) and !isCovExists_1 and !isCovExists_2)  {
          return true
        }
      }
    }

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
    if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOAtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var HCONBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HCONB_EXT.Code
        var TDP1typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP1_EXT.Code
        var TDP2typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP2_EXT.Code
        var TDP3typeKeyCode = typekey.HOPolicyType_HOE.TC_TDP3_EXT.Code
        var jobType= hoeLine.branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        if(jobType == rewrite and (policyType == HOAtypeKeyCode or policyType == HOBtypeKeyCode or policyType == HCONBtypeKeyCode or policyType == TDP1typeKeyCode or policyType == TDP2typeKeyCode or policyType == TDP3typeKeyCode) ){
          var transactionTypeCount = hoeLine.Branch.Policy.BoundPeriods.countWhere( \ elt -> elt.Job typeis Renewal)
          if(transactionTypeCount > 0){
               return true
          }
        }
      }
    }

    if(formCode.equals(FormPatternConstants.HO_REWRITE_FOR_RENEWALS_TX_FORM)){
      if(hoeLine != null and  dwelling != null ){
        var policyType = hoeLine.HOPolicyType.Code
        var HOAtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOA_EXT.Code
        var HOBtypeKeyCode = typekey.HOPolicyType_HOE.TC_HOB_EXT.Code
        var jobType= hoeLine.branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        if(jobType == rewrite and (policyType == HOAtypeKeyCode or policyType == HOBtypeKeyCode) ){
          var transactionTypeCount = hoeLine.Branch.Policy.BoundPeriods.countWhere( \ elt -> elt.Job typeis Renewal)
          if(transactionTypeCount > 0){
            return true
          }
        }
      }
    }
      return false
  }
}

