package una.integration.mapping.hpx.homeowners

uses gw.xml.XmlElement
uses gw.xml.date.XmlDate
uses una.integration.mapping.hpx.common.HPXStructureMapper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/4/16
 * Time: 6:42 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellMapper implements HPXStructureMapper {

  override function createStructure(coverable : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType {
    return createDwell(coverable.PolicyLine.Branch)
  }

  function createDwell(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType {
    var buildingProtectionMapper = new HPXHOBuildingProtectionMapper ()
    var dwellConstructionMapper = new HPXHODwellConstructionMapper ()
    var dwell = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType()
    dwell.addChild(new XmlElement("DwellRating", createDwellRating(policyPeriod)))
    dwell.addChild(new XmlElement("BldgProtection", buildingProtectionMapper.createBuildingProtection(policyPeriod)))
    //dwell.PurchaseDt.Year = policyPeriod.HomeownersLine_HOE.Dwelling.YearPurchased != null ? policyPeriod.HomeownersLine_HOE.Dwelling.YearPurchased : null
    dwell.PurchaseDt = policyPeriod.HomeownersLine_HOE.Dwelling.YearPurchased != null ? new XmlDate(policyPeriod.HomeownersLine_HOE.Dwelling.YearPurchased) : null
    /*
    if (policyPeriod.HomeownersLine_HOE.Dwelling.YearPurchased != null) {
      dwell.PurchaseDt.Year = policyPeriod.HomeownersLine_HOE.Dwelling.YearPurchased
    }
    */
    dwell.addChild(new XmlElement("Construction", dwellConstructionMapper.createDwellConstruction(policyPeriod)))
    dwell.addChild(new XmlElement("DwellInspectionValuation", createDwellInspectionValuation(policyPeriod)))
    dwell.addChild(new XmlElement("DwellOccupancy", createDwellOccupancy(policyPeriod)))
    dwell.addChild(new XmlElement("MasterPolicyInfo", createMasterPolicyInfo(policyPeriod)))
    dwell.AnimalOrExoticPetsInd = policyPeriod.HomeownersLine_HOE.Dwelling.AnimalsInDwelling != null ? policyPeriod.HomeownersLine_HOE.Dwelling.AnimalsInDwelling : false
    var animalExposures = createDwellAnimalExposureInfo(policyPeriod)
    for (animal in animalExposures) {
      dwell.addChild(new XmlElement("AnimalExposureInfo", animal))
    }
    var watercrafts = createOutboardMotorsAndWatercraft(policyPeriod)
    for (watercraft in watercrafts) {
      dwell.addChild(new XmlElement("Watercraft", watercraft))
    }
    dwell.SwimmingPoolInd = policyPeriod.HomeownersLine_HOE.Dwelling.SwimmingPoolExists != null ? policyPeriod.HomeownersLine_HOE.Dwelling.SwimmingPoolExists : false
    return dwell
  }

  function createDwellRating(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellRatingType {
    var dwellRating = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellRatingType()
    dwellRating.TerritoryCd = policyPeriod.HomeownersLine_HOE.Dwelling.PolicyLocations[0].TerritoryCodes[0] != null ?
                                                policyPeriod.HomeownersLine_HOE.Dwelling.PolicyLocations[0].TerritoryCodes[0].Code : ""
    return dwellRating
  }

  function createDwellInspectionValuation(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellInspectionValuationType {
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var dwellingInspectionValuation = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellInspectionValuationType()
    dwellingInspectionValuation.EstimatedReplCostAmt.Amt = policyPeriod.HomeownersLine_HOE.Dwelling.ReplacementCost != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ReplacementCost : 0.00
    dwellingInspectionValuation.NumFamilies = policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber != null ?
                                    typecodeMapper.getAliasByInternalCode("NumUnits_HOE", "hpx", policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber) : 0
    dwellingInspectionValuation.NumFamiliesDesc = policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber != null ? policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber != null : ""
    dwellingInspectionValuation.PorchInfoInd = policyPeriod.HomeownersLine_HOE.Dwelling.CoveredPorch != null ? policyPeriod.HomeownersLine_HOE.Dwelling.CoveredPorch : false
    return dwellingInspectionValuation
  }

  function createDwellOccupancy(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellOccupancyType {
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var dwellOccupancy = new wsi.schema.una.hpx.hpx_application_request.types.complex.DwellOccupancyType()
    dwellOccupancy.ResidenceTypeCd = policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType != null ?
                                                 typecodeMapper.getAliasByInternalCode("ResidenceType_HOE", "hpx", policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Code) : ""
    dwellOccupancy.ResidenceTypeDesc = policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType != null ? policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description : ""
    dwellOccupancy.DwellUseCd = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingUsage != null ? policyPeriod.HomeownersLine_HOE.Dwelling.DwellingUsage : null
    dwellOccupancy.DwellUseDesc = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingUsage != null ? policyPeriod.HomeownersLine_HOE.Dwelling.DwellingUsage.Description : ""
    dwellOccupancy.OccupancyTypeCd = policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy != null ?
                                                typecodeMapper.getAliasByInternalCode("DwellingOccupancyType_HOE", "hpx", policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy) : ""
    dwellOccupancy.OccupancyTypeDesc = policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy != null ? policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy.Description : ""
    return dwellOccupancy
  }

  function createMasterPolicyInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.MasterPolicyInfoType {
    var masterPolicyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.MasterPolicyInfoType()
    masterPolicyInfo.PolicyNumber = policyPeriod.PolicyTerm.PolicyNumber != null ? policyPeriod.PolicyTerm.PolicyNumber : ""
    return masterPolicyInfo
  }

  function createDwellAnimalExposureInfo(policyPeriod : PolicyPeriod) : List<wsi.schema.una.hpx.hpx_application_request.types.complex.AnimalExposureInfoType> {
    var animalExposures = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.AnimalExposureInfoType>()
    var animals = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingAnimals
    for (animal in animals) {
      var animalExposureInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.AnimalExposureInfoType()
      animalExposureInfo.AnimalTypeCd = animal.AnimalType != null ? animal.AnimalType : ""
      animalExposureInfo.BreedCd = animal.AnimalBreed != null ? animal.AnimalBreed : ""
      animalExposureInfo.BreedDesc = animal.AnimalBreed != null ? animal.AnimalBreed.Description : ""
      animalExposureInfo.BiteHistoryInd = animal.AnimalBiteHistory != null ? animal.AnimalBiteHistory : ""
      animalExposures.add(animalExposureInfo)
    }
    return animalExposures
  }

  function createOutboardMotorsAndWatercraft(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.WatercraftType> {
    var watercrafts = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.WatercraftType>()
    var outboardMotorsAndWatercrafts = policyPeriod.HomeownersLine_HOE.HOSL_OutboardMotorsWatercraft_HOE_Ext.scheduledItem_Ext
    for (item in outboardMotorsAndWatercrafts) {
      var watercraft = new wsi.schema.una.hpx.hpx_application_request.types.complex.WatercraftType()
      watercraft.WatercraftName = item.watercraftName != null ? item.watercraftName : ""
      watercraft.WatercraftType = item.watercraftType != null ? item.watercraftType : ""
      watercraft.Description =  item.watercraftDescription != null ? item.watercraftDescription : ""
      watercraft.Length.NumUnits = item.overallLength != null ? item.overallLength : ""
      watercraft.Length.UnitMeasurementCd = "Ft"
      watercraft.Horsepower.NumUnits = item.horsepower != null ? item.horsepower.DisplayName : ""
      watercraft.Horsepower.UnitMeasurementCd = "Horsepower"
      watercraft.SpeedRating = item.speedRating != null ? item.speedRating : ""
      watercraft.NavigationPeriod = item.navPeriodEachYear != null ? item.navPeriodEachYear : ""
      watercraft.NavigationFromDt.Day = item.fromDate != null ? item.fromDate.DayOfMonth : ""
      watercraft.NavigationFromDt.Month = item.fromDate != null ? item.fromDate.MonthOfYear : ""
      watercraft.NavigationFromDt.Year = item.fromDate != null ? item.fromDate.YearOfDate : ""
      watercraft.NavigationToDate.Day = item.fromDate != null ? item.toDate.DayOfMonth : ""
      watercraft.NavigationToDate.Month = item.fromDate != null ? item.toDate.MonthOfYear : ""
      watercraft.NavigationToDate.Year = item.fromDate != null ? item.toDate.YearOfDate : ""

      watercrafts.add(watercraft)
    }
    return watercrafts
  }
}