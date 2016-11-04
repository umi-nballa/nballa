package una.rating.ho.group2.ratinginfos

uses una.rating.ho.group1.ratinginfos.HOGroup1LineRatingInfo

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * Rating info for all HO line coverages for group 2 states
 */
class HOGroup2LineRatingInfo  {
  var _limitedFungiWetOrDryRotOrBacteriaSectionIILimit : int as LimitedFungiWetOrDryRotOrBacteriaSectionIILimit

  construct(line: HomeownersLine_HOE) {
    if(line?.HOLI_FungiCov_HOEExists){
      _limitedFungiWetOrDryRotOrBacteriaSectionIILimit = line?.HOLI_FungiCov_HOE?.HOLI_AggLimit_HOETerm?.Value?.intValue()
    }
  }
}