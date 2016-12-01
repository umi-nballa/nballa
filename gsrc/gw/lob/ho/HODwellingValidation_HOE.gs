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
    validateDwellingMainFields()
    validateDwellingProtectionFields()
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
    /*if (HODwelling.ResidenceType == null) {
      addErrorOrWarning("ResidenceType", displaykey.Web.Policy.HomeownersLine.Validation.ResidenceTypeRequired, "HomeownersDwelling")
    }*/
    if (HODwelling.DwellingUsage == null) {
      addErrorOrWarning("DwellingUsage", displaykey.Web.Policy.HomeownersLine.Validation.DwellingUsageRequired, "HomeownersDwelling")
    }
    if (HODwelling.Occupancy == null) {
      addErrorOrWarning("Occupancy", displaykey.Web.Policy.HomeownersLine.Validation.DwellingOccupancyRequired, "HomeownersDwelling")
    }
  }

  function validateDwellingProtectionFields() {
    Context.addToVisited(this, "validateDwellingProtectionFields")
    /*if (HODwelling.DwellingLocation == null) {
      addErrorOrWarning("DwellingLocation", displaykey.Web.Policy.HomeownersLine.Validation.DwellingLocationType, "HomeownersDwelling")
    }
    if (HODwelling.DwellingProtectionDetails.FireExtinguishers == null) {
      addErrorOrWarning("FireExtinguishers", displaykey.Web.Policy.HomeownersLine.Validation.FireExtinguishers, "HomeownersDwelling")
    }
    if (HODwelling.DwellingProtectionDetails.BurglarAlarm == null) {
      addErrorOrWarning("BurglarAlarm", displaykey.Web.Policy.HomeownersLine.Validation.BurglarAlarm, "HomeownersDwelling")
    }
    if (HODwelling.DwellingProtectionDetails.FireAlarm == null) {
      addErrorOrWarning("FireAlarm", displaykey.Web.Policy.HomeownersLine.Validation.FireAlarm, "HomeownersDwelling")
    }
    if (HODwelling.DwellingProtectionDetails.SmokeAlarm == null) {
      addErrorOrWarning("SmokeAlarm", displaykey.Web.Policy.HomeownersLine.Validation.SmokeAlarm, "HomeownersDwelling")
    }
    if (HODwelling.DwellingProtectionDetails.SprinklerSystemType == null) {
      addErrorOrWarning("SprinklerSystemType", displaykey.Web.Policy.HomeownersLine.Validation.SprinklerSystemType, "HomeownersDwelling")
    }
    if (HODwelling.DwellingProtectionDetails.Deadbolts == null) {
      addErrorOrWarning("Deadbolts", displaykey.Web.Policy.HomeownersLine.Validation.Deadbolt, "HomeownersDwelling")
    }
    if (HODwelling.DwellingProtectionDetails.VisibleToNeighbors == null) {
      addErrorOrWarning("VisibleToNeighbors", displaykey.Web.Policy.HomeownersLine.Validation.VisiblToNeighbors, "HomeownersDwelling")
    }*/
    // check garage type only for applicable policy types
    if ((HODwelling.HOLine.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 or
         HODwelling.HOLine.HOPolicyType == typekey.HOPolicyType_HOE.TC_DP2)
        and HODwelling.Garage == null
    ) {
      addErrorOrWarning("Garage", displaykey.Web.Policy.HomeownersLine.Validation.GarageType, "HomeownersDwelling")
    }
  }
  
  function validateDwellingConstructionFields() {
    Context.addToVisited(this, "validateDwellingConstructionFields")
    if (HODwelling.YearBuilt == null) {
      addErrorOrWarning("YearBuilt", displaykey.Web.Policy.HomeownersLine.Validation.YearBuilt, "HomeownersDwellingConstruction")
    }
    if (HODwelling.ConstructionType == null) {
      addErrorOrWarning("ConstructionType", displaykey.Web.Policy.HomeownersLine.Validation.ConstructionTypeRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.StoriesNumber == null) {
      addErrorOrWarning("StoriesNumber", displaykey.Web.Policy.HomeownersLine.Validation.NumStoriesRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.RoofType == null) {
      addErrorOrWarning("RoofType", displaykey.Web.Policy.HomeownersLine.Validation.RoofTypeRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.HOPolicyType == HOPolicyType_HOE.TC_HO3 or HODwelling.HOPolicyType == HOPolicyType_HOE.TC_DP2) {
      validateHO3AndDP2DwellingConstructionFields()
    }
  }
  
  function validateHO3AndDP2DwellingConstructionFields() {
    if (HODwelling.Foundation == null){
      addErrorOrWarning("Foundation", displaykey.Web.Policy.HomeownersLine.Validation.FoundationTypeRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.PrimaryHeating == null) {
      addErrorOrWarning("PrimaryHeating", displaykey.Web.Policy.HomeownersLine.Validation.PrimaryHeatingRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.PlumbingType == null) {
      addErrorOrWarning("PlumbingType", displaykey.Web.Policy.HomeownersLine.Validation.PlumbingTypeRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.WiringType == null) {
      addErrorOrWarning("WiringType", displaykey.Web.Policy.HomeownersLine.Validation.WiringTypeRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.ElectricalType == null) {
      addErrorOrWarning("ElectricalType", displaykey.Web.Policy.HomeownersLine.Validation.ElectricalTypeRequired, "HomeownersDwellingConstruction")
    }
    if (HODwelling.WindClass == null) {
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
    if (HODwelling.PrimaryHeating == HeatingType_HOE.TC_OTHER and HODwelling.PrimaryHeatingDescription == null)
      addErrorOrWarning("PrimaryHeatingDescription", displaykey.Web.Policy.HomeownersLine.Validation.PrimaryHeatingDesc, "HomeownersDwellingConstruction")
    if (HODwelling.PrimaryHeating == HeatingType_HOE.TC_HEATINGOIL and HODwelling.PrimaryHeatingFuelLineLocation == null)
      addErrorOrWarning("PrimaryHeatingFuelLineLocation", displaykey.Web.Policy.HomeownersLine.Validation.FuelLineLocation, "HomeownersDwellingConstruction")
    if (HODwelling.PrimaryHeating == HeatingType_HOE.TC_HEATINGOIL and HODwelling.PrimaryHeatingFuelTankLocation == null)
      addErrorOrWarning("PrimaryHeatingFuelTankLocation", displaykey.Web.Policy.HomeownersLine.Validation.FuelTankLocation, "HomeownersDwellingConstruction")
    if (HODwelling.PlumbingType == PlumbingType_HOE.TC_OTHER and HODwelling.PlumbingTypeDescription == null)
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
    // Validate common fields for policy types in Dwelling Protection
    /*if (HODwelling.DwellingProtectionDetails.BurglarAlarm == true and HODwelling.DwellingProtectionDetails.BurglarAlarmType == null)
      addErrorOrWarning("BurglarAlarmType", displaykey.Web.Policy.HomeownersLine.Validation.BurglarAlarmType, "HomeownersDwelling")*/
    if (HODwelling.DwellingProtectionDetails.SmokeAlarm == true and HODwelling.DwellingProtectionDetails.SmokeAlarmOnAllFloors == null)
      addErrorOrWarning("SmokeAlarmOnAllFloors", displaykey.Web.Policy.HomeownersLine.Validation.SmokeAlarmOnAllFloors, "HomeownersDwelling")
    /*if (HODwelling.DwellingProtectionDetails.Deadbolts == true and HODwelling.DwellingProtectionDetails.DeadboltsNumber == null)
      addErrorOrWarning("DeadboltsNumber", displaykey.Web.Policy.HomeownersLine.Validation.NumDeadBolts, "HomeownersDwelling")*/
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
