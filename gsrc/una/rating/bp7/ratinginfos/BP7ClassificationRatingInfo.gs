package una.rating.bp7.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 12/7/16
 * Time: 6:21 PM
 */
class BP7ClassificationRatingInfo {

  var _spoilageType : String as SpoilageType
  var _spoilageCovLimit : BigDecimal as SpoilageCovLimit

  construct(classification : BP7Classification){
    if(classification.BP7SpoilgCovExists){
      _spoilageType = classification?.BP7SpoilgCov?.BP7CovType2Term?.DisplayValue
      _spoilageCovLimit = classification?.BP7SpoilgCov?.BP7Limit32Term?.Value
    }
  }
}