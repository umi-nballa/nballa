package una.rating.bp7

uses gw.lob.common.util.DateRange
uses gw.rating.AbstractRatingEngine
uses gw.rating.CostData

uses java.lang.Iterable
uses una.rating.bp7.util.RateFactorUtil
uses gw.lob.bp7.rating.BP7LineCovCostData
uses gw.lob.bp7.rating.BP7LocationCovCostData
uses gw.lob.bp7.rating.BP7BuildingCovCostData
uses gw.lob.bp7.rating.BP7ClassificationCovCostData
uses gw.lob.bp7.rating.BP7TaxCostData_Ext
uses java.util.ArrayList
uses una.rating.bp7.ratinginfos.BP7RatingInfo

abstract class UNABP7AbstractRatingEngine<T extends BP7Line> extends AbstractRatingEngine<BP7Line> {

  var _bp7RatingInfo : BP7RatingInfo as BP7RatingInfo
  var _minimumRatingLevel: RateBookStatus as MinimumRatingLevel

  construct(line: T) {
    super(line)
  }

  override function rateSlice(lineVersion: BP7Line) {
    assertSliceMode(lineVersion)
    if (!lineVersion.Branch.isCanceledSlice()) {
      var sliceRange = new DateRange(lineVersion.SliceDate, getNextSliceDateAfter(lineVersion.SliceDate))
      RateFactorUtil.setDefaults()
      var primaryLocation = lineVersion.Branch.PrimaryLocation
      RateFactorUtil.FirstBuilding = lineVersion.BP7Locations.where( \ elt -> elt.Location == primaryLocation).first().Buildings.where( \ building -> building.Building.BuildingNum == 1).first()
      _bp7RatingInfo.NetAdjustmentFactor = RateFactorUtil.setNetAdjustmentFactor(PolicyLine, _minimumRatingLevel)

      lineVersion.BP7LineCoverages?.each(\lineCov -> rateLineCoverage(lineCov, sliceRange))

      lineVersion.BP7Locations.each( \ location -> {
        location.Coverages?.each(\locationCov -> rateLocationCoverage(locationCov, sliceRange))
        location.Buildings?.each(\building -> {
          rateBuilding(building, sliceRange)
          building.Classifications.each(\classification -> rateClassification(classification, sliceRange))
        })
      })
      /*
      lineVersion.AllBuildings.each(\building -> {
        rateBuilding(building, sliceRange)
      })

      lineVersion.BP7LineCoverages?.each(\lineCov -> rateLineCoverage(lineCov, sliceRange))

      lineVersion.BP7Locations*.Coverages?.each(\locationCov -> rateLocationCoverage(locationCov, sliceRange))
      rateLiability(lineVersion, sliceRange)

      lineVersion.AllClassifications.each(\classification -> {
        rateClassification(classification, sliceRange)
      })*/

      var terrorismCov = lineVersion.BP7LineCoverages?.where( \ cov -> cov.PatternCode == "BP7CapLossesFromCertfdActsTerrsm").first()
      if(terrorismCov != null){
        rateTerrorismCoverage(terrorismCov as BP7CapLossesFromCertfdActsTerrsm, sliceRange)
      }

      //Add the minimum premium adjustment, if the total premium is less than minimum premium
      rateManualPremiumAdjustment(sliceRange)
    }
  }

  override protected function createCostDataForCost(c: Cost): CostData {
    var cd: CostData
    switch (typeof c) {
      case BP7LineCovCost:
        cd = new BP7LineCovCostData(c)
        break
      case BP7LocationCovCost:
        cd = new BP7LocationCovCostData(c)
        break
      case BP7BuildingCovCost:
        cd = new BP7BuildingCovCostData(c)
        break
      case BP7ClassificationCovCost:
        cd = new BP7ClassificationCovCostData(c)
        break
      case BP7TaxCost_Ext:
        cd = new BP7TaxCostData_Ext(c)
        break
      default:
        throw "unknown type of cost " + typeof c
    }
    return cd
  }

  override function rateWindow(lineVersion: BP7Line) {
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
      if (cost typeis BP7TaxCost_Ext){
        continue
      }
      costsWithNoWindowCosts.add(cost)
    }
    return costsWithNoWindowCosts
  }

  abstract function rateLineCoverage(lineCov: BP7LineCov, sliceToRate: DateRange)

  abstract function rateLocationCoverage(location: BP7LocationCov, sliceToRate: DateRange)

  abstract function rateLiability(line : BP7BusinessOwnersLine, sliceToRate : DateRange)

  abstract function rateBuilding(building: BP7Building, sliceToRate: DateRange)

  abstract function rateClassification(classification: BP7Classification, sliceToRate: DateRange)

  abstract function rateTerrorismCoverage(lineCov: BP7CapLossesFromCertfdActsTerrsm, sliceToRate: DateRange)

  abstract function rateManualPremiumAdjustment(sliceRange : DateRange)

  abstract function ratePolicyFee(lineVersion: BP7Line)

  abstract function rateEMPASurcharge(lineVersion: BP7Line)
}
