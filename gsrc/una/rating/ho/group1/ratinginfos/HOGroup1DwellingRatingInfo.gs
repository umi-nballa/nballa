package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal
uses una.rating.ho.common.HOCommonDwellingRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/10/16
 * Time: 10:50 AM
 */
class HOGroup1DwellingRatingInfo extends HOCommonDwellingRatingInfo{

  var _totalBasePremium : BigDecimal as TotalBasePremium
  var _isOrdinanceOrLawCoverage : boolean as IsOrdinanceOrLawCoverage = false

  construct(dwellingCov : DwellingCov_HOE){
    super(dwellingCov)
  }
}