package una.forms

uses java.util.Set
uses gw.forms.FormInferenceContext
uses gw.forms.generic.AbstractSimpleAvailabilityForm
uses gw.lob.common.util.FormPatternConstants

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

    var formCode = this.Pattern.Code

    var bownerline = context.Period.BP7Line
    var bopbuildings = context.Period.BP7Line.AllBuildings
    var boplocations = context.Period.BP7Line.BP7Locations


   //BP7AddlInsdManagersLessorsPremises
    //BP7AddlInsdManagersLessorsPremisesLine_EXT
    var formret1=false
    if (formCode.equals(FormPatternConstants.BOP_ADDL_INSURED_MGR_OR_LESSOR_FORM))
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
    if (formCode.equals(FormPatternConstants.BOP_ADDL_INSURED_CONTROL_INTEREST_FORM))
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
    if (formCode.equals(FormPatternConstants.BOP_ADDL_INSURED_MORTGAGE_ASSIGNEE_FORM))
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
    if (formCode.equals(FormPatternConstants.BOP_ADDL_INSURED_OWNER_OF_LAND_LEASE_FORM))
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
    if (formCode.equals(FormPatternConstants.BOP_ADDL_INSURED_CO_OWNER_FORM))
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
    if (formCode.equals(FormPatternConstants.BOP_ADDL_INSURED_LESSOR_OF_LEASE_FORM))
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
    if (formCode.equals(FormPatternConstants.BOP_ADDL_INSURED_DESIGNATED_PERSON_FORM))
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

    var bopLine = context.Period.BOPLine
    var bopLineLocations = bopLine?.BOPLocations
    var formReturn9 = false
    if(formCode.equals(FormPatternConstants.BOP_CONDO_COMMERCIAL_UNIT_OWNERS_OPT_COVERAGES_FORM)){
      if(bownerline != null and bownerline.AllClassifications != null){
        bownerline.AllClassifications.each( \ elt -> {
          if(elt.BP7CondoCommlUnitOwnersOptionalCovsLossAssessExists or elt.BP7CondoCommlUnitOwnersOptionalCovMiscRealPropExists){
            formReturn9 = true
          }
        })
      }
      if(formReturn9){
        return true
      }
    }

    var formret10=false
    if (formCode.equals(FormPatternConstants.BOP_ADDL_INSURED_GRANTOR_OF_FRANCHISE_FORM))
    {
      boplocations?.each( \ elt ->
      {
        if(elt.BP7AddlInsdGrantorOfFranchiseEndorsementExists and elt.BP7AddlInsdGrantorOfFranchiseEndorsement != null)
        {
          formret10= true
        }
      }
      )
      if(formret10 || (bownerline!=null && bownerline.BP7AddlInsdGrantorOfFranchiseLine_EXTExists))
        return true
    }

    /*var formReturn8 = false
    if(formCode.equals(FormPatternConstants.BOP_WINDSTORM_HAIL_DEDUCTIBLE_FORM)){
       bopLineLocations.each( \ elt -> {
          if(elt.BOPLocWindHailCovExists and elt.BOPLocWindHailCov?.HasBOPWindHailDedTerm){
              formReturn8 = true
          }
       })
       if(formReturn8 and bopLineLocations != null){
           return true
       }
    }*/

    /*if(formCode.equals(FormPatternConstants.BOP_COMP_BUSINESS_LIABILITY_EXCLUSION_FORM)){
      if(bownerline != null and bownerline.BP7BusinessLiabilityExclusion_EXTExists
          and bownerline.BP7BusinessLiabilityExclusion_EXT != null){
        return true
      }
    }*/

    /*if(formCode.equals(FormPatternConstants.BOP_HIRED_AUTO_AND_NON_OWNED_FORM)) {
      if(bownerline != null and bownerline.BP7HiredNonOwnedAutoExists and bownerline.BP7HiredNonOwnedAuto != null){
         return true
      }
    }*/
    /*if(formCode.equals(FormPatternConstants.BOP_COV_LIMIT_DESIGNATED_PREMISES_FORM)) {
      if(bownerline != null and bownerline.BP7LimitationDesignatedPremisesOrProject_EXTExists and
          bownerline.BP7LimitationDesignatedPremisesOrProject_EXT != null){
        return true
      }
    }*/
    /*var formReturn9 = false
    if(formCode.equals(FormPatternConstants.BOP_SPOILAGE_COVERAGE_FORM)){
      if(bownerline != null and bownerline.AllClassifications != null){
        bownerline.AllClassifications.each( \ elt -> {
            if(elt.BP7SpoilgCovExists){
                formReturn9 = true
            }
        })
      }
      if(formReturn9){
         return true
      }
    }*/

    if(formCode.equals(FormPatternConstants.BOP_REWRITE_FOR_RENEWALS_FORM)){
      if(bownerline != null and  bopbuildings != null ){
        var jobType= bownerline.Branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var renewal = typekey.Job.TC_RENEWAL.Code
        var account = typekey.Job.TC_REWRITENEWACCOUNT.Code
        var cancellation = typekey.Job.TC_CANCELLATION.Code
        if(jobType == rewrite or jobType == renewal or jobType == account){
          var allPreviousJobTypeNames = bownerline.Branch.Policy.BoundPeriods.Job.Subtype.Code
          if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
          return true
        }
        }
      }
    }
    return false
  }
}