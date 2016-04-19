package gw.lob.bp7.rating

uses gw.lob.common.util.DateRange
uses gw.rating.AbstractRatingEngine
uses gw.rating.CostData
uses java.lang.Iterable
uses java.math.RoundingMode

abstract class BP7AbstractRatingEngine<T extends BP7Line> extends AbstractRatingEngine<BP7Line> {

  construct(line : T) {
    super(line)
  }

  override function rateSlice(lineVersion : BP7Line) {
    assertSliceMode(lineVersion)      
    if (!lineVersion.Branch.isCanceledSlice()) {
      var sliceRange = new DateRange(lineVersion.SliceDate, getNextSliceDateAfter(lineVersion.SliceDate))
      
      rateLiability(lineVersion, sliceRange)
      
      lineVersion.AllBuildings.each(\ building -> {
        rateBuilding(building, sliceRange)  
      })
      
      lineVersion.AllClassifications.each(\ classification -> {
        rateClassification(classification, sliceRange)
      })
    }
  }
  
  override protected function createCostDataForCost(c : Cost) : CostData {
    var cd : CostData
    
    switch(typeof c) {
      case BP7LineCovCost:
        cd = new BP7LineCovCostData(c)
        break      
      case BP7LiabilityLessorCovCost:
        cd = new BP7LiabilityLessorCovCostData(c)
        break
      case BP7LiabilityOccupantCovCost:
        cd = new BP7LiabilityOccupantCovCostData(c)
        break
      case BP7LocationCovCost:
        cd = new BP7LocationCovCostData(c)
        break
      case BP7BuildingCovCost:
        cd = new BP7BuildingCovCostData(c)
        break
      case BP7BlanketedBuildingCovCost:
        cd = new BP7BlanketedBuildingCovCostData(c)
        break
      case BP7ClassificationCovCost:
        cd = new BP7ClassificationCovCostData(c)
        break
      case BP7BlanketedClassificationCovCost:
        cd = new BP7BlanketedClassificationCovCostData(c)
        break
      default:
        throw "unknown type of cost " + typeof c
    }
    
    return cd
  }

  override function rateWindow(lineVersion : BP7Line) {
    // for Tax
  }
  
  /******
    This default version of this method will return all of the Costs on a policy for the slice's effective date.  If some of the
    costs on a policy are created as part of the "rate window" portion of the rating algorithm (that is, they are created at the
    end for the entire period rather than created as part of rating each slice in time), then these costs should be excluded
    from what is returned by this method.  Override this method to return only the types of costs that would be created during the
    rateSlice portion of the algorithm in that case.
  ******/
  override protected function existingSliceModeCosts() : Iterable<Cost> {
    return PolicyLine.Costs
  }
  
  protected property get RoundingLevel() : int {
    return PolicyLine.Branch.Policy.Product.QuoteRoundingLevel
  }

  protected property get RoundingMode() : RoundingMode {
    return PolicyLine.Branch.Policy.Product.QuoteRoundingMode
  }

  abstract function rateLiability(line : BP7BusinessOwnersLine, sliceToRate : DateRange)
  abstract function rateBuilding(building : BP7Building, sliceToRate : DateRange)
  abstract function rateClassification(classification : BP7Classification, sliceToRate : DateRange)
  
}
