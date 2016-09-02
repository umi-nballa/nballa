package una.rating.bp7

uses gw.lob.common.util.DateRange
uses gw.lob.bp7.rating.BP7RateRoutineExecutor
uses gw.lob.bp7.rating.BP7BuildingStep
uses gw.lob.bp7.rating.BP7ClassificationStep
uses una.logging.UnaLoggerCategory

class UNABP7RatingEngine extends UNABP7AbstractRatingEngine<BP7Line> {

  var _minimumRatingLevel : RateBookStatus
  var _executor : BP7RateRoutineExecutor
  final static var _logger = UnaLoggerCategory.UNA_RATING

  construct(line : BP7Line) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line : BP7Line, minimumRatingLevel : RateBookStatus) {
    super(line)
    _logger.info("Initializing the " + line.BaseState.Code + " BOP Rating Engine")
    _minimumRatingLevel = minimumRatingLevel
    _executor = new BP7RateRoutineExecutor(ReferenceDatePlugin, PolicyLine, minimumRatingLevel)
    _logger.info(line.BaseState.Code + " BOP Rating Engine initialized")
  }

  override function rateLineCoverage(lineCov : BP7LineCov, sliceToRate : DateRange) {
  }

  override function rateLocationCoverage(lineCov : BP7LocationCov, sliceToRate : DateRange) {
  }

  /*override function rateLiability(line : BP7BusinessOwnersLine, sliceToRate : DateRange) {
    PolicyLine.AllBuildings.each(\ building -> {
      if (building.LessorOccupied) {
        var step = new BP7LiabilityLessorStep(PolicyLine, building, _executor, NumDaysInCoverageRatedTerm)
        addCost(step.rate(PolicyLine.BP7BusinessLiability, sliceToRate))
      }
      else {
        building.Classifications.each(\ classification -> {
          if(classification.BPPOrFunctionalValuationExists and hasRateForClassGroup(classification)){
            var step = new BP7LiabilityOccupantStep(PolicyLine, classification, _executor, NumDaysInCoverageRatedTerm)
            addCost(step.rate(PolicyLine.BP7BusinessLiability, sliceToRate))
          }
        })        
      }      
    })
  } */

  override function rateBuilding(building : BP7Building, sliceToRate : DateRange) {
    var step = new BP7BuildingStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm)
    if (building.BP7StructureExists) {
      addCost(step.rate(building.BP7Structure, sliceToRate))
    }
  }

  override function rateClassification(classification : BP7Classification, sliceToRate : DateRange) {
    var step = new BP7ClassificationStep(PolicyLine, _executor, NumDaysInCoverageRatedTerm)
    if (classification.BP7ClassificationBusinessPersonalPropertyExists) {
      addCost(step.rate(classification.BP7ClassificationBusinessPersonalProperty, sliceToRate))
    }
  }

  function hasRateForClassGroup(classification : BP7Classification) : boolean{
    return not {"17", "19", "20", "21"}.contains(classification.ClassificationClassGroup)
  }
}
