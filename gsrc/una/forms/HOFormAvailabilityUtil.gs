package una.forms

uses gw.forms.generic.AbstractSimpleAvailabilityForm
uses java.util.Set
uses gw.forms.FormInferenceContext

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

    var formCode = this.Pattern.FormNumber//Code
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling


    if (formCode.equals("HO 04 81") || formCode.equals("UN LPP 04 76"))
      {
        if(dwelling!=null && dwelling.DPDW_Dwelling_Cov_HOEExists &&
            dwelling.DPDW_Dwelling_Cov_HOE.HasDPDW_ValuationMethod_HOE_ExtTerm
            && dwelling.DPDW_Dwelling_Cov_HOE.DPDW_ValuationMethod_HOE_ExtTerm.OptionValue==
        "Actual")

          return true
      }

    if (formCode.equals("HO 04 90") || formCode.equals("HO-101") || formCode.equals("UI 04 90") )
    {

      if(dwelling!=null && dwelling.HODW_Personal_Property_HOEExists &&
          dwelling.HODW_Personal_Property_HOE.HasHODW_PropertyValuation_HOETerm
          && dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOETerm.OptionValue==
              "Replacement")

        return true
    }

    if (formCode.equals("TDP-002"))
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

    if (formCode.equals("UN 09 56"))
    {
      if(dwelling!=null && dwelling.HODW_Dwelling_Cov_HOEExists &&
          dwelling.HODW_Dwelling_Cov_HOE.HasHODW_ExecutiveCov_HOE_ExtTerm)

        return true
    }

    if (formCode.equals("UN LPP 03 12"))
    {
      if(dwelling!=null && dwelling.HODW_SectionI_Ded_HOEExists &&
          dwelling.HODW_SectionI_Ded_HOE.HasHODW_WindHail_Ded_HOETerm)

        return true
    }

    if (formCode.equals("UN LPP 03 51"))
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
    if (formCode.equals("HO 04 61"))
    {
      if(dwelling!=null && dwelling.HODW_ScheduledProperty_HOEExists &&
          dwelling.HODW_ScheduledProperty_HOE.CovTerms.length>0)

        return true
    }

    return false
  }
}