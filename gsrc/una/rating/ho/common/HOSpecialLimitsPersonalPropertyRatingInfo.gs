package una.rating.ho.common

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/23/16
 * Time: 3:11 PM
 */
class HOSpecialLimitsPersonalPropertyRatingInfo {
  var _jewelryWatchesAndFurLimit: int as JewelryWatchesAndFurLimit
  var _moneyLimit: int as MoneyLimit
  var _securityLimit: int as SecurityLimit
  var _silverwareGoldwareAndPewterwareLimit: int as SilverwareGoldwareAndPewterwareLimit
  var _firearmsLimit: int as FirearmsLimit
  var _electronicApparatusLimit: int as ElectronicApparatusLimit
  var _coverageCLimit: int as CoverageCLimit
  var _jewelryAndFursLimit: int as JewelryAndFursLimit

  construct(dwellingCov: DwellingCov_HOE) {
    if (dwellingCov typeis HODW_SpecialLimitsPP_HOE_Ext){
      _jewelryWatchesAndFurLimit = dwellingCov?.HODW_JewelryWatchesFursLimit_HOETerm?.Value?.intValue()
      _moneyLimit = dwellingCov?.HODW_MoneyLimit_HOETerm?.Value?.intValue()
      _electronicApparatusLimit = dwellingCov?.HODW_ElectronicApparatusLimit_HOETerm?.Value?.intValue()
      _securityLimit = dwellingCov?.HODW_SecurityLimits_HOETerm?.Value?.intValue()
      _firearmsLimit = dwellingCov?.HODW_FirearmsLimit_HOETerm?.Value?.intValue()
      _silverwareGoldwareAndPewterwareLimit = dwellingCov?.HODW_SilverwareGoldwareLimit_HOETerm?.Value?.intValue()
      _coverageCLimit = dwellingCov?.Dwelling.PersonalPropertyLimitCovTerm?.Value?.intValue()
      _jewelryAndFursLimit = dwellingCov?.HODW_JewelryFursSingleItemLimit_HOETerm?.Value?.intValue()
    }
  }
}