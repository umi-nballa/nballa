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

    if(HODwelling.HOUWQuestions.HOHomesharing_Ext)
    {
      // policyTypeValid = false
      addErrorOrWarning("Properties made available for home sharing, trading or exchange are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.unoccupied9)
    {
      // policyTypeValid = false
      addErrorOrWarning("Properties unoccupied for more than 9 consecutive months are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.propanegas==typekey.HOPropaneNaturalgas_Ext.TC_BELOWGROUND)
    {
      //policyTypeValid = false
      addErrorOrWarning("Properties with buried fuel tanks are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.typefuel==typekey.HOTypeFuel_Ext.TC_GASOLINEDIESEL)
    {
      // policyTypeValid = false
      addErrorOrWarning("Properties with gasoline or diesel fuel tanks are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.typefuel==typekey.HOTypeFuel_Ext.TC_OTHER)
    {
      // policyTypeValid = false
      addErrorOrWarning("Fuel type ‘Other’ requires Underwriting review and approval prior to binding")    //uwissue
    }

    if(HODwelling.HOUWQuestions.fuellocalcode==typekey.HOFuelTankLocalBC_Ext.TC_NO)
    {
      // policyTypeValid = false
      addErrorOrWarning("Properties with fuel tanks that do not meet local building codes are not eligible for coverage")
    }

    if((HODwelling.HOUWQuestions.tankcapacity==typekey.HOCapTankGal_Ext.TC_LT500  && HODwelling.HOUWQuestions.closestdisttank==typekey.HOCloseseDistTank_Ext.TC_LT15FT) ||
        (HODwelling.HOUWQuestions.tankcapacity==typekey.HOCapTankGal_Ext.TC_GTEQ500  && (HODwelling.HOUWQuestions.closestdisttank==typekey.HOCloseseDistTank_Ext.TC_LT15FT
            || HODwelling.HOUWQuestions.closestdisttank==typekey.HOCloseseDistTank_Ext.TC_15TO25)))
    {
      // policyTypeValid = false
      addErrorOrWarning("Property is not eligible for coverage due to capacity and location of fuel tank")
    }


    if(HODwelling.HOUWQuestions.primprot==typekey.HOPrimProtHotTub_Ext.TC_NONE || HODwelling.HOUWQuestions.primprot==typekey.HOPrimProtHotTub_Ext.TC_HOTTUBCOVER)
    {
      // policyTypeValid=false
      addErrorOrWarning("Properties without appropriate protection in place to prevent unauthorized access to the pool or hot tub are not eligible for coverage")
    }


    if(HODwelling.HOUWQuestions.swimdivboardslide)
    {
      // policyTypeValid = false
      addErrorOrWarning("Swimming pools with diving boards or slides are not eligible for coverage")
    }
    if(HODwelling.HOUWQuestions.floodcovnfip)
    {
      // policyTypeValid = false
      addErrorOrWarning("Properties located in a Special Flood Hazard Area are not eligible unless required flood coverage will be in place  within 30 days of effective date.")
    }



    if(HODwelling.HOUWQuestions.structincl)
    {
      // policyTypeValid = false
      addErrorOrWarning("Properties with any structures built partially or entirely over water are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.typebusiness==typekey.HOTypeofbusiness_Ext.TC_ADULTDAYCARE  || HODwelling.HOUWQuestions.typebusiness==typekey.HOTypeofbusiness_Ext.TC_ASSISTEDLIVING)
    {
      // policyTypeValid = false
      addErrorOrWarning("Properties with on premises adult daycare or assisted living activities are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.typebusiness==typekey.HOTypeofbusiness_Ext.TC_CHILDDAYCARE  && !HODwelling.HOLocation.PolicyLocation.State.Code=="FL")
    {
      //policyTypeValid = false
      addErrorOrWarning("Properties  with on premises daycare operations are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.daycare!=null && !HODwelling.HOUWQuestions.daycare )
    {
      // policyTypeValid = false
      addErrorOrWarning( "Properties with Family Daycare Homes that exceed the maximum number of children allowed in accordance with Florida Statute are not eligible for coverage")
    }



    if(HODwelling.HOUWQuestions.daycareregs!=null && !HODwelling.HOUWQuestions.daycareregs )   {
      //policyTypeValid = false
      addErrorOrWarning("Properties with Family Child Daycare operations that do not meet licensing/registration requirements are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.commercialliability )    {
      //policyTypeValid = false
      addErrorOrWarning("Properties with on premises Family Home Daycare operations require Underwriting approval prior to binding.   Proof of licensure/registration AND a copy of your current commerial daycare liability policy is required for Underwriting review")
    }

    if(HODwelling.HOUWQuestions.commercialliability!=null && !HODwelling.HOUWQuestions.commercialliability )      {
      // policyTypeValid = false
      addErrorOrWarning("Applicant is not eligible for coverage without a commercial insurance policy inforce for the Family Home Daycare operation")
    }

    if(!HODwelling.HOUWQuestions.businesspol &&  !HODwelling.HOLocation.PolicyLocation.State.Code=="TX" && HODwelling.HOUWQuestions.typebusiness==typekey.HOTypeofbusiness_Ext.TC_HOMEOFFICE)     {
      // policyTypeValid = false
      addErrorOrWarning("Applicant's home based business activities may qualify for “Permitted Incidental Occupancy– Residence Premises (HO 04 42)")
    }

    if(HODwelling.HOUWQuestions.moldd != null )    {
      // policyTypeValid = false
      addErrorOrWarning("Properties with on premises business exposure require Underwriting review and approval prior to binding")           //uwissue
    }

    if(HODwelling.HOUWQuestions.trampoline )     {
      // policyTypeValid = false
      addErrorOrWarning("Properties with trampolines, skateboard/bicycle/stunt ramps, rock climbing walls or other extreme sporting aparatus on the premises are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.farmanimals )    {
      // policyTypeValid = false
      addErrorOrWarning("Property is not eligbible for coverage due to animal exposure")
    }

    if(HODwelling.HOUWQuestions.mixbreedofdog )      {
      // policyTypeValid = false
      addErrorOrWarning("Property is not eligbible for coverage due to ineligible dog breed")
    }

    if(HODwelling.HOUWQuestions.tenmixbreed )    {
      // policyTypeValid = false
      addErrorOrWarning("Property is not eligbible for coverage due to ineligible dog breed")
    }

    if(HODwelling.HOUWQuestions.windowsquickrelease )   {
      // policyTypeValid = false
      addErrorOrWarning("Properties with bars on windows without a quick release mechanism are not eligible for coverage")
    }

    if((HODwelling.HOUWQuestions.moldrem!=null && !HODwelling.HOUWQuestions.moldrem) || (HODwelling.HOUWQuestions.moldremediated!=null && !HODwelling.HOUWQuestions.moldremediated ))   {
      // policyTypeValid = false
      addErrorOrWarning("Properties  with prior unremediated mold losses are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.moldrem || HODwelling.HOUWQuestions.moldremediated )    {
      //  policyTypeValid = false
      addErrorOrWarning("Properties  with prior mold damage require Underwriting review and approval prior to binding.   Please provide proof of mold remediation for Underwriting review") //uwissue
    }

    if(HODwelling.HOUWQuestions.assistedliving )     {
      // policyTypeValid = false
      addErrorOrWarning("Properties used as group homes or assisted living facilities are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_6  || HODwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_7
        || HODwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_8 || HODwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_9
        || HODwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_10 || HODwelling.HOUWQuestions.norental==typekey.HOTotalRentalCommon_Ext.TC_GT10)   {
      //  policyTypeValid = false
      addErrorOrWarning("Applicants owning more than 5 rental units are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.exclusiveresi!=null && !HODwelling.HOUWQuestions.exclusiveresi )     {
      // policyTypeValid = false
      addErrorOrWarning("Properties that are not used used exclusively for residential purposes  other than eligible incidental office exposures are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.recpubutil !=null && !HODwelling.HOUWQuestions.recpubutil )   {
      //  policyTypeValid = false
      addErrorOrWarning("Property without public utility services is not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.hilslide )     {
      //policyTypeValid = false
      addErrorOrWarning("Dwellings built on a hillside or directly next to a 30-degree or greater slope are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.loc1000 )    {
      //policyTypeValid = false
      addErrorOrWarning("Property located within 1,000 ft of saltwate are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.atvs || HODwelling.HOUWQuestions.atvallow )     {
      // policyTypeValid = false
      addErrorOrWarning("ATVs are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.underconstr )     {
      // policyTypeValid = false
      addErrorOrWarning("Properties that are vacant or not occupied within 30 days of purchase are not eligible for coverage")
    }

    if(HODwelling.HOUWQuestions.forsale )     {
      // policyTypeValid = false
      addErrorOrWarning("Properties that are for sale or undergoing renovation are not eligible for coverage")
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
    if (HODwelling.YearBuilt == null and HODwelling.YearBuiltOverridden_Ext == null) {
        addErrorOrWarning("YearBuilt", displaykey.Web.Policy.HomeownersLine.Validation.YearBuilt, "HomeownersDwellingConstruction")
    }
    if ((HODwelling.ConstructionType == null and HODwelling.ConstTypeOverridden_Ext == null) and ((HODwelling.ConstructionTypeL1_Ext == null and HODwelling.ConstTypeOverriddenL1_Ext == null)
         or (HODwelling.ConstructionTypeL2_Ext == null and HODwelling.ConstTypeOverriddenL2_Ext == null))) {
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
    if (HODwelling.Foundation == null){
      addErrorOrWarning("Foundation", displaykey.Web.Policy.HomeownersLine.Validation.FoundationTypeRequired, "HomeownersDwellingConstruction")
    }
    /*if (HODwelling.PrimaryHeating == null) {
      addErrorOrWarning("PrimaryHeating", displaykey.Web.Policy.HomeownersLine.Validation.PrimaryHeatingRequired, "HomeownersDwellingConstruction")
    }*/
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
    /*if (HODwelling.PrimaryHeating == HeatingType_HOE.TC_OTHER and HODwelling.PrimaryHeatingDescription == null)
      addErrorOrWarning("PrimaryHeatingDescription", displaykey.Web.Policy.HomeownersLine.Validation.PrimaryHeatingDesc, "HomeownersDwellingConstruction")
    if (HODwelling.PrimaryHeating == HeatingType_HOE.TC_HEATINGOIL and HODwelling.PrimaryHeatingFuelLineLocation == null)
      addErrorOrWarning("PrimaryHeatingFuelLineLocation", displaykey.Web.Policy.HomeownersLine.Validation.FuelLineLocation, "HomeownersDwellingConstruction")
    if (HODwelling.PrimaryHeating == HeatingType_HOE.TC_HEATINGOIL and HODwelling.PrimaryHeatingFuelTankLocation == null)
      addErrorOrWarning("PrimaryHeatingFuelTankLocation", displaykey.Web.Policy.HomeownersLine.Validation.FuelTankLocation, "HomeownersDwellingConstruction")*/
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
