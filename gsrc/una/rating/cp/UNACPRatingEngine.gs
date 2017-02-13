package una.rating.cp

uses gw.lob.common.util.DateRange
uses gw.rating.AbstractRatingEngine
uses gw.rating.CostData

uses java.lang.Iterable
uses una.logging.UnaLoggerCategory
uses gw.lob.gl.rating.GLCovExposureCostData
uses una.rating.gl.common.GLLineCovCostData
uses java.util.Map
uses una.rating.gl.ratingInfos.GLLineRatingInfo
uses una.rating.gl.common.GLRateRoutineNames
uses gw.lob.cp.rating.CPBuildingCovGroup1CostData
uses gw.lob.cp.rating.CPBuildingCovGroup2CostData
uses gw.lob.cp.rating.CPBuildingCovSpecialCostData

class UNACPRatingEngine extends AbstractRatingEngine<CPLine> {
  var _minimumRatingLevel: RateBookStatus
  var _executor: CPRateRoutineExecutor
  final static var _logger = UnaLoggerCategory.UNA_RATING
  var _lineRatingInfo : GLLineRatingInfo as LineRatingInfo
  private static final var CLASS_NAME = UNACPRatingEngine.Type.DisplayName

  construct(line: CPLine) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: CPLine, minimumRatingLevel: RateBookStatus) {
    super(line)
    _logger.info("Initializing the " + line.BaseState.Code + " CP Rating Engine")
    _minimumRatingLevel = minimumRatingLevel
    _executor = new CPRateRoutineExecutor(ReferenceDatePlugin, PolicyLine, minimumRatingLevel)
    _logger.info(line.BaseState.Code + " CP Rating Engine initialized")
  }

  override function rateSlice(lineVersion: CPLine) {
    assertSliceMode(lineVersion)
    if (!lineVersion.Branch.isCanceledSlice()) {
      var sliceRange = new DateRange(lineVersion.SliceDate, getNextSliceDateAfter(lineVersion.SliceDate))
      _logger.info("Rating CP Line Coverages")
      //lineVersion.GLLineCoverages.each( \ cov -> rateLineCoverages(cov, sliceRange))
      _logger.info("Done Rating CP Line Coverages")
    }
  }

  override protected function createCostDataForCost(c: Cost): CostData {
    var cd: CostData
    switch (typeof c) {
      case CPBuildingCovGrp1Cost:  return new CPBuildingCovGroup1CostData(c, RateCache)
      case CPBuildingCovGrp2Cost:  return new CPBuildingCovGroup2CostData(c, RateCache)
      case CPBuildingCovSpecCost:  return new CPBuildingCovSpecialCostData(c, RateCache)
      default:
        throw "unknown type of cost " + typeof c
    }
  }

  override function rateWindow(lineVersion: CPLine) {
    // for Tax
    assertSliceMode(lineVersion)
  }

  /******
      This default version of this method will return all of the Costs on a policy for the slice's effective date.  If some of the
      costs on a policy are created as part of the "rate window" portion of the rating algorithm (that is, they are created at the
      end for the entire period rather than created as part of rating each slice in time), then these costs should be excluded
      from what is returned by this method.  Override this method to return only the types of costs that would be created during the
      rateSlice portion of the algorithm in that case.
   ******/
  override protected function existingSliceModeCosts(): Iterable<Cost> {
    return PolicyLine.Costs
  }
}
