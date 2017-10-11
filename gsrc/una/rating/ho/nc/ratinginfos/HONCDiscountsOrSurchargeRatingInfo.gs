package una.rating.ho.nc.ratinginfos

uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HONCDiscountsOrSurchargeRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo {
    var paidWeather : int as PaidWeather
    var paidNonWeather : int as PaidNonWeather

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal){
      super(line, totalBasePremium)

     var dwelling = line?.Dwelling

     if(dwelling?.PaidWeatherClaims_Ext !=null){
       PaidWeather = dwelling?.PaidWeatherClaims_Ext?.toInt()
     }

     if(dwelling?.PaidNonWeatherClaims_Ext !=null){
       PaidNonWeather = dwelling?.PaidNonWeatherClaims_Ext?.toInt()
     }

     PriorLosses = (PaidWeather + PaidNonWeather)
   }


  }