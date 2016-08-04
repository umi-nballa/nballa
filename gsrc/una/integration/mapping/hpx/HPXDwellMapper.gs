package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/4/16
 * Time: 6:42 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellMapper {

  function createDwell(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.Dwell {
    var dwell = new wsi.schema.una.hpx.hpx_application_request.Dwell()
    dwell.addChild(createDwellRating(policyPeriod))
    dwell.addChild(createBuildingProtection(policyPeriod))
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

  function createBuildingProtection(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.BldgProtection {
    var bldgProtection = new wsi.schema.una.hpx.hpx_application_request.BldgProtection()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode != null) {
      var protectionClassGradeCd = new wsi.schema.una.hpx.hpx_application_request.ProtectionClassGradeCd()
      protectionClassGradeCd.setText(policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClassCode)
      bldgProtection.addChild(protectionClassGradeCd)
    }
    return bldgProtection
  }

  function createDwellInspectionValuation(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.DwellInspectionValuation {
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
      switch (policyPeriod.HomeownersLine_HOE.Dwelling.UnitsNumber) {
        case typekey.NumUnits_HOE.TC_ONE :
            numFamilies.setText(1)
            numFamiliesDesc.setText(typekey.NumUnits_HOE.TC_ONE.Description)
            break
        case typekey.NumUnits_HOE.TC_TWO :
            numFamilies.setText(2)
            numFamiliesDesc.setText(typekey.NumUnits_HOE.TC_TWO.Description)
            break
        case typekey.NumUnits_HOE.TC_THREE :
            numFamilies.setText(3)
            numFamiliesDesc.setText(typekey.NumUnits_HOE.TC_THREE.Description)
            break
        case typekey.NumUnits_HOE.TC_FOUR :
            numFamilies.setText(4)
            numFamiliesDesc.setText(typekey.NumUnits_HOE.TC_FOUR.Description)
            break
      }
      dwellingInspectionValuation.addChild(numFamilies)
      dwellingInspectionValuation.addChild(numFamiliesDesc)
    }
    return dwellingInspectionValuation
  }

  function createDwellOccupancy(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.DwellOccupancy{
    var dwellOccupancy = new wsi.schema.una.hpx.hpx_application_request.DwellOccupancy()
    var residenceTypeCode = new wsi.schema.una.hpx.hpx_application_request.ResidenceTypeCd()
    var residenceTypeDesc = new wsi.schema.una.hpx.hpx_application_request.ResidenceTypeDesc()
    if(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType != null) {
      switch (policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType) {
        case typekey.ResidenceType_HOE.TC_FAM1 :
        case typekey.ResidenceType_HOE.TC_FAM2 :
        case typekey.ResidenceType_HOE.TC_FAM3 :
        case typekey.ResidenceType_HOE.TC_FAM4 :
        case typekey.ResidenceType_HOE.TC_FAM5 :
            residenceTypeCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.ResidenceType.DW)
            residenceTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description)
            break
        case typekey.ResidenceType_HOE.TC_APT :
            residenceTypeCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.ResidenceType.APT)
            residenceTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description)
            break
        case typekey.ResidenceType_HOE.TC_CONDO :
            residenceTypeCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.ResidenceType.CD)
            residenceTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description)
            break
        case typekey.ResidenceType_HOE.TC_COOP :
            residenceTypeCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.ResidenceType.CO)
            residenceTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description)
            break
        case typekey.ResidenceType_HOE.TC_MOBILE :
            residenceTypeCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.ResidenceType.MH)
            residenceTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description)
            break
        case typekey.ResidenceType_HOE.TC_TOWNROW :
            residenceTypeCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.ResidenceType.TH)
            residenceTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description)
            break
          default :
          residenceTypeCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.ResidenceType.OTH)
          residenceTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.ResidenceType.Description)
      }
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
      switch (policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy) {
        case typekey.DwellingOccupancyType_HOE.TC_OWNER :
            dwellOccupancyType.setText(wsi.schema.una.hpx.hpx_application_request.enums.OccupancyType.OWNER)
            dwellOccupancyTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy.Description)
            break
        case typekey.DwellingOccupancyType_HOE.TC_TENANT :
            dwellOccupancyType.setText(wsi.schema.una.hpx.hpx_application_request.enums.OccupancyType.TENAN)
            dwellOccupancyTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy.Description)
            break
        case typekey.DwellingOccupancyType_HOE.TC_VACANT :
            dwellOccupancyType.setText(wsi.schema.una.hpx.hpx_application_request.enums.OccupancyType.UNOCC)
            dwellOccupancyTypeDesc.setText(policyPeriod.HomeownersLine_HOE.Dwelling.Occupancy.Description)
            break
      }
    }
    dwellOccupancy.addChild(dwellOccupancyType)
    dwellOccupancy.addChild(dwellOccupancyTypeDesc)
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
      animalTypeCd.setText(animal.AnimalType)
      animalExposureInfo.addChild(animalTypeCd)
      var breedCd = new wsi.schema.una.hpx.hpx_application_request.BreedCd()
      breedCd.setText(animal.AnimalBreed)
      animalExposureInfo.addChild(breedCd)
      var breedDesc = new wsi.schema.una.hpx.hpx_application_request.BreedDesc()
      breedDesc.setText(animal.AnimalBreed.Description)
      animalExposureInfo.addChild(breedDesc)
      var biteHistory = new wsi.schema.una.hpx.hpx_application_request.BiteHistoryInd()
      var hasAnimalBiteHistory = animal.AnimalBiteHistory
      biteHistory.setText(animal.AnimalBiteHistory)
      animalExposureInfo.addChild(biteHistory)
      animalExposures.add(animalExposureInfo)
    }
    return animalExposures
  }


}