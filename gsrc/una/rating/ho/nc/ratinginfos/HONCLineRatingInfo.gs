package una.rating.ho.nc.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:16 PM
 * To change this template use File | Settings | File Templates.
 */
class HONCLineRatingInfo {
  var _personalInjuryAgg : boolean as PersonalInjuryAggregate
  var _personalInjuryPer : boolean as PersonalInjuryPerOffense
  var _numberOfResidenceFamily : int as NumberOfResidenceFamily

  construct(line: HomeownersLine_HOE){
    _personalInjuryAgg = line.HOLI_PersonalInjuryAggregate_NC_HOE_ExtExists
    _personalInjuryPer = line.HOLI_PersonalInjury_NC_HOE_ExtExists
//    _numberOfResidenceFamily = line.HOLI_AddResidenceRentedtoOthers_HOE.CoveredLocations*.NumberOfFamilies.atMostOne()
  }
}