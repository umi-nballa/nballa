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
class UNAFormAvailabilityUtil extends AbstractSimpleAvailabilityForm
{
  override function isAvailable(context: FormInferenceContext, availableStates: Set<Jurisdiction>): boolean {

    var formCode = this.Pattern.FormNumber//Code
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling

    var bownerline = context.Period.BP7Line
    var bopbuildings = context.Period.BP7Line.AllBuildings
    var boplocations = context.Period.BP7Line.BP7Locations

    print("################ form code is " + formCode)


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

      print("##dwelling.HODW_Personal_Property_HOEExists " + dwelling.HODW_Personal_Property_HOEExists)
      print("##dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOETerm " + dwelling.HODW_Personal_Property_HOE.HODW_PropertyValuation_HOETerm.OptionValue)

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


    //Waiting on Faye for Scheduled coverages
    if (formCode.equals("HO 04 61"))
    {
      if(dwelling!=null && dwelling.HODW_ScheduledProperty_HOEExists &&
          dwelling.HODW_ScheduledProperty_HOE.CovTerms.length>0)

        return true
    }


   //BP7AddlInsdManagersLessorsPremises
    //BP7AddlInsdManagersLessorsPremisesLine_EXT
    var formret1=false
    if (formCode.equals("BP 04 02"))
    {
        boplocations?.each( \ elt ->
        {
          if(elt.BP7AddlInsdManagersLessorsPremisesExists)
          {
            formret1= true
          }
        }
      )
      if(formret1==true || (bownerline!=null && bownerline.BP7AddlInsdManagersLessorsPremisesLine_EXTExists))
        return true
    }

    //BP7AddlInsdControllingInterest
    //BP7AddlInsdControllingInterestLocation_EXT
    var formret2=false
    if (formCode.equals("BP 04 06"))
    {
          boplocations.each( \ elt ->
          {
            if(elt.BP7AddlInsdControllingInterestLocation_EXTExists)
              {
                formret2= true
              }
          }
          )
      if(formret2==true || (bownerline!=null && bownerline.BP7AddlInsdControllingInterestExists))
        return true
    }

    //BP7AddlInsdMortgageeAssigneeReceiver
    //BP7AddlInsdMortgageeAssigneeReceiverLine_EXT
    var formret3=false
    if (formCode.equals("BP 04 09"))
    {
      boplocations.each( \ elt ->
      {
        if(elt.BP7AddlInsdMortgageeAssigneeReceiverExists)
        {
          formret3= true
        }
      }
      )
      if(formret3==true || (bownerline!=null && bownerline.BP7AddlInsdMortgageeAsigneeReceiverLine_EXTExists))
        return true
    }

    //BP7AddlInsdLandLeased
    //BP7AddlInsdLandLeased
    var formret4=false
    if (formCode.equals("BP 04 10"))
    {
      boplocations.each( \ elt ->
      {
        if(elt.BP7AddlInsdLandLeasedExists)
        {
          formret4= true
        }
      }
      )
      if(formret4==true)// || (bownerline!=null && bownerline.BP7AddlInsdControllingInterestExists))
        return true
    }

    //BP7AddlInsdCoOwnerInsdPremises
    //BP7AddlInsdCoOwnerInsdPremisesLine_EXT
    var formret5=false
    if (formCode.equals("BP 04 11"))
    {
      boplocations.each( \ elt ->
      {
        if(elt.BP7AddlInsdCoOwnerInsdPremisesExists)
        {
          formret5= true
        }
      }
      )
      if(formret5==true || (bownerline!=null && bownerline.BP7AddlInsdCoOwnerInsdPremisesLine_EXTExists))
        return true
    }

    //BP7AddlInsdLessorsLeasedEquipmt
    //BP7AddlInsdLessorsLeasedEquipmtLine_EXT
    var formret6=false
    if (formCode.equals("BP 04 16"))
    {
      boplocations.each( \ elt ->
      {
        if(elt.BP7AddlInsdLessorsLeasedEquipmtExists)
        {
          formret6= true
        }
      }
      )
      if(formret6==true || (bownerline!=null && bownerline.BP7AddlInsdLessorsLeasedEquipmtLine_EXTExists))
        return true
    }

    //BP7AddlInsdDesignatedPersonOrgLocation_EXT
    //BP7AddlInsdDesignatedPersonOrg
    var formret7=false
    if (formCode.equals("BP 04 48"))
    {
      boplocations.each( \ elt ->
      {
        if(elt.BP7AddlInsdDesignatedPersonOrgLocation_EXTExists)
        {
          formret7= true
        }
      }
      )
      if(formret7==true || (bownerline!=null && bownerline.BP7AddlInsdDesignatedPersonOrgExists))
        return true
    }

    return false
  }
}