package una.forms


/**
 * Created with IntelliJ IDEA.
 * User: proy
 * Date: 12/12/16
 * Time: 4:28 PM
 * To change this template use File | Settings | File Templates.
 */

uses java.util.Set
uses gw.forms.FormInferenceContext
uses gw.forms.generic.AbstractSimpleAvailabilityForm
uses gw.lob.common.util.FormPatternConstants

class CPPFormAvailabilityUtil extends AbstractSimpleAvailabilityForm {

  override function isAvailable(context: FormInferenceContext, availableStates: Set<Jurisdiction>): boolean {

    var formCode = this.Pattern.Code
    var cppLine = context.Period.CPLine
    var cppLocations = context.Period.CPLine.CPLocations

    if(formCode.equals(FormPatternConstants.CPP_LINE_ADDL_NAMED_INSURED_FORM)){
      var polAddlNamedInsureds = context.Period?.PolicyContactRoles.where( \ elt -> elt.Subtype == typekey.PolicyContactRole.TC_POLICYADDLNAMEDINSURED)
      if(cppLine != null and polAddlNamedInsureds != null and polAddlNamedInsureds.length > 0){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.CPP_LINE_BUILDING_AND_PERSONAL_PROPERTY_FORM)) {
       if(cppLine != null and context.Period.Policy?.PackageRisk != null and (context.Period.Policy.PackageRisk == typekey.PackageRisk.TC_HOMEOWNERSASSOCIATION or
           context.Period.Policy.PackageRisk == typekey.PackageRisk.TC_APARTMENT)){
          return true
       }
    }

    if(formCode.equals(FormPatternConstants.CPP_ORDINANCE_LAW_FORM)) {
      var formRet = false
      cppLocations?.each( \ elt ->
      {
        elt.Buildings?.each( \ elt1 ->
        {
          if(elt1.CPOrdinanceorLaw_EXTExists and elt1.CPOrdinanceorLaw_EXT.HasCPOrdinanceorLawCovABCLimit_EXTTerm) {
            formRet = true
          }
        })
      })
      if(formRet){
          return formRet
      }
    }

    if(formCode.equals(FormPatternConstants.CPP_ADDL_INSURED_MGR_OR_LESSER_FORM)){
      var formRet = false
      var polAddlInsureds = context.Period?.PolicyContactRoles.where( \ elt -> elt.Subtype == typekey.PolicyContactRole.TC_POLICYADDLINSURED)
       polAddlInsureds?.each( \ elt -> {
         if(elt typeis PolicyAddlInsured){
                var polAdditionalInsuredDetails = elt.PolicyAdditionalInsuredDetails
                polAdditionalInsuredDetails?.each( \ elt1 -> {
                   if(elt1.AdditionalInsuredType == typekey.AdditionalInsuredType.TC_MGRORLESSOROFPREMISES_EXT){
                       formRet = true
                   }
                })
            }
       })
       if(formRet and context.Period?.GLLineExists){
           return true
       }
    }

    if(formCode.equals(FormPatternConstants.CPP_ADDL_INSURED_DESIGNATED_PERSON_OR_ORG_FORM)){
      var formRet = false
      var polAddlInsureds = context.Period?.PolicyContactRoles.where( \ elt -> elt.Subtype == typekey.PolicyContactRole.TC_POLICYADDLINSURED)
      polAddlInsureds?.each( \ elt -> {
        if(elt typeis PolicyAddlInsured){
          var polAdditionalInsuredDetails = elt.PolicyAdditionalInsuredDetails
          polAdditionalInsuredDetails?.each( \ elt1 -> {
            if(elt1.AdditionalInsuredType == typekey.AdditionalInsuredType.TC_DESIGNATEDPERSONSORORGS_EXT){
              formRet = true
            }
          })
        }
      })
      if(formRet and context.Period?.GLLineExists){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.CPP_ADDL_INSURED_LESSER_OF_LEASED_EQUIPMENT_FORM)){
      var formRet = false
      var polAddlInsureds = context.Period?.PolicyContactRoles.where( \ elt -> elt.Subtype == typekey.PolicyContactRole.TC_POLICYADDLINSURED)
      polAddlInsureds?.each( \ elt -> {
        if(elt typeis PolicyAddlInsured){
          var polAdditionalInsuredDetails = elt.PolicyAdditionalInsuredDetails
          polAdditionalInsuredDetails?.each( \ elt1 -> {
            if(elt1.AdditionalInsuredType == typekey.AdditionalInsuredType.TC_LESSORORLEASEDEQUIP_EXT){
              formRet = true
            }
          })
        }
      })
      if(formRet and context.Period?.GLLineExists){
        return true
      }
    }

    if(formCode.equals(FormPatternConstants.CPP_REWRITE_FOR_RENEWALS_FORM)){
      if(cppLine != null ){
        var jobType= cppLine.Branch.Job.Subtype.Code
        var rewrite = typekey.Job.TC_REWRITE.Code
        var renewal = typekey.Job.TC_RENEWAL.Code
        var account = typekey.Job.TC_REWRITENEWACCOUNT.Code
        var cancellation = typekey.Job.TC_CANCELLATION.Code
        if(jobType == rewrite or jobType == renewal or jobType == account){
          var allPreviousJobTypeNames = cppLine.Branch.Policy.BoundPeriods.Job.Subtype.Code
          if(allPreviousJobTypeNames[0] == cancellation  and allPreviousJobTypeNames[1] == renewal ){
          return true
        }
        }
      }
    }


    return false
  }

}