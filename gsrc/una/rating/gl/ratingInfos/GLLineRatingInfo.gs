package una.rating.gl.ratingInfos

uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 2/7/17
 */
class GLLineRatingInfo {
  var _numOfSwimmingPools: int as NumOfSwimmingPools
  var _numOfPlaygrounds: int as NumOfPlaygrounds
  var _occurrenceLimit: int as OccurrenceLimit
  private var _line: GeneralLiabilityLine as Line
  var _numOfDucksAndBoats : int as NumOfDucksAndBoats
  var _numOfFitnessCenters : int as NumOfFitnessCenters
  var _glAggregateLimit : int as GLAggregateLimit
  var _territoryCode : String as TerritoryCode
  var _riskType : PackageRisk as RiskType

  construct(line: GeneralLiabilityLine) {
    _line = line
    _occurrenceLimit = line.GLCGLCov?.GLCGLOccLimitTerm?.Value?.intValue()
    _glAggregateLimit = line.GLCGLCov?.GLCGLAggLimitTerm?.Value?.intValue()
    _territoryCode = line.Branch?.PrimaryLocation?.TerritoryCodes.where( \ elt -> elt.PolicyLinePatternCode=="GLLine").first().Code
    _riskType = line.Branch?.Policy.PackageRisk

    if (line.GLRecFacilities_EXTExists){
      _numOfSwimmingPools = line.GLRecFacilities_EXT?.RecFacilitiesNumSwimmingPools_EXTTerm?.Value?.intValue()
      _numOfPlaygrounds = line.GLRecFacilities_EXT?.RecFacilitiesNumPlaygrounds_EXTTerm?.Value?.intValue()
      _numOfDucksAndBoats = line.GLRecFacilities_EXT?.RecFacilitiesNumDocksandBoats_EXTTerm?.Value?.intValue()
      _numOfFitnessCenters = line.GLRecFacilities_EXT?.RecFacilitiesNumFitnessCenters_EXTTerm?.Value?.intValue()
    }
  }

  property get ScheduledRatingModifier(): BigDecimal {
    var scheduledRatingModifierFactor: BigDecimal = 1.0
    var modifiers = _line.Modifiers
    var scheduledRate = modifiers.where(\m -> m.ScheduleRate)
    var rateFactors = scheduledRate*.RateFactors
    for (factor in rateFactors) {
      scheduledRatingModifierFactor += factor.AssessmentWithinLimits
    }
    return scheduledRatingModifierFactor
  }
}