package una.rating.ho.common

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/19/16
 * Time: 2:43 PM
 * Rating info for Other structures Increased or decreased limits
 */
class HOOtherStructuresRatingInfo {
  var _otherStructuresIncreasedOrDecreasedLimit: BigDecimal as OtherStructuresIncreasedOrDecreasedLimit
  var _isOtherStructuresIncreasedOrDecreasedLimit: boolean as IsOtherStructuresIncreasedOrDecreasedLimit
  var _absoluteWindhailExcluded : boolean as AbsoluteWindHailExcluded
  var _unitOwnersCoverageASpecialCoverage : boolean as UnitOwnersCoverageASpecial
  var _otherStructuresRentedToOthersLimit : BigDecimal as OtherStructuresRentedToOtherLimits
  construct(dwellingCov: DwellingCov_HOE) {
    var limitDifference = dwellingCov.Dwelling.HODW_Other_Structures_HOE.HODW_OtherStructures_Limit_HOETerm.LimitDifference
    if (limitDifference != 0){
      _isOtherStructuresIncreasedOrDecreasedLimit = true
    }

    _unitOwnersCoverageASpecialCoverage = dwellingCov.Dwelling.HOPolicyType == TC_HO6 and dwellingCov.Dwelling.HODW_UnitOwnersCovASpecialLimits_HOE_ExtExists
    _otherStructuresIncreasedOrDecreasedLimit = limitDifference
    _absoluteWindhailExcluded = dwellingCov.Dwelling.HOLine.HODW_AbsoluteWindHailExc_HOE_ExtExists
    _otherStructuresRentedToOthersLimit = dwellingCov.Dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HODW_IncreasedLimit_HOETerm?.Value
  }
}