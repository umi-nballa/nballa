package una.pageprocess.renewal
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/21/16
 * Time: 5:23 PM
 * To change this template use File | Settings | File Templates.
 */
class PreRenewalPCFController {
  private var _policyTerm : PolicyTerm

  construct(policyTerm : PolicyTerm){
    this._policyTerm = policyTerm
  }

  property get NonRenewReasons() : List<NonRenewalCode>{
    var results : List<NonRenewalCode> = {}

    switch(_policyTerm.Policy.ProductCode){
      case "Homeowners":
        results = NonRenewalCode.TF_HONONRENEWREASONS.TypeKeys
        break
      case "CommercialPackage":
      case "BP7BusinessOwners":
        results = NonRenewalCode.TF_COMMERCIALNONRENEWREASONS.TypeKeys
        break
      default:
        break
    }

    return results.orderByDescending( \ elt -> elt.Description)
  }

  function isAdditionalTextRequired(nonRenewReason : NonRenewalCode) : boolean{
    return NonRenewalCode.TF_ADDITIONALTEXTREQUIREDTYPES.TypeKeys.contains(nonRenewReason)
  }

  function isAdditionalTextVisible() : boolean{
    return {"BP7BusinessOwners", "CommercialPackage"}.contains(_policyTerm.Policy.ProductCode)
      and  _policyTerm.PreRenewalDirection=="nonrenew"
  }

  function onNonRenewReasonCodeChanged(){
    var newExplanationCodes = _policyTerm.NonRenewReason.getNonRenewExplanationCodes(_policyTerm)

    _policyTerm.NonRenewalExplanations?.each( \ existingExplanation -> {
      if(!newExplanationCodes.hasMatch( \ newExplanation -> newExplanation.Code == existingExplanation.Code)){
        existingExplanation?.remove()
      }
    })
  }
}