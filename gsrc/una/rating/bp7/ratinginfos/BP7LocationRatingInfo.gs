package una.rating.bp7.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 1/17/17
 */
class BP7LocationRatingInfo {

  var _numOfAdditionalInterestsFranchisors : int as NumOfAdditionalInterestsFranchisors

  construct(locationCov: BP7LocationCov) {
    if(locationCov typeis BP7AddlInsdGrantorOfFranchiseEndorsement){
      _numOfAdditionalInterestsFranchisors = locationCov?.ScheduledItems?.Count
    }
  }
}