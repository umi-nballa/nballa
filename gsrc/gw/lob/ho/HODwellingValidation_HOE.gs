package gw.lob.ho

uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext

class HODwellingValidation_HOE extends PCValidationBase {

  var _dwelling : Dwelling_HOE as HODwelling
  
  construct(valContext : PCValidationContext, dwelling : Dwelling_HOE) {
    super(valContext)
    _dwelling = dwelling
  }
  
  override function validateImpl() {
    Context.addToVisited(this, "validateImpl")
    if (Context.isAtLeast("quotable")) {
      validateRequiredFields()
    }
    
  }
  
  function validateRequiredFields() {
    Context.addToVisited(this, "validateRequiredFields")
    validateDwellingConstructionFields()
    validateDataForBatchLoadDataFields()
    dwellingStateMatchesInsuredState()
  }
  
  function dwellingStateMatchesInsuredState() {
    Context.addToVisited(this, "validateDwellingMainFields")
    if (_dwelling.HOLocation.PolicyLocation.State <> _dwelling.PolicyPeriod.PolicyAddress.State) {
      Result.addWarning(HODwelling,  "default", displaykey.Web.Policy.HomeownersLine.Validation.LocationState)
    }
  }

  function validateDwellingMainFields() {
    Context.addToVisited(this, "validateDwellingMainFields")
    if(HODwelling.HomePurchaseDate_Ext != null && (HODwelling.PolicyPeriod.PeriodStart.differenceInYears(HODwelling.HomePurchaseDate_Ext) < 5) ) {
      Result.addWarning(HODwelling,  "default", displaykey.Web.Policy.HomeownersLine.Validation.FiveYearsPriorResidenceRequired)
    }
    if (HODwelling.DwellingUsage == null) {
      addErrorOrWarning("DwellingUsage", displaykey.Web.Policy.HomeownersLine.Validation.DwellingUsageRequired, "HomeownersDwelling")
    }
    if (HODwelling.Occupancy == null) {
      addErrorOrWarning("Occupancy", displaykey.Web.Policy.HomeownersLine.Validation.DwellingOccupancyRequired, "HomeownersDwelling")
    }

  }
  
  function validateDwellingConstructionFields() {
    Context.addToVisited(this, "validateDwellingConstructionFields")
    if (HODwelling.YearBuilt == null and HODwelling.YearBuiltOverridden_Ext == null) {
        addErrorOrWarning("YearBuilt", displaykey.Web.Policy.HomeownersLine.Validation.YearBuilt, "HomeownersDwellingConstruction")
    }
    if ((HODwelling.ConstructionType == null and HODwelling.ConstTypeOverridden_Ext == null) and (//(HODwelling.ConstructionTypeL1_Ext == null and HODwelling.ConstTypeOverriddenL1_Ext == null) or
         (HODwelling.ConstructionTypeL2_Ext == null and HODwelling.ConstTypeOverriddenL2_Ext == null))) {
        addErrorOrWarning("ConstructionType", displaykey.Web.Policy.HomeownersLine.Validation.ConstructionTypeRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.StoriesNumber == null and HODwelling.NoofStoriesOverridden_Ext == null) {
        addErrorOrWarning("StoriesNumber", displaykey.Web.Policy.HomeownersLine.Validation.NumStoriesRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.RoofType == null and HODwelling.RoofingMaterialOverridden_Ext == null) {
        addErrorOrWarning("RoofType", displaykey.Web.Policy.HomeownersLine.Validation.RoofTypeRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.HOPolicyType == HOPolicyType_HOE.TC_HO3 or HODwelling.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
      validateHO3AndDP2DwellingConstructionFields()
    }
  }
  
  function validateHO3AndDP2DwellingConstructionFields() {
    if (HODwelling.WindClass == null and HODwelling.HOLine.BaseState == typekey.Jurisdiction.TC_HI) {
      addErrorOrWarning("WindClass", displaykey.Web.Policy.HomeownersLine.Validation.WindClassRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.ConstructionCode == null) {
      addErrorOrWarning("ConstructionCode", displaykey.Web.Policy.HomeownersLine.Validation.ConstructionCodeRequired, "HomeownersDwellingConstruction")
    }
  }
  
  private function addErrorOrWarning(fieldName: String, message: String, pageName: String){
    if (Context.isAtLeast("quotable")) {
      Result.addFieldError(HODwelling, fieldName, "quotable", message, pageName)
    }
    else {
      Result.addFieldWarning(HODwelling, fieldName, "default", message, pageName)
    }
  }

  private function addErrorOrWarning( message: String){
      Result.addWarning(HODwelling,  "default", message)

  }
  
  function validateDataForBatchLoadDataFields() {
    validateCommonFieldsForPolicyType()
    if (HODwelling.HOLine.HOPolicyType == HOPolicyType_HOE.TC_HO3 
        or HODwelling.HOLine.HOPolicyType == HOPolicyType_HOE.TC_DP2){
      validateFieldsForHO3DP2(HODwelling.HOLine.HOPolicyType)
    }
  }
  
  function validateFieldsForHO3DP2(policyType : HOPolicyType_HOE) {
    if (HODwelling.SwimmingPoolExists and HODwelling.SwimmingPoolDivingBoard == null)
      addErrorOrWarning("SwimmingPoolDivingBoard", displaykey.Web.Policy.HomeownersLine.Validation.DivingBoardExists, "HomeownersDwelling")
    if (HODwelling.SwimmingPoolExists and HODwelling.SwimmingPoolFencing == null)
      addErrorOrWarning("SwimmingPoolFencing", displaykey.Web.Policy.HomeownersLine.Validation.FencingExists, "HomeownersDwelling")
    if (HODwelling.KnownWaterLeakage and HODwelling.KnownWaterLeakageDescription.length == 0)
      addErrorOrWarning("KnownWaterLeakageDescription", displaykey.Web.Policy.HomeownersLine.Validation.WaterLeakageDesc, "HomeownersDwelling")
    if (HODwelling.HasOtherPlumbingType and HODwelling.PlumbingTypeDescription == null)
      addErrorOrWarning("PlumbingTypeDescription", displaykey.Web.Policy.HomeownersLine.Validation.PlumbingTypeDesc, "HomeownersDwellingConstruction")
    if (HODwelling.WiringType == WiringType_HOE.TC_OTHER and HODwelling.WiringTypeDescription == null)
      addErrorOrWarning("WiringTypeDescription", displaykey.Web.Policy.HomeownersLine.Validation.WiringTypeDesc, "HomeownersDwellingConstruction")
    if (HODwelling.ElectricalType == BreakerType_HOE.TC_OTHER and HODwelling.ElectricalTypeDescription == null)
      addErrorOrWarning("ElectricalTypeDescription", displaykey.Web.Policy.HomeownersLine.Validation.ElectricalTypeDesc, "HomeownersDwellingConstruction")
    if (HODwelling.WindClass == WindRating.TC_OTHER and HODwelling.WindClassDescription == null)
      addErrorOrWarning("WindClassDescription", displaykey.Web.Policy.HomeownersLine.Validation.WindClassDesc, "HomeownersDwellingConstruction")
    if (HODwelling.HeatingUpgrade == true and HODwelling.YearBuilt != null and HODwelling.HeatingUpgradeDate < HODwelling.YearBuilt)
      addErrorOrWarning("HeatingUpgradeDate", displaykey.Web.Homeowners.DwellingConstruction.HeatUpgradeYearErrorMsg, "HomeownersDwellingConstruction")
    if (HODwelling.PlumbingUpgrade == true and HODwelling.YearBuilt != null and HODwelling.PlumbingUpgradeDate < HODwelling.YearBuilt)
      addErrorOrWarning("PlumbingUpgradeDate", displaykey.Web.Homeowners.DwellingConstruction.PlumbingUpgradeYearErrorMsg, "HomeownersDwellingConstruction")
    if (HODwelling.RoofingUpgrade == true and HODwelling.YearBuilt != null and HODwelling.RoofingUpgradeDate < HODwelling.YearBuilt)
      addErrorOrWarning("RoofingUpgradeDate", displaykey.Web.Homeowners.DwellingConstruction.RoofingUpgradeYearErrorMsg, "HomeownersDwellingConstruction")
    if (HODwelling.ElectricalSystemUpgrade == true and HODwelling.YearBuilt != null and HODwelling.ElectricalSystemUpgradeDate < HODwelling.YearBuilt)
      addErrorOrWarning("ElectricalSystemUpgradeDate", displaykey.Web.Homeowners.DwellingConstruction.ElectricalUpgradeYearErrorMsg, "HomeownersDwellingConstruction")
  }
  
  function validateCommonFieldsForPolicyType() {
    // Validate common fields for all policy types in dwelling section
    if (HODwelling.RoomerBoarders == true and HODwelling.RoomerBoardersNumber == null)
      addErrorOrWarning("RoomerBoardersNumber", displaykey.Web.Policy.HomeownersLine.Validation.NumRoomersBoarders, "HomeownersDwelling")
    if (HODwelling.TrampolineExists == true and HODwelling.TrampolineSafetyNet == null)
      addErrorOrWarning("TrampolineSafetyNet", displaykey.Web.Policy.HomeownersLine.Validation.SafetyNetExists, "HomeownersDwelling")
    if (HODwelling.AnimalsInDwelling == true and HODwelling.DwellingAnimals.length == 0)
      addErrorOrWarning("DwellingAnimals", displaykey.Web.Policy.HomeownersLine.Validation.DwellingAnimals, "HomeownersDwelling")
    if (HODwelling.RoofType == RoofType.TC_OTHER and HODwelling.RoofTypeDescription == null)
      addErrorOrWarning("RoofTypeDescription", displaykey.Web.Policy.HomeownersLine.Validation.RoofTypeDesc, "HomeownersDwellingConstruction")
    
  }
  
  static function validateDwellingConstructionStep(dwelling : Dwelling_HOE) {
    PCValidationContext.doPageLevelValidation(\ context -> {
      var validation = new HODwellingValidation_HOE(context, dwelling)
      validation.validateDwellingConstructionFields()
    })
  }
 
}
