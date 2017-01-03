package gw.lob.ho

uses gw.validation.PCValidationContext
uses gw.policy.PolicyLineValidation
uses gw.api.util.JurisdictionMappingUtil

class HomeownersLineValidation_HOE extends PolicyLineValidation<entity.HomeownersLine_HOE> {
  
  property get hoLine() : HomeownersLine_HOE { return Line as HomeownersLine_HOE }

  construct(valContext : PCValidationContext, polLine : HomeownersLine_HOE) {
    super(valContext, polLine)
  }
  
  override function doValidate() {
    validatePolicyType()
    validateBaseStateAndDwellingState()
    new HODwellingValidation_HOE(Context, hoLine.Dwelling).validate()
    new CoveragesValidation_HOE(Context, hoLine).validate()
  }

  function validatePolicyType() : Boolean  {
    
    var policyTypeValid : Boolean = true
    
    Context.addToVisited(this, "validatePolicyType")
    if (hoLine.HOPolicyType != "DP2"and hoLine.Dwelling.DwellingUsage == "rent") {
      policyTypeValid = false
      addErrorOrWarning(displaykey.Web.Policy.HomeownersLine.Validation.DwellingBeingRented(hoLine.HOPolicyType))
    }
    if (not (hoLine.HOPolicyType == "HO3"or hoLine.HOPolicyType == "HO4"or hoLine.HOPolicyType == "HO6")
      and hoLine.Dwelling.DwellingUsage == "seas"){
      policyTypeValid = false
      addErrorOrWarning(displaykey.Web.Policy.HomeownersLine.Validation.DwellingSeasonal(hoLine.HOPolicyType))
    }
    if (not (hoLine.HOPolicyType == "HO3"or hoLine.HOPolicyType == "HO4"or hoLine.HOPolicyType == "HO6")
      and hoLine.Dwelling.DwellingUsage == "sec"){
      policyTypeValid = false
      addErrorOrWarning(displaykey.Web.Policy.HomeownersLine.Validation.DwellingSecondary(hoLine.HOPolicyType))
    }
    if (hoLine.HOPolicyType != "DP2" 
         and hoLine.Dwelling.Occupancy == "vacant" and hoLine.Dwelling.OccupancyVacant ) {
      policyTypeValid = false
      addErrorOrWarning(displaykey.Web.Policy.HomeownersLine.Validation.DwellingIsVacant(hoLine.HOPolicyType))
    }



        return policyTypeValid
  }
  
  function validateBaseStateAndDwellingState() {
    Context.addToVisited(this, "validateBaseStateAndDwellingState")
    if (hoLine.BaseState <> JurisdictionMappingUtil.getJurisdiction(hoLine.Dwelling.HOLocation.PolicyLocation)) {
      print("field error msg")
      Result.addFieldError(hoLine.Dwelling.PolicyPeriod, "BaseState", "default", displaykey.Web.Policy.HomeownersLine.Validation.BaseStateDoesNotMatchDwellingState, "PolicyInfo")
    }
  }
  
  private function addErrorOrWarning(message: String){
    if (Context.isAtLeast("quotable")) {
      Result.addError(hoLine, "quotable", message)
    }
    else {
      Result.addWarning(hoLine, "default", message)
    }
  }
  
   static function validateDwellingsStep(hoLine : HomeownersLine_HOE) {
     PCValidationContext.doPageLevelValidation(\ context -> {
      var lineValidation = new HomeownersLineValidation_HOE(context, hoLine)
      lineValidation.validatePolicyType()
      var dwellingValidation = new HODwellingValidation_HOE(context, hoLine.Dwelling)
      dwellingValidation.validateDwellingMainFields()
      dwellingValidation.validateDwellingProtectionFields()
    })
  }

  override function validateLineForAudit() {
  }

}
