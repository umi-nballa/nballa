package gw.lob.ho.forms

uses gw.api.xml.XMLNode
uses gw.forms.FormData
uses gw.forms.FormInferenceContext
uses java.lang.String
uses java.util.Set

/**
 * Forms inference class for use by forms for specifying the logic for making forms avaliable based
 * on coverages
 */ 

class HOInferenceFormByCoverageHOE extends FormData {

  var _referenceDate : DateTime
  var _coverageExists  = false
  
  override function getLookupDate(context: FormInferenceContext, state : Jurisdiction) : DateTime {
    var formCode = this.Pattern.Code
    var policyType = context.Period.HomeownersLine_HOE.HOPolicyType.Code
    var dwelling = context.Period.HomeownersLine_HOE.Dwelling

    if (isHOPolicyType(policyType)) {
      if (formCode.equals("HODW_HO0690Form_HOE")) {
        // HO 06 90
        // Florida only
        if (dwelling.HODW_Earthquake_HOEExists) {
          _referenceDate = dwelling.HODW_Earthquake_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("HODW_HO0480_HOE")) {
        // HO 04 80
        if (dwelling.HODW_OtherStructuresOnPremise_HOEExists) {
          _referenceDate = dwelling.HODW_OtherStructuresOnPremise_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("HODW_HO0472_HOE")) {
        // HO 04 72
        if (policyType.equals("HO3")) {
          if (dwelling.HODW_FungiCov_HOEExists) {
            _referenceDate = dwelling.HODW_FungiCov_HOE.ReferenceDate
            _coverageExists = true
          }
        }
      } else if (formCode.equals("HODW_HO0464_HOE")) {
        // HO 04 64
        if (dwelling.HODW_InflationGaurd_HOEExists) {
          _referenceDate = dwelling.HODW_InflationGaurd_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("HODW_HO0445_HOE")) {
        // HO 04 45
        if (dwelling.HODW_Earthquake_HOEExists) {
          _referenceDate = dwelling.HODW_Earthquake_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("HODW_HO0416_HOE")) {
        // HO 04 16
        if (dwelling.HODW_ScheduledProperty_HOEExists) {
          _referenceDate = dwelling.HODW_ScheduledProperty_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("HODW_HO0366_HOE")) {
        // HO 03 66
        // Florida only
        if (dwelling.HODW_FungiCovFlorida_HOEExists) {
          _referenceDate = dwelling.HODW_FungiCovFlorida_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("HODW_HO0343_HOE")) {
        // HO 03 43
        // Florida only
        if (dwelling.HODW_FungiCovFlorida_HOEExists) {
          _referenceDate = dwelling.HODW_FungiCovFlorida_HOE.ReferenceDate
          _coverageExists = true
        }
      }
    } else { // DP policy type
      if (formCode.equals("DPDW_DP0690_HOE")) {
        // DP 06 90
        // Florida only
        if (dwelling.HODW_Earthquake_HOEExists) {
          _referenceDate = dwelling.HODW_Earthquake_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("DPDW_DP0472_HOE")) {
        // DP 04 72
        if (dwelling.HODW_FungiCov_HOEExists) {
          _referenceDate = dwelling.HODW_FungiCov_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("DPDW_DP0464_HOE")) {
        // DP 04 64
        if (dwelling.HODW_InflationGaurd_HOEExists) {
          _referenceDate = dwelling.HODW_InflationGaurd_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("DPDW_DP0445_HOE")) {
        // DP 04 45
        if (dwelling.HODW_Earthquake_HOEExists) {
          _referenceDate = dwelling.HODW_Earthquake_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("DPDW_DP0416_HOE")) {
        // DP 04 16
        if (dwelling.HODW_ScheduledProperty_HOEExists) {
          _referenceDate = dwelling.HODW_ScheduledProperty_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("DPDW_DP0387_HOE")) {
        // DP 03 87
        // Florida only
        if (dwelling.HODW_FungiCovFlorida_HOEExists) {
          _referenceDate = dwelling.HODW_FungiCovFlorida_HOE.ReferenceDate
          _coverageExists = true
        }
      } else if (formCode.equals("DPDW_DP0343_HOE")) {
        // DP 03 43
        // Florida only
        if (dwelling.HODW_FungiCovFlorida_HOEExists) {
          _referenceDate = dwelling.HODW_FungiCovFlorida_HOE.ReferenceDate
          _coverageExists = true
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
    return _coverageExists
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
