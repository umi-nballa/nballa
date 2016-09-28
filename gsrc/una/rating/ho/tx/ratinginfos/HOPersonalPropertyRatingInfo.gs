package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/19/16
 * Rating info for personal property Increased or decreased limits
 */
class HOPersonalPropertyRatingInfo {

  var _isPersonalPropertyIncreasedLimit : boolean as IsPersonalPropertyIncreasedLimit
  var _personalPropertyIncreasedLimit : BigDecimal as PersonalPropertyIncreasedLimit

  construct(limitDifference : BigDecimal){
    if(limitDifference > 0){
      _isPersonalPropertyIncreasedLimit = true
    }
    _personalPropertyIncreasedLimit = limitDifference
  }
}