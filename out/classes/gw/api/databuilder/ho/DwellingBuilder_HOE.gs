package gw.api.databuilder.ho

uses gw.api.builder.CoverageBuilder
uses gw.api.databuilder.BuilderContext
uses gw.api.databuilder.DataBuilder
uses java.util.Date

class DwellingBuilder_HOE extends DataBuilder<Dwelling_HOE, DwellingBuilder_HOE> {

  construct() {
    super(Dwelling_HOE)  
  }

  final function withHO3Defaults() :  DwellingBuilder_HOE {
    var dwelling = this
      .withHO3Details()
      .withDefaultProtectionDetails()
      .withHO3DP2Construction()
    return dwelling
  }
  
  final function withHO4Defaults() :  DwellingBuilder_HOE {
    var dwelling = this
      .withHO4Details()
      .withDefaultProtectionDetails()
      .withHO4Construction()
    return dwelling
  }
  
  final function withHO6Defaults() :  DwellingBuilder_HOE {
    var dwelling = this
      .withHO6Details()
      .withDefaultProtectionDetails()
      .withHO6Construction()
    return dwelling
  }
  
  final function withDP2Defaults() :  DwellingBuilder_HOE {
    var dwelling = this
      .withDP2Details()
      .withDefaultProtectionDetails()
      .withHO3DP2Construction()
    return dwelling
  }
 
  final function withHO3Details() :  DwellingBuilder_HOE {
    var dwelling = this
      .withPolicyType("HO3")
      .withYearPurchased(1990)
      .withReplacementCost(300000)
      .withResidenceType("Fam1")
      .withDwellingOccupancy("owner")
      .withDwellingUsage("prim")
      .withRoomerBoarders(false)
      .withNumUnits("One")
      .withFireplaceWoodStoveExists(true)
      .withNumFirePlaces(2)
      .withSwimmingPoolJacuzziExists(true)
      .withFencingExists(true)
      .withDivingBoardExists(false)
      .withTrampolineExists(true)
      .withSafetyNetExists(false)
      .withKnownWaterLeakage(false)
      .withAnimalsInDwelling(false)
    return dwelling
  }
  
  final function withHO4Details() :  DwellingBuilder_HOE {
     var dwelling = this
      .withPolicyType("HO4")
      .withResidenceType("Apt")
      .withDwellingOccupancy("nonown")
      .withDwellingUsage("prim")
      .withRoomerBoarders(true)
      .withNumRoomerBoarders(1)
      .withNumUnits("FiveToFifteen")
      .withTrampolineExists(true)
      .withSafetyNetExists(true)
    return dwelling
  }
  
  final function withHO6Details() :  DwellingBuilder_HOE {
     var dwelling = this
      .withPolicyType("HO6")
      .withResidenceType("Condo")
      .withDwellingOccupancy("owner")
      .withDwellingUsage("prim")
      .withRoomerBoarders(true)
      .withNumRoomerBoarders(1)
      .withFireplaceWoodStoveExists(true)
      .withNumUnits("SixteeenToTwentyFive")
      .withNumFirePlaces(1)
      .withTrampolineExists(true)
      .withSafetyNetExists(true)
      .withAnimalsInDwelling(false)
    return dwelling
  }
  
  final function withDP2Details() :  DwellingBuilder_HOE {
    var dwelling = this
      .withPolicyType("DP2")
      .withYearPurchased(1990)
      .withReplacementCost(300000)
      .withResidenceType("Fam1")
      .withDwellingOccupancy("inconst")
      .withApprovedBuilder(true)
      .withProjectedOccupancyDate("2009-10-26" as java.util.Date)
      .withDwellingUsage("seas")
      .withRoomerBoarders(false)
      .withNumUnits("Two")
      .withFireplaceWoodStoveExists(true)
      .withNumFirePlaces(2)
      .withSwimmingPoolJacuzziExists(true)
      .withFencingExists(true)
      .withDivingBoardExists(false)
      .withTrampolineExists(true)
      .withSafetyNetExists(false)
      .withKnownWaterLeakage(false)
      .withAnimalsInDwelling(false)
    return dwelling
  }
  
  final function withDefaultProtectionDetails(): DwellingBuilder_HOE {
    var dwelling = this
      .withDwellingLocationType("city")
      .withFireExtinguishers(true)
      .withBurglarAlarm(true)
      .withBurglarAlarmType("police")
      .withFireAlarm(false)
      .withSmokeAlarm(true)
      .withSmokeAlarmOnAllFloors(true)
      .withSprinklerSystemType("partial")
      .withDeadbolt(true)
      .withNumDeadBolts(2)
      .withVisibleToNeighbors(true)
    return dwelling
  }
  
  final function withHO4Construction(): DwellingBuilder_HOE {
    var dwelling = this
      .withYearBuilt(1970)
      .withConstructionType("C")
      .withNumStories("3")
      .withRoofType("fiberCement")
      .withConstructionCode("600")
    return dwelling
  }
  
  final function withHO6Construction(): DwellingBuilder_HOE {
    var dwelling = this
      .withYearBuilt(1970)
      .withConstructionType("C")
      .withNumStories("3")
      .withApproxSqFoot(3000)
      .withRoofType("fiberCement")
      .withSecondaryHeatingExists(true)
      .withConstructionCode("600")
    return dwelling
  }
  
  final function withHO3DP2Construction(): DwellingBuilder_HOE {
    var dwelling = this
      .withYearBuilt(1970)
      .withConstructionType("C")
      .withNumStories("3")
      .withApproxSqFoot(3000)
      .withGarage("Attached-2")
      .withGarageArea(300)
      .withCoveredPorch(true)
      .withCoveredPorchArea(100)
      .withFoundationType("FullBasement")
      .withFinishedBasementArea(600)
      .withUnfinishedBasementArea(400)
      .withRoofType("fiberCement")
      .withPrimaryHeating("HeatingOil")
      .withFuelLineLocation("under")
      .withFuelTankLocation("OBG")
      .withSecondaryHeatingExists(true)
      .withPlumbingType("galv")
      .withWiringType("copper")
      .withElectricalType("CircuitBreaker")
      .withAmperage(1000)
      .withWindClass("resistive")
      .withConstructionCode("600")
      .withHeatingUpgraded(true)
      .withPlumbingUpgraded(true)
      .withElectricalSystemUpgraded(true)
      .withRoofingUpgraded(true)
    return dwelling
  }
  
  final function withHomeownerLine(line : HomeownersLine_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("HOLine"), line)
    return this
  }

  final function withPolicyType(type: HOPolicyType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("HOPolicyType"), type)
    return this
  }
  
// Dwelling Details
  final function withYearPurchased(yearPurchased : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("YearPurchased"), yearPurchased)
    return this
  }
  
  final function withReplacementCost(replacementCost : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ReplacementCost"), replacementCost)
    return this
  }
  
  final function withResidenceType(residence : ResidenceType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ResidenceType"), residence)
    return this
  }

  final function withDwellingUsage(usage : DwellingUsage_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("DwellingUsage"), usage)
    return this
  }

  final function withDwellingOccupancy(occupancy : DwellingOccupancyType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("Occupancy"), occupancy)
    return this
  }

  final function withCoverageInEffect(coverageInEffect : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("DwellingUsagePrimaryCoverage"), coverageInEffect)
    return this
  }

  final function withDwellingVacant(vacant : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("OccupancyVacant"), vacant)
    return this
  }

  final function withApprovedBuilder(approvedBuilder : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("OccupancyApprovedBuilder"), approvedBuilder)
    return this
  }
  
  final function withProjectedOccupancyDate(projectedOccupancyDate : Date) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("OccupancyProjectedDate"), projectedOccupancyDate)
    return this
  }

  final function withRoomerBoarders(roomerBoarders : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("RoomerBoarders"), roomerBoarders)
    return this
  }
  
  final function withNumRoomerBoarders(numRoomerBoarders : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("RoomerBoardersNumber"), numRoomerBoarders)
    return this
  }
  
  final function withNumUnits(numUnits : NumUnits_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("UnitsNumber"), numUnits)
    return this
  }
  
  final function withFireplaceWoodStoveExists(fireplaceWoodStoveExists : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("FireplaceOrWoodStoveExists"), fireplaceWoodStoveExists)
    return this
  }
  
  final function withNumFirePlaces(numFirePlaces : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("FireplaceOrWoodStovesNumber"), numFirePlaces)
    return this
  }
  
  final function withSwimmingPoolJacuzziExists(swimmingPoolJacuzziExists : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SwimmingPoolExists"), swimmingPoolJacuzziExists)
    return this
  }

  final function withFencingExists(fencingExists : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SwimmingPoolFencing"), fencingExists)
    return this
  }
  final function withNullFencing() : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SwimmingPoolFencing"), null)
    return this
  }
  
  final function withDivingBoardExists(divingBoardExists : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SwimmingPoolDivingBoard"), divingBoardExists)
    return this
  }
  final function withNullDivingBoard() : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SwimmingPoolDivingBoard"), null)
    return this
  }
  
  final function withTrampolineExists(trampolineExists : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("TrampolineExists"), trampolineExists)
    return this
  }
  
  final function withSafetyNetExists(safetyNetExists : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("TrampolineSafetyNet"), safetyNetExists)
    return this
  }
  final function withNullSafetyNet() : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("TrampolineSafetyNet"), null)
    return this
  }

  final function withKnownWaterLeakage(knownWaterLeakage : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("KnownWaterLeakage"), knownWaterLeakage)
    return this
  }
  
  final function withWaterLeakageDesc(waterLeakageDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("KnownWaterLeakageDescription"), waterLeakageDesc)
    return this
  }
  
  final function withAnimalsInDwelling(animalsInDwelling : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("AnimalsInDwelling"), animalsInDwelling)
    return this
  }

// Protection Information
  final function withDwellingLocationType(location : DwellingLocationType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("DwellingLocation"), location)
    return this
  }

  final function withDwellingLocationDesc(DwellingLocationDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("DwellingLocationDescription"), DwellingLocationDesc)
    return this
  }

  final function withFireExtinguishers(extinguishers : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("FireExtinguishers"), extinguishers)
    return this
  }

  final function withBurglarAlarm(burglarAlarm : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("BurglarAlarm"), burglarAlarm)
    return this
  }

  final function withBurglarAlarmType(burglarAlarmType : BurglarAlarmType_HOE ) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("BurglarAlarmType"), burglarAlarmType)
    return this
  }

  final function withFireAlarm(fireAlarm : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("FireAlarm"), fireAlarm)
    return this
  }

  final function withSmokeAlarm(smokeAlarm : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SmokeAlarm"), smokeAlarm)
    return this
  }

  final function withSmokeAlarmOnAllFloors(smokeAlarmOnAllFloors : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SmokeAlarmOnAllFloors"), smokeAlarmOnAllFloors)
    return this
  }

  final function withSprinklerSystemType(sprinklerSystemType : SprinklerSystemType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SprinklerSystemType"), sprinklerSystemType)
    return this
  }

  final function withDeadbolt(deadbolt : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("Deadbolts"), deadbolt)
    return this
  }
  
  final function withNumDeadBolts(numDeadBolts : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("DeadBoltsNumber"), numDeadBolts)
    return this
  }

  final function withVisibleToNeighbors(visibleToNeighbors : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("VisibleToNeighbors"), visibleToNeighbors)
    return this
  }

// Construction Details
  final function withYearBuilt(yearBuilt : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("YearBuilt"), yearBuilt)
    return this
  }

  final function withConstructionType(constructionType : ConstructionType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ConstructionType"), constructionType)
    return this
  }
  
  final function withConstructionTypeDesc(constructionTypeDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ConstructionTypeDescription"), constructionTypeDesc)
    return this
  }

  final function withNumStories(numStories : NumberOfStories_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("StoriesNumber"), numStories)
    return this
  }
  
  final function withApproxSqFoot(sqFoot :int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ApproxSquareFootage"), sqFoot)
    return this
  }
  
  final function withGarage(garageType :GarageType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("Garage"), garageType)
    return this
  }

  final function withGarageArea(garageArea :int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("GarageArea"), garageArea)
    return this
  }
  
  final function withCoveredPorch(coveredPorch :boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("CoveredPorch"), coveredPorch)
    return this
  }
  
  final function withCoveredPorchArea(coveredPorchArea :int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("CoveredPorchArea"), coveredPorchArea)
    return this
  }

  final function withFoundationType(foundationType : FoundationType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("Foundation"), foundationType)
    return this
  }
  
  final function withFinishedBasementArea(finishedBasementArea : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("BasementFinishedArea"), finishedBasementArea)
    return this
  }
  
  final function withUnfinishedBasementArea(unfinishedBasementArea : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("BasementUnfinishedArea"), unfinishedBasementArea)
    return this
  }

  final function withRoofType(roofType : RoofType) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("RoofType"), roofType)
    return this
  }
  
  final function withRoofTypeDesc(roofTypeDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("RoofTypeDesc"), roofTypeDesc)
    return this
  }

  final function withPrimaryHeating(primaryHeating : HeatingType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("PrimaryHeating"), primaryHeating)
    return this
  }
  
  final function withFuelTankLocation(fuelTankLocation : FuelTankLocationType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("PrimaryHeatingFuelTankLocation"), fuelTankLocation)
    return this
  }
  
  final function withFuelLineLocation(fuelLineLocation : FuelLineLocationType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("PrimaryHeatingFuelLineLocation"), fuelLineLocation)
    return this
  }
  
  final function withPrimaryHeatingDesc(primaryHeatingDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("PrimaryHeatingDescription"), primaryHeatingDesc)
    return this
  }

  final function withSecondaryHeatingExists(secondaryHeatingExists : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("SecondaryHeatingExists"), secondaryHeatingExists)
    return this
  }

  final function withPlumbingType(plumbingType : PlumbingType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("PlumbingType"), plumbingType)
    return this
  }

 final function withPlumbingTypeDesc(plumbingTypeDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("PlumbingTypeDescription"), plumbingTypeDesc)
    return this
  }

  final function withWiringType(wiringType : WiringType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("WiringType"), wiringType)
    return this
  }
  
  final function withWiringTypeDesc(wiringTypeDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("WiringTypeDescription"), wiringTypeDesc)
    return this
  }

  final function withElectricalType(electricalType : BreakerType_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ElectricalType"), electricalType)
    return this
  }
  
  final function withElectricalTypeDesc(electricalTypeDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ElectricalTypeDescription"), electricalTypeDesc)
    return this
  }
  
  final function withAmperage(amperage : int) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("Amperage"), amperage)
    return this
  }

  final function withWindClass(windClass : WindRating) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("WindClass"), windClass)
    return this
  }

  final function withWindClassDesc(windClassDesc : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("WindClassDescription"), windClassDesc)
    return this
  }

  final function withConstructionCode(constructionCode : String) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ConstructionCode"), constructionCode)
    return this
  }
  
  final function withHeatingUpgraded(heatingUpgraded : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("HeatingUpgrade"), heatingUpgraded)
    return this
  }
  
  final function withHeatingUpgradedDate(heatingUpgradedDate : Date) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("HeatingUpgradedDate"), heatingUpgradedDate)
    return this
  }
  
  final function withPlumbingUpgraded(plumbingUpgraded : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("PlumbingUpgrade"), plumbingUpgraded)
    return this
  }
  
   final function withPlumbingUpgradedDate(plumbingUpgradedDate : Date) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("PlumbingUpgradedDate"), plumbingUpgradedDate)
    return this
  }
  
  final function withElectricalSystemUpgraded(electricalSystemUpgraded : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ElectricalSystemUpgrade"), electricalSystemUpgraded)
    return this
  }
  
  final function withElectricalSystemUpgradedDate(electricalSystemUpgradedDate : Date) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("ElectricalSystemUpgradedDate"), electricalSystemUpgradedDate)
    return this
  }
  
  final function withRoofingUpgraded(roofingUpgraded : boolean) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("RoofingUpgrade"), roofingUpgraded)
    return this
  }
  
  final function withRoofingUpgradedDate(roofingUpgradedDate : Date) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("RoofingUpgradedDate"), roofingUpgradedDate)
    return this
  }
  
 // Other attributes
  function withCoverage(coverageBuilder : CoverageBuilder) : DwellingBuilder_HOE {
    addAdditiveArrayElement(Dwelling_HOE.Type.TypeInfo.getProperty("Coverages"), coverageBuilder)
    return this
  }
  
  function withHOLocation(hoLocation : HOLocationBuilder_HOE) : DwellingBuilder_HOE {
    set(Dwelling_HOE.Type.TypeInfo.getProperty("HOLocation"), hoLocation)
    return this
  }
  
  override function createBean(context : BuilderContext) : Dwelling_HOE {
    var line = context.ParentBean as entity.HomeownersLine_HOE
    line.Dwelling.setPolicyTypeAndDefaults()
    return line.Dwelling
  }

}
