package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/19/16
 * Time: 2:43 PM
 * Rating info for Other structures Increased or decreased limits
 */
class HOOtherStructuresRatingInfo {
  var _otherStructuresIncreasedOrDecreasedLimit : BigDecimal as OtherStructuresIncreasedOrDecreasedLimit
  var _isOtherStructuresIncreasedOrDecreasedLimit : boolean as IsOtherStructuresIncreasedOrDecreasedLimit

  construct(limitDifference : BigDecimal){
    if(limitDifference != 0){
      _isOtherStructuresIncreasedOrDecreasedLimit = true
    }
    _otherStructuresIncreasedOrDecreasedLimit = limitDifference
  }
}