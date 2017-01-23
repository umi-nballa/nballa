package gw.lob.ho.forms

uses gw.api.xml.XMLNode
uses gw.forms.FormData
uses gw.forms.FormInferenceContext
uses java.lang.String
uses java.math.BigDecimal
uses java.util.Set

/**
 * Forms inference class for use by forms for specifying the logic for making forms avaliable based
 * on cov terms (on coverages)
 */ 
 
class HOInferenceFormByCoverageCovTermHOE extends FormData {
  var _referenceDate : DateTime
  var _covTermCheckSatisfied  = false
  
  override function getLookupDate(context: FormInferenceContext, state : Jurisdiction) : DateTime {
    var formCode = this.Pattern.Code
    var policyType = context.Period.HomeownersLine_HOE.HOPolicyType.Code
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling
    
    if (isHOPolicyType(policyType)) {
       if (formCode.equals("HODW_HO0498_HOE")) {
        // HO 04 98
        // Florida only
        if (dwelling.HODW_SectionI_Ded_HOEExists) {            
          _referenceDate = dwelling.HODW_SectionI_Ded_HOE.ReferenceDate
          if (policyType.equals("HO3")) {
            var covTerm = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm
            if (covTerm <> null and covTerm.OptionValue.OptionCode == "0") {
              _covTermCheckSatisfied = true
            }
          }
        }      
      }  else if (formCode.equals("HODW_HO0390_HOE")) {
        // HO 03 90
        // Alabama only
        if (dwelling.HODW_SectionI_Ded_HOEExists) {
          _referenceDate = dwelling.HODW_SectionI_Ded_HOE.ReferenceDate
          if (policyType.equals("HO3")) {
            var covTerm = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm
            if (covTerm <> null and covTerm.OptionValue.OptionCode == "0") {
              _covTermCheckSatisfied = true
            }
          }
        }
      } else if (formCode.equals("HODW_HO0321_HOE")) {
        // HO 03 21
        if (dwelling.HODW_SectionI_Ded_HOEExists) {
          _referenceDate = dwelling.HODW_SectionI_Ded_HOE.ReferenceDate
          if (policyType.equals("HO3")) {
            var covTerm = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm
            if (covTerm <> null and covTerm.OptionValue.OptionCode <> "0") {
              _covTermCheckSatisfied = true
            }
          }
        }
      } else if (formCode.equals("HODW_HO0311_HOE")) {
        // HO 03 11
        // Florida only
        if (dwelling.HODW_SectionI_Ded_HOEExists) {
          _referenceDate = dwelling.HODW_SectionI_Ded_HOE.ReferenceDate
          if (policyType.equals("HO3")) {
            var covTerm = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm
            if (covTerm <> null and covTerm.OptionValue.OptionCode <> "0") {
              _covTermCheckSatisfied = true
            }
          }
        }
      } else if (formCode.equals("HODW_HO0310_HOE")) {    
        // HO 03 10
        // Alabama only
        if (dwelling.HODW_SectionI_Ded_HOEExists) {
          _referenceDate = dwelling.HODW_SectionI_Ded_HOE.ReferenceDate
          if (policyType.equals("HO3")) {
            var covTerm = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm
            if (covTerm <> null and covTerm.OptionValue.OptionCode <> "0") {
              _covTermCheckSatisfied = true
            }
          }
        }
      }
    } else { // DP policy type
      if (formCode.equals("DPDW_DP0498_HOE")) {
        // DP 04 98
        // Florida only
        if (dwelling.HODW_SectionI_Ded_HOEExists) {
          _referenceDate = dwelling.HODW_SectionI_Ded_HOE.ReferenceDate
          if (policyType.equals("DP2")) {
            var covTerm = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm
            if (covTerm <> null and covTerm.OptionValue.OptionCode == "0") {
              _covTermCheckSatisfied = true
            }
          }
        }      
      } else if (formCode.equals("DPDW_DP0390_HOE")) {
        // DP 03 90
        // Alabama only
        if (dwelling.HODW_SectionI_Ded_HOEExists) {
          _referenceDate = dwelling.HODW_SectionI_Ded_HOE.ReferenceDate
          if (policyType.equals("DP2")) {
            var covTerm = dwelling.HODW_SectionI_Ded_HOE.HODW_WindHail_Ded_HOETerm
            if (covTerm <> null and covTerm.OptionValue.OptionCode == "0") {
              _covTermCheckSatisfied = true
            }
          }
        }      
      }
    }
    
    // default the reference date if one of the necessary exclusions or conditions
    // was not found above
    if (_referenceDate == null) {
      _referenceDate = super.getLookupDate(context, state)
    } 
    
    return _referenceDate
  }

  override function populateInferenceData(context: FormInferenceContext, specialCaseStates: Set<Jurisdiction>) : void {
    // nothing to do here since the necessary work has already been done by getLookupDate()
  }
  
  override property get InferredByCurrentData() : boolean {
    return _covTermCheckSatisfied
  }
  
  override function addDataForComparisonOrExport(contentNode: XMLNode) : void {
    // Not used for demo. The form pattern is defined as one time.
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
