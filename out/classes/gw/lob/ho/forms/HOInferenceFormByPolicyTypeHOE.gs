package gw.lob.ho.forms

uses java.lang.String

uses java.util.Set
uses gw.forms.FormInferenceContext
uses gw.forms.generic.AbstractSimpleAvailabilityForm

/**
 * Forms inference class for use by forms for specifying the logic for making forms avaliable based
 * on policy type
 */ 
class HOInferenceFormByPolicyTypeHOE extends AbstractSimpleAvailabilityForm {
  override function isAvailable(context : FormInferenceContext, availableStates : Set<Jurisdiction>) : boolean {
    
    var formCode = this.Pattern.Code
    var policyType = context.Period.HomeownersLine_HOE.HOPolicyType.Code
    
    if (isHOPolicyType(policyType)) {
      if (formCode.equals("HODW_HO3Form_HOE")) {
        // HO 00 03
        if (policyType.equals("HO3")) {
          return true
        }
      } else if (formCode.equals("HODW_HOForm_HOE")) {
        // HO 00 04
        if (policyType.equals("HO4")) {
          return true
        }
      } else if (formCode.equals("HODW_HO6Form_HOE")) {
        // HO 00 06
        if (policyType.equals("HO6")) {
          return true
        }
      } else if (formCode.equals("HODW_HO0172_HOE")) {
        // HO 01 72
        // Nevada
        return true
      } else if (formCode.equals("HODW_HO0109_HOE")) {
        // HO 01 09
        // Florida only
        return true
      } else if (formCode.equals("HODW_HO0106_HOE")) {
        // HO 01 06
        // Alabama only
        return true
      }
    } else { // DP policy type
      if (formCode.equals("HODP_DPForm_HOE")) {
        // DP 00 02
        if (policyType.equals("DP2")) {
          return true
        }
      } else if (formCode.equals("DPDW_DP0172_HOE")) {
        // DP 01 72
        // Nevada
        return true
      } else if (formCode.equals("DPDW_DP0109_HOE")) {                  
        // DP 01 09
        // Florida only
        return true
      } else if (formCode.equals("DPDW_DP0106_HOE")) {
        // DP 01 06
        // Alabama only
        return true
      }
    }
    
    return false
  }

  // additional policy types should be added here if more HO types created
  private function isHOPolicyType(policyType : String) : boolean {    
    if ((policyType == "HO3") or (policyType == "HO4") or (policyType == "HO6")) {
      return true
    } else {
      return false
    }
  }
}
