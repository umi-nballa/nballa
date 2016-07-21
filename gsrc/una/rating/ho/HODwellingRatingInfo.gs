package una.rating.ho
/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:18 AM
 * custom implementation of a gosu class which populates the parameters for the routines for the dwelling level coverages
 * for the homeowners policies.
 */
class HODwellingRatingInfo {

  var _animalLiabilityLimit : int as AnimalLiabilityLimit
  var _dwellingLimit : int as DwellingLimit
  var _otherStructuresLimit : int as OtherStructuresLimit
  var _otherStructuresIncreasedOrDecreasedLimit : int as OtherStructuresIncreasedOrDecreasedLimit
  var _isResidentialGlassCovUnscheduled : String as IsResidentialGlassCovUnscheduled
  var _territoryCode : String as TerritoryCode
  var _county : String as County

  construct(){}

  construct(dwellingCov : DwellingCov_HOE){
    _animalLiabilityLimit = ((dwellingCov.Dwelling.HODW_AnimalLiability_HOE_ExtExists)? dwellingCov.Dwelling.HODW_AnimalLiability_HOE_Ext?.HODW_AnimalLiability_Limit_HOETerm?.Value : 0) as int
    _dwellingLimit = ((dwellingCov.Dwelling.HODW_Dwelling_Cov_HOEExists)? dwellingCov.Dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0) as int
    _otherStructuresLimit = ((dwellingCov.Dwelling.HODW_Other_Structures_HOEExists)? dwellingCov.Dwelling.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm?.Value : 0) as int

    if(dwellingCov.Dwelling.HODW_SpecificOtherStructure_HOE_ExtExists){
      _otherStructuresIncreasedOrDecreasedLimit = (_otherStructuresLimit - (_dwellingLimit*0.1)) as int
    }

    if(dwellingCov.Dwelling.HODW_ResidentialGlass_HOE_ExtExists){
      _isResidentialGlassCovUnscheduled = dwellingCov.Dwelling.HODW_ResidentialGlass_HOE_Ext.HODW_Unscheduled_HOE_ExtTerm?.DisplayValue
    }
    _territoryCode = (dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.TerritoryCodes.first().Code)
    _county = (dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.County != null)? dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.County : ""
  }
}