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
uses una.rating.cp.costdatas.CPBuildingCovOtherThanHurricaneCostData
uses una.rating.cp.costdatas.CPBuildingCovHurricaneCostData
uses una.rating.cp.common.CPBuildingRatingStep
uses una.rating.cp.util.CPRatingUtil
uses una.rating.cp.costdatas.CPLineCovGroup1CostData
uses una.rating.cp.common.CPLineRatingStep
uses gw.lob.cp.rating.CPStateTaxCostData
uses java.util.Map
uses una.rating.cp.common.CPRateRoutineNames
uses java.util.ArrayList
uses gw.lob.cp.rating.CPBuildingCovCostData
uses java.math.BigDecimal

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
      rateCPLine(lineVersion, sliceRange)
      _logger.info("Done Rating CP Line Coverages")
      lineVersion.CPLocations.each( \ location -> {
        location.Buildings.each( \ building -> {
          _logger.info("Rating CP Building Coverages")
          rateCPBuilding(building, sliceRange)
          /*building.Coverages.each( \ buildingCov -> {
            rateCPBuildingCov(buildingCov, sliceRange)
          })  */
          _logger.info("Done Rating CP Building Coverages")
        })
      })

    }
  }

  override protected function createCostDataForCost(c: Cost): CostData {
    var cd: CostData
    switch (typeof c) {
      case CPLineCovGrp1Cost : return new CPLineCovGroup1CostData(c, RateCache)
      case CPBuildingCovGrp1Cost:  return new CPBuildingCovGroup1CostData(c, RateCache)
      case CPBuildingCovGrp2Cost:  return new CPBuildingCovGroup2CostData(c, RateCache)
      case CPBuildingCovSpecCost:  return new CPBuildingCovSpecialCostData(c, RateCache)
      case CPBuildingCovOtherThanHurricaneCost: return new CPBuildingCovOtherThanHurricaneCostData(c, RateCache)
      case CPBuildingCovHurricaneCost: return new CPBuildingCovHurricaneCostData(c, RateCache)
      case CPStateTaxCost : return new CPStateTaxCostData(c, RateCache)
      default:
        throw "unknown type of cost " + typeof c
    }
  }

  override function rateWindow(lineVersion: CPLine) {
    // for Tax
    assertSliceMode(lineVersion)
    ratePolicyFee(lineVersion)
    rateEMPASurcharge(lineVersion)
  }

  /******
      This default version of this method will return all of the Costs on a policy for the slice's effective date.  If some of the
      costs on a policy are created as part of the "rate window" portion of the rating algorithm (that is, they are created at the
      end for the entire period rather than created as part of rating each slice in time), then these costs should be excluded
      from what is returned by this method.  Override this method to return only the types of costs that would be created during the
      rateSlice portion of the algorithm in that case.
   ******/
  override protected function existingSliceModeCosts(): Iterable<Cost> {
    var costs = PolicyLine.Costs
    var costsWithNoWindowCosts = new ArrayList<Cost>()
    for (cost in costs) {
      if (cost typeis CPStateTaxCost){
        continue
      }
      costsWithNoWindowCosts.add(cost)
    }
    return costsWithNoWindowCosts
  }

  /**
  *  Function to rate the CP Line coverages
   */
  function rateCPLine(line : CPLine, sliceRange : DateRange){
    var ratingStep = new CPLineRatingStep (PolicyLine, _executor, this.NumDaysInCoverageRatedTerm, RateCache)
    if(line.CPTerrorismCoverage_EXTExists)
      addCosts(ratingStep.rateLineCoverage(line.CPTerrorismCoverage_EXT, sliceRange))
  }

  /**
   *  Function to rate the CP Building coverages
   */
  function rateCPBuilding(building : CPBuilding, sliceRange : DateRange){
    var ratingStep = new CPBuildingRatingStep (PolicyLine, building, _executor, this.NumDaysInCoverageRatedTerm, RateCache)
    var windStormApplicable = (!PolicyLine.CPWindorHailExclusion_EXTExists)
    var hurricaneIncluded = (PolicyLine.hurricanepercded?.Code != CPHurricanePercDed_Ext.TC_HURRICANEDEDNOTAPPLICABLE_EXT)

    if(building.CPBldgCovExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPBldgCov, sliceRange))
      if(windStormApplicable){
        if(hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPBldgCov, sliceRange))
      }
    }
    if(building.CPBPPCovExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPBPPCov, sliceRange))
      if(windStormApplicable){
        if(hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPBPPCov, sliceRange))
      }
    }
    if(building.CPOrdinanceorLaw_EXTExists){
      addCosts(ratingStep.rateOrdinanceOrLawCoverage(building.CPOrdinanceorLaw_EXT, sliceRange, windStormApplicable, hurricaneIncluded))
    }
    if(building.CPEquipmentBreakdownEnhance_EXTExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPEquipmentBreakdownEnhance_EXT, sliceRange))
    }
    if(building.CPFence_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPFence_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPFence_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPFence_Ext, sliceRange))
      }
    }
    if(building.CPFlagPole_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPFlagPole_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPFlagPole_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPFlagPole_Ext, sliceRange))
      }
    }
    if(building.CPEntryGates_EXTExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPEntryGates_EXT, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPEntryGates_EXT, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPEntryGates_EXT, sliceRange))
      }
    }
    if(building.CPCarport_EXTExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPCarport_EXT, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPCarport_EXT, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPCarport_EXT, sliceRange))
      }
    }
    if(building.CPPlayGround_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPPlayGround_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPPlayGround_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPPlayGround_Ext, sliceRange))
      }
    }
    if(building.CPLights_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPLights_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPLights_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPLights_Ext, sliceRange))
      }
    }
    if(building.CPMailbox_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPMailbox_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPMailbox_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPMailbox_Ext, sliceRange))
      }
    }
    if(building.CPGazebo_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPGazebo_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPGazebo_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPGazebo_Ext, sliceRange))
      }
    }
    if(building.CPSigns_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPSigns_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPSigns_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPSigns_Ext, sliceRange))
      }
    }
    if(building.CPOther_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPOther_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPOther_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPOther_Ext, sliceRange))
      }
    }
    if(building.CPTrash_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPTrash_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPTrash_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPTrash_Ext, sliceRange))
      }
    }
    if(building.CPFurniture_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPFurniture_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPFurniture_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPFurniture_Ext, sliceRange))
      }
    }
    if(building.CPShade_ExtExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPShade_Ext, sliceRange))
      if(windStormApplicable){
        if(!hurricaneIncluded)
          addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPShade_Ext, sliceRange))
        else
          addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPShade_Ext, sliceRange))
      }
    }
    if(building.CPPoolSpaFountainDeck_EXTExists){
      addCosts(ratingStep.rateBuildingCoverageWithGroupRates(building.CPPoolSpaFountainDeck_EXT, sliceRange))
        if(windStormApplicable){
          if(!hurricaneIncluded)
            addCost(ratingStep.rateBuildingCoverageWithNoHurricane(building.CPPoolSpaFountainDeck_EXT, sliceRange))
          else
            addCost(ratingStep.rateBuildingCoverageWithHurricane(building.CPPoolSpaFountainDeck_EXT, sliceRange))
        }
    }
  }

  /**
   * rate the EMPA Surcharge
   */
  function rateEMPASurcharge(line: CPLine){
    var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
    var costData = new CPStateTaxCostData(dateRange.start,dateRange.end,line.PreferredCoverageCurrency, RateCache, line.BaseState, ChargePattern.TC_EMPASURCHARGE_EXT)
    costData.init(line)
    costData.NumDaysInRatedTerm = NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_COSTDATA   -> costData
    }
    _executor.executeBasedOnSliceDate(CPRateRoutineNames.CP_EMPA_SURCHARGE_RATE_ROUTINE, rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
    costData.StandardAmount = costData.StandardTermAmount
    costData.ActualAmount = costData.StandardAmount
    costData.copyStandardColumnsToActualColumns()
    addCost(costData)
  }

  /**
   * rate the policy fee
   */
  function ratePolicyFee(line: CPLine){
    var dateRange = new DateRange(line.Branch.PeriodStart, line.Branch.PeriodEnd)
    var costData = new CPStateTaxCostData(dateRange.start,dateRange.end,line.PreferredCoverageCurrency, RateCache, line.BaseState, ChargePattern.TC_POLICYFEES_EXT)
    costData.init(line)
    costData.NumDaysInRatedTerm = NumDaysInCoverageRatedTerm
    var rateRoutineParameterMap: Map<CalcRoutineParamName, Object> = {
        TC_POLICYLINE -> PolicyLine,
        TC_COSTDATA   -> costData
    }
    _executor.executeBasedOnSliceDate(CPRateRoutineNames.CP_POLICY_FEES_RATE_ROUTINE, rateRoutineParameterMap, costData, dateRange.start, dateRange.end)
    costData.StandardAmount = costData.StandardTermAmount
    costData.ActualAmount = costData.StandardAmount
    costData.copyStandardColumnsToActualColumns()
    addCost(costData)
  }

  /**
  *  Returns total building Premium
   */
  private function totalBuildingPremium() : BigDecimal{
    var totalBuildingPremium  : BigDecimal = 0.0
    for(costData in CostDatas){
      if(costData typeis CPBuildingCovCostData){
        var costEntity = costData.getPopulatedCost(PolicyLine)
        if(costEntity.Coverage.PatternCode == "CPBldgCov")
          totalBuildingPremium += costData.ActualTermAmount
      }
    }
    return totalBuildingPremium
  }

  /**
   * Returns total Contents Premium
   */
  private function totalContentsPremium() : BigDecimal{
    var totalContentsPremium  : BigDecimal = 0.0
    for(costData in CostDatas){
      if(costData typeis CPBuildingCovCostData){
        var costEntity = costData.getPopulatedCost(PolicyLine)
        if(costEntity.Coverage.PatternCode == "CPBPPCov")
          totalContentsPremium += costData.ActualTermAmount
      }
    }
    return totalContentsPremium
  }
}
