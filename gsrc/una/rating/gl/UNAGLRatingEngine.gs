package una.rating.gl

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

class UNAGLRatingEngine extends AbstractRatingEngine<GLLine> {
  var _minimumRatingLevel: RateBookStatus
  var _executor: GLRateRoutineExecutor
  final static var _logger = UnaLoggerCategory.UNA_RATING
  var _lineRatingInfo : GLLineRatingInfo as LineRatingInfo
  private static final var CLASS_NAME = UNAGLRatingEngine.Type.DisplayName

  construct(line: GLLine) {
    this(line, RateBookStatus.TC_ACTIVE)
  }

  construct(line: GLLine, minimumRatingLevel: RateBookStatus) {
    super(line)
    _logger.info("Initializing the " + line.BaseState.Code + " GL Rating Engine")
    _minimumRatingLevel = minimumRatingLevel
    _executor = new GLRateRoutineExecutor(ReferenceDatePlugin, PolicyLine, minimumRatingLevel)
    _lineRatingInfo = new GLLineRatingInfo(PolicyLine)
    _logger.info(line.BaseState.Code + " GL Rating Engine initialized")
  }

  override function rateSlice(lineVersion: GLLine) {
    assertSliceMode(lineVersion)
    if (!lineVersion.Branch.isCanceledSlice()) {
      var sliceRange = new DateRange(lineVersion.SliceDate, getNextSliceDateAfter(lineVersion.SliceDate))
      _logger.info("Rating GL Line Coverages")
      lineVersion.GLLineCoverages.each( \ cov -> rateLineCoverages(cov, sliceRange))
      _logger.info("Done Rating GL Line Coverages")
    }
  }

  override protected function createCostDataForCost(c: Cost): CostData {
    var cd: CostData
    switch (typeof c) {
      case GLCovExposureCost:
        cd = new GLCovExposureCostData(c, RateCache)
        break
      case GLLineCovCost:
          cd = new GLLineCovCostData(c, RateCache)
          break
      default:
        throw "unknown type of cost " + typeof c
    }
    return cd
  }

  override function rateWindow(lineVersion: GLLine) {
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

  /**
   *  Function to rate the GL Line coverages
   *  @param lineCov - general liability line coverage
   *  @param sliceRange - slice range of the period
   */
  private function rateLineCoverages(lineCov : GeneralLiabilityCov, sliceRange : DateRange){
    switch(lineCov.Pattern){
      case "GLRecFacilities_EXT":
        rateRecreationalFacilitiesCoverage(lineCov, sliceRange)
        break
      case "GLCGLCov":
        rateGeneralLiabilityCoverage(lineCov, sliceRange)
        break

    }
  }

  /**
   *  Rate the Recreational facility coverage
   *  @param lineCov - general liability line coverage
   *  @param sliceRange - slice range of the period
   */
  private function rateRecreationalFacilitiesCoverage(lineCov : GeneralLiabilityCov, sliceRange : DateRange){
    if(lineCov typeis GLRecFacilities_EXT){
      if(lineCov.HasRecFacilitiesNumPlaygrounds_EXTTerm)
        addCost(ratePlaygroundLiability(lineCov, sliceRange))
      if(lineCov.HasRecFacilitiesNumDocksandBoats_EXTTerm)
        addCost(rateDocksOrBoatsLiability(lineCov, sliceRange))
      if(lineCov.HasRecFacilitiesNumFitnessCenters_EXTTerm)
        addCost(rateFitnessCentersLiability(lineCov, sliceRange))
      if(lineCov.HasRecFacilitiesNumSwimmingPools_EXTTerm)
        return
        //addCost(rateSwimmingPoolLiability(lineCov, sliceRange))
    }
  }

  /**
   *  Rate the General Liability Coverage
   *  @param lineCov - general liability line coverage
   *  @param sliceRange - slice range of the period
   */
  private function rateGeneralLiabilityCoverage(lineCov : GeneralLiabilityCov, sliceRange : DateRange){
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateGeneralLiabilityCoverage", this.IntrinsicType)
    var costData = createCostData(lineCov, sliceRange, null)
    var parameterSet = createLineParameterSet(costData)
    _executor.execute(GLRateRoutineNames.GL_GENERAL_LIABILITY_BASE_RATE_ROUTINE, lineCov, parameterSet, costData)
    costData.copyStandardColumnsToActualColumns()
    addCost(costData)
    if(_logger.DebugEnabled)
      _logger.debug("General Liability Coverage Rated Successfully", this.IntrinsicType)
  }

  /**
  *  Rate the Recreational facility - Swimming Pool
  *  @param lineCov - general liability line coverage
   *  @param sliceRange - slice range of the period
   */
  private function rateSwimmingPoolLiability(lineCov : GeneralLiabilityCov, sliceRange : DateRange) :  CostData<Cost, PolicyLine>{
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateSwimmingPoolLiability", this.IntrinsicType)
    var costData = createCostData(lineCov, sliceRange, GLCostType_Ext.TC_SWIMMINGPOOLLIABILITY)
    var parameterSet = createLineParameterSet(costData)
    _executor.execute(GLRateRoutineNames.GL_SWIMMING_POOL_LIABILITY_RATE_ROUTINE, lineCov, parameterSet, costData)
    costData.copyStandardColumnsToActualColumns()
    if(_logger.DebugEnabled)
      _logger.debug("Recreational facility - Swimming Pool Rated Successfully", this.IntrinsicType)
    return costData
  }

  /**
   *  Rate the recreational facility - Play ground
   *  @param lineCov - general liability line coverage
   *  @param sliceRange - slice range of the period
   */
  private function ratePlaygroundLiability(lineCov : GeneralLiabilityCov, sliceRange : DateRange) :  CostData<Cost, PolicyLine>{
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: ratePlaygroundLiability", this.IntrinsicType)
    var costData = createCostData(lineCov, sliceRange, GLCostType_Ext.TC_PLAYGROUNDLIABILITY)
    var parameterSet = createLineParameterSet(costData)
    _executor.execute(GLRateRoutineNames.GL_PLAYGROUND_LIABILITY_RATE_ROUTINE, lineCov, parameterSet, costData)
    costData.copyStandardColumnsToActualColumns()
    if(_logger.DebugEnabled)
      _logger.debug("Recreational facility - Play ground Rated Successfully", this.IntrinsicType)
    return costData
  }

  /**
   *  Rate the recreational facility - Docks or Boats
   *  @param lineCov - general liability line coverage
   *  @param sliceRange - slice range of the period
   */
  private function rateDocksOrBoatsLiability(lineCov : GeneralLiabilityCov, sliceRange : DateRange) :  CostData<Cost, PolicyLine>{
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateDocksOrBoatsLiability", this.IntrinsicType)
    var costData = createCostData(lineCov, sliceRange, GLCostType_Ext.TC_DOCKSORBOATSLIABILITY)
    var parameterSet = createLineParameterSet(costData)
    _executor.execute(GLRateRoutineNames.GL_DOCKS_OR_BOATS_LIABILITY_RATE_ROUTINE, lineCov, parameterSet, costData)
    costData.copyStandardColumnsToActualColumns()
    if(_logger.DebugEnabled)
      _logger.debug("Recreational facility - Docks or Boats Rated Successfully", this.IntrinsicType)
    return costData
  }

  /**
   *  Rate the recreational facility - Fitness Centers
   *  @param lineCov - general liability line coverage
   *  @param sliceRange - slice range of the period
   */
  private function rateFitnessCentersLiability(lineCov : GeneralLiabilityCov, sliceRange : DateRange) :  CostData<Cost, PolicyLine>{
    if(_logger.DebugEnabled)
      _logger.debug("Entering " + CLASS_NAME + ":: rateFitnessCentersLiability", this.IntrinsicType)
    var costData = createCostData(lineCov, sliceRange, GLCostType_Ext.TC_FITNESSCENTERSLIABILITY)
    var parameterSet = createLineParameterSet(costData)
    _executor.execute(GLRateRoutineNames.GL_FITNESS_CENTERS_LIABILITY_RATE_ROUTINE, lineCov, parameterSet, costData)
    costData.copyStandardColumnsToActualColumns()
    if(_logger.DebugEnabled)
      _logger.debug("Recreational facility - Fitness Centers Rated Successfully", this.IntrinsicType)
    return costData
  }

  /**
   * Creates the cost data for GL Coverages
   */
  private function createCostData(coverage : GeneralLiabilityCov, sliceToRate : DateRange, costType : GLCostType_Ext) : GLLineCovCostData {
    var costData = new GLLineCovCostData(sliceToRate.start, sliceToRate.end, PolicyLine.PreferredCoverageCurrency, RateCache, PolicyLine.BaseState, coverage.FixedId,
                                         null, null, costType)
    //costData.init(PolicyLine)
    costData.NumDaysInRatedTerm = this.NumDaysInCoverageRatedTerm
    return costData
  }

  /**
   * creates the parameter set for GL coverages
   */
  private function createLineParameterSet(costData : GLLineCovCostData) : Map<CalcRoutineParamName, Object>{
    return
        {TC_POLICYLINE         -> PolicyLine,
         TC_LINERATINGINFO_EXT -> _lineRatingInfo,
         TC_COSTDATA           -> costData}
  }
}
