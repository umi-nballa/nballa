package una.rating.bp7.ratinginfos
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 1/17/17
 */
class BP7LocationRatingInfo {

  var _numOfAdditionalInterestsFranchisors : int as NumOfAdditionalInterestsFranchisors
  var _numOfAdditionalInterestsLessorOfBuildings : int as NumOfAdditionalInterestsLessorOfBuildings
  var _numOfAdditionalInterestsLessorOfEqmt : int as NumOfAdditionalInterestsLessorOfEqmt
  var _numOfAdditionalInterestsDesignatedPersonOrOrg : int as NumOfAdditionalInterestsDesignatedPersonOrOrg

  construct(locationCov: BP7LocationCov) {
    if(locationCov typeis BP7AddlInsdGrantorOfFranchiseEndorsement){
      _numOfAdditionalInterestsFranchisors = locationCov?.ScheduledItems?.Count
    }
    if(locationCov typeis BP7AddlInsdDesignatedPersonOrgLocation_EXT){
      _numOfAdditionalInterestsDesignatedPersonOrOrg = locationCov?.ScheduledItems?.Count
    }
    if(locationCov typeis BP7AddlInsdManagersLessorsPremises){
      _numOfAdditionalInterestsLessorOfBuildings = locationCov?.ScheduledItems?.Count
    }
    if(locationCov typeis BP7AddlInsdLessorsLeasedEquipmt){
      _numOfAdditionalInterestsLessorOfEqmt = locationCov?.ScheduledItems?.Count
    }
  }
}