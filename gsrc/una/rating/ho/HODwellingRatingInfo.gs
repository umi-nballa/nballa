package una.rating.ho

uses java.math.BigDecimal
uses una.rating.ho.common.HOCommonDwellingRatingInfo

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:18 AM
 * custom implementation of a gosu class which populates the parameters for the routines for the dwelling level coverages
 * for the homeowners policies.
 */
class HODwellingRatingInfo extends HOCommonDwellingRatingInfo{

  var _otherStructuresLimit : int as OtherStructuresLimit
  var _otherStructuresIncreasedOrDecreasedLimit : int as OtherStructuresIncreasedOrDecreasedLimit
  var _isResidentialGlassCovUnscheduled : String as IsResidentialGlassCovUnscheduled
  var _territoryCode : String as TerritoryCode
  var _county : String as County
  var _unitOwnersOutbuildingAndOtherStructuresLimit : BigDecimal as UnitOwnersOutbuildingAndOtherStructuresLimit
  var _totalBasePremium : BigDecimal as TotalBasePremium
  var _increasedLimitsJewelryWatchesFurs : BigDecimal as IncreasedLimitsJewelryWatchesFurs
  var _lossAssessmentLimit : int as LossAssessmentLimit
  var _moldRemediationLimit : String as MoldRemediationLimit

  construct(lineVersion: HomeownersLine_HOE){
    super(lineVersion)
  }

  construct(dwellingCov : DwellingCov_HOE){
    super(dwellingCov)
    _otherStructuresLimit = ((dwellingCov.Dwelling.HODW_Other_Structures_HOEExists)? dwellingCov.Dwelling.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm?.Value : 0) as int

    if(dwellingCov.Dwelling?.HODW_SpecificOtherStructure_HOE_ExtExists){
      _otherStructuresIncreasedOrDecreasedLimit = (_otherStructuresLimit - (this.DwellingLimit*0.1)) as int
    }

    if(dwellingCov.Dwelling?.HODW_ResidentialGlass_HOE_ExtExists){
      _isResidentialGlassCovUnscheduled = dwellingCov.Dwelling.HODW_ResidentialGlass_HOE_Ext.HODW_Unscheduled_HOE_ExtTerm?.DisplayValue
    }

    if(dwellingCov.Dwelling?.HODW_UnitOwnersOutbuildingCov_HOE_ExtExists){
      if(dwellingCov.Dwelling.HODW_UnitOwnersOutbuildingCov_HOE_Ext?.HasHODW_UnitOwnersLimit_HOETerm){
        _unitOwnersOutbuildingAndOtherStructuresLimit = dwellingCov.Dwelling.HODW_UnitOwnersOutbuildingCov_HOE_Ext?.HODW_UnitOwnersLimit_HOETerm?.Value
      } else{
        _unitOwnersOutbuildingAndOtherStructuresLimit = 0
      }
    }

    if(dwellingCov.Dwelling?.HODW_SpecialLimitsPP_HOE_ExtExists){
      if(dwellingCov.Dwelling?.HODW_SpecialLimitsPP_HOE_Ext?.HasHODW_JewelryWatchesFursLimit_HOETerm){
        _increasedLimitsJewelryWatchesFurs = dwellingCov.Dwelling?.HODW_SpecialLimitsPP_HOE_Ext?.HODW_JewelryWatchesFursLimit_HOETerm?.Value
      }
    }

    if(dwellingCov.Dwelling?.HODW_MoldRemediationCov_HOE_ExtExists){
      _moldRemediationLimit = dwellingCov.Dwelling?.HODW_MoldRemediationCov_HOE_Ext.HODW_MoldRemedCovLimit_HOETerm.DisplayValue
    }

    _lossAssessmentLimit = (dwellingCov.Dwelling.HODW_LossAssessmentCov_HOE_ExtExists)? dwellingCov.Dwelling.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm?.Value.intValue() : 0

    _territoryCode = (dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.TerritoryCodes.first().Code)
    _county = (dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.County != null)? dwellingCov.Dwelling?.HOLocation?.PolicyLocation?.County : ""
  }
}