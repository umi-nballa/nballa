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
  construct(dwellingCov: HODW_Other_Structures_HOE) {
    var limitDifference = dwellingCov.HODW_OtherStructures_Limit_HOETerm.LimitDifference
    if (limitDifference != 0){
      _isOtherStructuresIncreasedOrDecreasedLimit = true
    }
    _otherStructuresIncreasedOrDecreasedLimit = limitDifference
  }
}