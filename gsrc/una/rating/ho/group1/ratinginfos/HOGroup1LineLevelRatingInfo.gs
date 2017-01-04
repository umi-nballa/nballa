package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/24/16
 * Time: 2:28 PM
 */
class HOGroup1LineLevelRatingInfo {
  var _policyType: HOPolicyType_HOE as PolicyType
  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _adjustedBaseClassPremium: BigDecimal as AdjustedBaseClassPremium
  var _personalPropertyLimit : BigDecimal as PersonalPropertyLimit
  var _personalPropertyIncreasedLimit : BigDecimal as PersonalPropertyIncreasedLimit
  construct(lineVersion: HomeownersLine_HOE) {
    _policyType = lineVersion.HOPolicyType
    _personalPropertyLimit = (lineVersion.Dwelling.HODW_Personal_Property_HOEExists)? lineVersion.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value : 0
    if(lineVersion.Dwelling.HODW_Personal_Property_HOEExists){
      _personalPropertyIncreasedLimit = lineVersion.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference
    }
  }
}