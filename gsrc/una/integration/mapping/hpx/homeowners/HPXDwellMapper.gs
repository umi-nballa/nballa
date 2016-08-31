package una.integration.mapping.hpx.homeowners
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/4/16
 * Time: 6:42 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellMapper {

  function createDwell(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.Dwell {
    var buildingProtectionMapper = new HPXHOBuildingProtectionMapper ()
    var dwell = new wsi.schema.una.hpx.hpx_application_request.Dwell()
    dwell.addChild(createDwellRating(policyPeriod))
    dwell.addChild(buildingProtectionMapper.createBuildingProtection(policyPeriod))
    if (policyPeriod.HomeownersLine_HOE.Dwelling.YearPurchased != null) {
      var purchaseDt = new wsi.schema.una.hpx.hpx_application_request.PurchaseDt()
      purchaseDt.setText(policyPeriod.HomeownersLine_HOE.Dwelling.YearPurchased)
      dwell.addChild(purchaseDt)
    }
    dwell.addChild(createDwellInspectionValuation(policyPeriod))
    dwell.addChild(createDwellOccupancy(policyPeriod))
    dwell.addChild(createMasterPolicyInfo(policyPeriod))
    var animalsOrExoticPetsInd = new wsi.schema.una.hpx.hpx_application_request.AnimalOrExoticPetsInd()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.AnimalsInDwelling != null) {
      animalsOrExoticPetsInd.setText(policyPeriod.HomeownersLine_HOE.Dwelling.AnimalsInDwelling)
      dwell.addChild(animalsOrExoticPetsInd)
    }
    var animalExposures = createDwellAnimalExposureInfo(policyPeriod)
    for (animal in animalExposures) {
      dwell.addChild(animal)
    }
    var watercrafts = createOutboardMotorsAndWatercraft(policyPeriod)
    for (watercraft in watercrafts) {
      dwell.addChild(watercraft)
    }
    var swimmingPoolInd = new wsi.schema.una.hpx.hpx_application_request.SwimmingPoolInd()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.SwimmingPoolExists != null) {
      swimmingPoolInd.setText(policyPeriod.HomeownersLine_HOE.Dwelling.SwimmingPoolExists)
      dwell.addChild(swimmingPoolInd)
    }
    return dwell
  }

  function createDwellRating(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.DwellRating {
    var dwellRating = new wsi.schema.una.hpx.hpx_application_request.DwellRating()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.PolicyLocations[0].TerritoryCodes[0] != null) {
      var territoryCd = new wsi.schema.una.hpx.hpx_application_request.TerritoryCd()
      territoryCd.setText(policyPeriod.HomeownersLine_HOE.Dwelling.PolicyLocations[0].TerritoryCodes[0].Code)
      dwellRating.addChild(territoryCd)
    }
    return dwellRating
  }

  function createDwellInspectionValuation(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.DwellInspectionValuation {
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var dwellingInspectionValuation = new wsi.schema.una.hpx.hpx_application_request.DwellInspectionValuation()
    var estimatedReplacementCostAmt = new wsi.schema.una.hpx.hpx_application_request.EstimatedReplCostAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.ReplacementCost != null) {
      amt.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ReplacementCost)
      estimatedReplacementCostAmt.addChild(amt)
      dwellingInspectionValuation.addChild(estimatedReplacementCostAmt)
    }
    var numFamilies = new wsi.schema.una.hpx.hpx_application_request.NumFamilies()
    var numFamiliesDesc = new wsi.schema.una.hpx.hpx_application_request.NumFamiliesDesc()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber != null) {
      numFamilies.setText(typecodeMapper.getAliasByInternalCode("NumUnits_HOE", "hpx", policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber))
      numFamiliesDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber)
      dwellingInspectionValuation.addChild(numFamilies)
      dwellingInspectionValuation.addChild(numFamiliesDesc)
    }
    var coveredPorch = new wsi.schema.una.hpx.hpx_application_request.PorchInfoInd()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.CoveredPorch != null) {
      if(policyPeriod.HomeownersLine_HOE.Dwelling.CoveredPorch) {
        coveredPorch.setText(true)
      } else {
        coveredPorch.setText(false)
      }
      dwellingInspectionValuation.addChild(coveredPorch)
    }
    return dwellingInspectionValuation
  }

  function createDwellOccupancy(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.DwellOccupancy{
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    var dwellOccupancy = new wsi.schema.una.hpx.hpx_application_request.DwellOccupancy()
    var residenceTypeCode = new wsi.schema.una.hpx.hpx_application_request.ResidenceTypeCd()
    var residenceTypeDesc = new wsi.schema.una.hpx.hpx_application_request.ResidenceTypeDesc()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType != null) {
      residenceTypeCode.setText(typecodeMapper.getAliasByInternalCode("ResidenceType_HOE", "hpx", policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Code))
      residenceTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description)
    }
    dwellOccupancy.addChild(residenceTypeCode)
    dwellOccupancy.addChild(residenceTypeDesc)
    var dwellUseCode = new wsi.schema.una.hpx.hpx_application_request.DwellUseCd()
    var dwellUseDesc = new wsi.schema.una.hpx.hpx_application_request.DwellUseDesc()
    if (policyPeriod.HomeownersLine_HOE.Dwelling.DwellingUsage != null) {
      dwellUseCode.setText(policyPeriod.HomeownersLine_HOE.Dwelling.DwellingUsage.Code)
      dwellUseDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.DwellingUsage.Description)
    }
    dwellOccupancy.addChild(dwellUseCode)
    dwellOccupancy.addChild(dwellUseDesc)
    var dwellOccupancyType = new wsi.schema.una.hpx.hpx_application_request.OccupancyTypeCd()
    var dwellOccupancyTypeDesc = new wsi.schema.una.hpx.hpx_application_request.OccupancyTypeDesc()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy != null) {
      dwellOccupancyType.setText(typecodeMapper.getAliasByInternalCode("DwellingOccupancyType_HOE", "hpx", policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy))
      dwellOccupancyTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy.Description)
      dwellOccupancy.addChild(dwellOccupancyType)
      dwellOccupancy.addChild(dwellOccupancyTypeDesc)
    }
    return dwellOccupancy
  }

  function createMasterPolicyInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.MasterPolicyInfo {
    var masterPolicyInfo = new wsi.schema.una.hpx.hpx_application_request.MasterPolicyInfo()
    var policyNumber = new wsi.schema.una.hpx.hpx_application_request.PolicyNumber()
    if(policyPeriod.PolicyTerm.PolicyNumber != null) {
      policyNumber.setText(policyPeriod.PolicyTerm.PolicyNumber)
      masterPolicyInfo.addChild(policyNumber)
    }
    return masterPolicyInfo
  }

  function createDwellAnimalExposureInfo(policyPeriod : PolicyPeriod) : List<wsi.schema.una.hpx.hpx_application_request.AnimalExposureInfo> {
    var animalExposures = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.AnimalExposureInfo>()
    var animals = policyPeriod.HomeownersLine_HOE.Dwelling.DwellingAnimals
    for (animal in animals) {
      var animalExposureInfo = new wsi.schema.una.hpx.hpx_application_request.AnimalExposureInfo()
      var animalTypeCd = new wsi.schema.una.hpx.hpx_application_request.AnimalTypeCd()
      if (animal.AnimalType != null) {
        animalTypeCd.setText(animal.AnimalType)
        animalExposureInfo.addChild(animalTypeCd)
      }
      var breedCd = new wsi.schema.una.hpx.hpx_application_request.BreedCd()
      if(animal.AnimalBreed != null) {
        breedCd.setText(animal.AnimalBreed)
        animalExposureInfo.addChild(breedCd)
      }
      var breedDesc = new wsi.schema.una.hpx.hpx_application_request.BreedDesc()
      if (animal.AnimalBreed.Description != null) {
        breedDesc.setText(animal.AnimalBreed.Description)
        animalExposureInfo.addChild(breedDesc)
      }
      var biteHistory = new wsi.schema.una.hpx.hpx_application_request.BiteHistoryInd()
      if (animal.AnimalBiteHistory != null) {
        var hasAnimalBiteHistory = animal.AnimalBiteHistory
        biteHistory.setText(animal.AnimalBiteHistory)
        animalExposureInfo.addChild(biteHistory)
      }
      animalExposures.add(animalExposureInfo)
    }
    return animalExposures
  }

  function createOutboardMotorsAndWatercraft(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.Watercraft> {
    var watercrafts = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Watercraft>()
    var outboardMotorsAndWatercrafts = policyPeriod.HomeownersLine_HOE.HOSL_OutboardMotorsWatercraft_HOE_Ext.scheduledItem_Ext
    for (item in outboardMotorsAndWatercrafts) {
      var watercraft = new wsi.schema.una.hpx.hpx_application_request.Watercraft()
      var watercraftName = new wsi.schema.una.hpx.hpx_application_request.WatercraftName()
      if (item.watercraftName != null) {
        watercraftName.setText(item.watercraftName)
        watercraft.addChild(watercraftName)
      }
      var watercraftType = new wsi.schema.una.hpx.hpx_application_request.WatercraftType()
      if (item.watercraftType != null) {
        watercraftType.setText(item.watercraftType)
        watercraft.addChild(watercraftType)
      }
      var watercraftDescription = new wsi.schema.una.hpx.hpx_application_request.Description()
      if (item.watercraftDescription != null) {
        watercraftDescription.setText(item.watercraftDescription)
        watercraft.addChild(watercraftDescription)
      }
      var length = new wsi.schema.una.hpx.hpx_application_request.Length()
      if (item.overallLength != null) {
        length.setText(item.overallLength)
      }
      var horsepower = new wsi.schema.una.hpx.hpx_application_request.Horsepower()
      var numUnits = new wsi.schema.una.hpx.hpx_application_request.NumUnits()
      var unitMeasurementCd = new wsi.schema.una.hpx.hpx_application_request.UnitMeasurementCd()
      if (item.horsepower != null) {
        numUnits.setText(item.horsepower.DisplayName)
        horsepower.addChild(numUnits)
        unitMeasurementCd.setText("Horsepower")
        horsepower.addChild(unitMeasurementCd)
        watercraft.addChild(horsepower)
      }
      var speedRating = new wsi.schema.una.hpx.hpx_application_request.SpeedRating()
      if (item.speedRating != null) {
        speedRating.setText(item.speedRating)
        watercraft.addChild(speedRating)
      }
      var navigationPeriod = new wsi.schema.una.hpx.hpx_application_request.NavigationPeriod()
      if (item.navPeriodEachYear != null) {
        navigationPeriod.setText(item.navPeriodEachYear)
        watercraft.addChild(navigationPeriod)
      }
      var navigationFromDate = new wsi.schema.una.hpx.hpx_application_request.NavigationFromDt()
      if (item.fromDate != null) {
        navigationFromDate.setText(item.fromDate)
        watercraft.addChild(navigationFromDate)
      }
      var navigationToDate = new wsi.schema.una.hpx.hpx_application_request.NavigationToDate()
      if (item.toDate != null) {
        navigationToDate.setText(item.toDate)
        watercraft.addChild(navigationToDate)
      }
      watercrafts.add(watercraft)
    }
    return watercrafts
  }
}