package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 3/15/17
 */
class HODPDiscountsOrSurchargesRatingInfo {

  var _claimFreeYears : NoClaimFreeYears_Ext as ClaimFreeYears
  var _totalContentsPremium : BigDecimal as TotalContentsPremium
  var _totalDwellingPremium : BigDecimal as TotalDwellingPremium

  construct(line: HomeownersLine_HOE) {
    _claimFreeYears =  line?.Dwelling?.Branch?.ClaimFreeYear
  }
}