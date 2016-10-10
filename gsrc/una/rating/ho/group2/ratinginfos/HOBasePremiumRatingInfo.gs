package una.rating.ho.group2.ratinginfos

uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 9/29/16
 * Time: 2:17 PM
 * To change this template use File | Settings | File Templates.
 */
class HOBasePremiumRatingInfo extends HOCommonBasePremiumRatingInfo{

  var _windHailExclusion : boolean as WindHailExclusion = false


  construct(dwelling : Dwelling_HOE){
    super(dwelling)

    _windHailExclusion = dwelling.HOLine.HODW_WindstromHailExc_HOE_ExtExists


  }

}