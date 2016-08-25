package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/24/16
 * Time: 2:28 PM
 */
class HOGroup1LineLevelRatingInfo {

  var _policyType : String as PolicyType
  var _totalBasePremium : BigDecimal as TotalBasePremium

  construct(lineVersion : HomeownersLine_HOE){
    _policyType = lineVersion.HOPolicyType.Code
  }

}