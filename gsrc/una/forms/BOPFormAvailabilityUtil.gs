package una.forms

uses java.util.Set
uses gw.forms.FormInferenceContext
uses gw.forms.generic.AbstractSimpleAvailabilityForm

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 12/7/16
 * Time: 5:36 PM
 * To change this template use File | Settings | File Templates.
 */
class BOPFormAvailabilityUtil extends AbstractSimpleAvailabilityForm
{
  override function isAvailable(context: FormInferenceContext, availableStates: Set<Jurisdiction>): boolean {

    var formCode = this.Pattern.FormNumber//Code

    var bownerline = context.Period.BP7Line
    var bopbuildings = context.Period.BP7Line.AllBuildings
    var boplocations = context.Period.BP7Line.BP7Locations

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