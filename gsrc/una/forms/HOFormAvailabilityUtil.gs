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
            && dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.OptionValue==
        "Actual")

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
          && dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.OptionValue==
              "Replacement") ||
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

    if(formCode.equals(FormPatternConstants.HO_CA_INSURANCE_GUARANTEE_ASSOCIATION_FORM)){
      if(hoeLine != null and hoeLine.HODW_InsuranceGuaranteeAsosciation_HOEExists){
         return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_LENDERS_LOSS_PAYABLE_ENDORSEMENT_FORM)){
      if(hoeLine != null and hoeLine.HODW_LendersLossPayableEndorsement_HOEExists){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_TX_ADDL_PERILS_COVERAGE_FORM)){
      if(hoeLine != null and dwelling != null and dwelling.HODW_AdditionalPerilCov_HOE_ExtExists){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.HO_CA_EQ_COVERAGE_FORM)){
      if(hoeLine != null and dwelling != null){
        if((dwelling.HODW_Limited_Earthquake_CA_HOEExists and (!dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists)) or
            (dwelling.HODW_Comp_Earthquake_CA_HOE_ExtExists and (!dwelling.HODW_Limited_Earthquake_CA_HOEExists))){
          return true
        }
      }
    }

    return false
  }
}