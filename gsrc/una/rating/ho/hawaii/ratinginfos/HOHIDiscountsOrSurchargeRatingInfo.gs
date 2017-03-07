package una.rating.ho.hawaii.ratinginfos

uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal
uses una.utils.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HOHIDiscountsOrSurchargeRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo{
  var _claimFreeYears: int as ClaimFreeYears = 0
  var _priorLosses : int as PriorLosses = 0
  var _dwellingOccupancy : DwellingOccupancyType_HOE as DwellingOccupancy
  var _tenantSeasonal : RatingDwellingUsage_Ext as tenantSeasonal
 construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal){
   super(line, totalBasePremium)


   if(line?.HOPriorLosses_Ext != null){
     _priorLosses = line?.HOPriorLosses_Ext?.where( \ elt -> elt.ChargeableClaim == typekey.Chargeable_Ext.TC_YES).length
   } else{
     _claimFreeYears = line.Branch.EditEffectiveDate.differenceInYears(line.Branch.Policy.OriginalEffectiveDate)
   }
   _dwellingOccupancy = line.Dwelling.Occupancy

   if( line.Dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC and line.Dwelling?.Occupancy == typekey.DwellingOccupancyType_HOE.TC_NONOWN){
    _tenantSeasonal = TC_TenantSeasonal
   }
 }
}