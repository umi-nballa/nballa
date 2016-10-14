package una.rating.ho.common

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 10/12/16
 * Time: 9:56 AM
 * To change this template use File | Settings | File Templates.
 */
class HODiscountsOrSurchargeRatingInfo {
  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _coverageALimit: BigDecimal as CoverageALimit
  var _allPerilDeductible: BigDecimal as AllPerilDeductible
  construct(line: HomeownersLine_HOE) {
    _coverageALimit = line.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    _allPerilDeductible = line.Dwelling.AllPerilsOrAllOtherPerilsCovTerm.Value
  }
}