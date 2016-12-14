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
    var formNumber = this.Pattern.FormNumber
    var formCode = this.Pattern.Code

    var cppLine = context.Period.CPLine
    var cppLocations = context.Period.CPLine.CPLocations

    var formReturn1 = false
    if (formCode.equals(FormPatternConstants.CPP_LINE_CAUSE_OF_LOSS_BASIC_FORM)){
        cppLocations?.each( \ elt ->
        {
          elt.Buildings?.each( \ elt1 ->
          {
              if(elt1.CPBldgCovExists and elt1.CPBldgCov.CPBldgCovCauseOfLossTerm.Value == "Basic") {
                 formReturn1 = true
              }
          })
        }
      )
      if(formReturn1 and cppLine != null){
         return true
      }
    }
    var formReturn2 = false
    if (formCode.equals(FormPatternConstants.CPP_LINE_CAUSE_OF_LOSS_SPECIAL_FORM)){
      cppLocations?.each( \ elt ->
      {
        elt.Buildings?.each( \ elt1 ->
        {
          if(elt1.CPBldgCovExists and elt1.CPBldgCov.CPBldgCovCauseOfLossTerm.Value == "Special") {
            formReturn2 = true
          }
        })
      }
      )
      if(formReturn2 and cppLine != null){
        return true
      }
    }
    var formReturn3 = false
    if(formCode.equals(FormPatternConstants.CPP_LINE_ADDL_NAMED_INSURED_FORM)){
      var polAddlNamedInsureds = context.Period.PolicyContactRoles.where( \ elt -> elt.Subtype == typekey.PolicyContactRole.TC_POLICYADDLNAMEDINSURED)
      if(polAddlNamedInsureds != null and polAddlNamedInsureds.length > 0){
        formReturn3 = true
      }
      if(formReturn3 and cppLine != null){
         return true
      }
    }

    var formReturn4 = false
    if(formNumber.equals("FL CRPP NR")){
      if(context.Period.Job.Subtype == typekey.Job.TC_RENEWAL){
          formReturn4 = true
      }
      if(formReturn4 and cppLine != null){
          return true
      }
    }

    return false
  }

}