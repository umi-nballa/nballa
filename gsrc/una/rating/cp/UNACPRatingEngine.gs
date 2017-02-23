package una.rating.cp

uses gw.lob.common.util.DateRange
uses gw.rating.AbstractRatingEngine
uses gw.rating.CostData

uses java.lang.Iterable
uses una.logging.UnaLoggerCategory
uses una.rating.gl.ratingInfos.GLLineRatingInfo
uses gw.lob.cp.rating.CPBuildingCovGroup1CostData
uses gw.lob.cp.rating.CPBuildingCovGroup2CostData
uses gw.lob.cp.rating.CPBuildingCovSpecialCostData
uses una.rating.cp.common.CPBuildingCovOtherThanHurricaneCostData
uses una.rating.cp.common.CPBuildingCovHurricaneCostData
uses una.rating.cp.common.CPRatingStep
uses una.rating.cp.util.CPRatingUtil

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
    CPRatingUtil.Line = PolicyLine
    _logger.info(line.BaseState.Code + " CP Rating Engine initialized")
  }

  override function rateSlice(lineVersion: CPLine) {
    assertSliceMode(lineVersion)
    if (!lineVersion.Branch.isCanceledSlice()) {
      var sliceRange = new DateRange(lineVersion.SliceDate, getNextSliceDateAfter(lineVersion.SliceDate))
      _logger.info("Rating CP Line Coverages")
      lineVersion.CPLocations.each( \ location -> {
        location.Buildings.each( \ building -> {
          rateCPBuilding(building, sliceRange)
          /*building.Coverages.each( \ buildingCov -> {
            rateCPBuildingCov(buildingCov, sliceRange)
          })  */
        })
      })
      _logger.info("Done Rating CP Line Coverages")
    }
  }

  override protected function createCostDataForCost(c: Cost): CostData {
    var cd: CostData
    switch (typeof c) {
      case CPBuildingCovGrp1Cost:  return new CPBuildingCovGroup1CostData(c, RateCache)
      case CPBuildingCovGrp2Cost:  return new CPBuildingCovGroup2CostData(c, RateCache)
      case CPBuildingCovSpecCost:  return new CPBuildingCovSpecialCostData(c, RateCache)
      case CPBuildingCovOtherThanHurricaneCost: return new CPBuildingCovOtherThanHurricaneCostData(c, RateCache)
      case CPBuildingCovHurricaneCost: return new CPBuildingCovHurricaneCostData(c, RateCache)
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

  function rateCPBuilding(building : CPBuilding, sliceRange : DateRange){
    var ratingStep = new CPRatingStep(PolicyLine, building, _executor, this.NumDaysInCoverageRatedTerm, RateCache)
    if(building.CPEquipmentBreakdownEnhance_EXTExists){
      addCost(ratingStep.rateGroup2(building.CPEquipmentBreakdownEnhance_EXT, sliceRange))
    }
    if(building.CPFence_ExtExists){
      addCost(ratingStep.rateGroup2(building.CPFence_Ext, sliceRange))
      addCost(ratingStep.rateGroup1(building.CPFence_Ext, sliceRange))
    }
    if(building.CPFlagPole_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPFlagPole_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPFlagPole_Ext, sliceRange))
    }
    if(building.CPEntryGates_EXTExists){
      addCost(ratingStep.rateGroup1(building.CPEntryGates_EXT, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPEntryGates_EXT, sliceRange))
    }
    if(building.CPCarport_EXTExists){
      addCost(ratingStep.rateGroup1(building.CPCarport_EXT, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPCarport_EXT, sliceRange))
    }
    if(building.CPPlayGround_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPPlayGround_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPPlayGround_Ext, sliceRange))
    }
    if(building.CPLights_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPLights_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPLights_Ext, sliceRange))
    }
    if(building.CPMailbox_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPMailbox_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPMailbox_Ext, sliceRange))
    }
    if(building.CPGazebo_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPGazebo_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPGazebo_Ext, sliceRange))
    }
    if(building.CPSigns_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPSigns_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPSigns_Ext, sliceRange))
    }
    if(building.CPOther_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPOther_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPOther_Ext, sliceRange))
    }
    if(building.CPTrash_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPTrash_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPTrash_Ext, sliceRange))
    }
    if(building.CPFurniture_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPFurniture_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPFurniture_Ext, sliceRange))
    }
    if(building.CPShade_ExtExists){
      addCost(ratingStep.rateGroup1(building.CPShade_Ext, sliceRange))
      addCost(ratingStep.rateGroup2(building.CPShade_Ext, sliceRange))
    }
  }
}
