package gw.lob.ho.rating

uses java.util.ArrayList
uses java.math.BigDecimal

/**
 * Data class used to transfer coverage-cost data to the quote page
 * In the additional coverages section, the quote page shows 3 kind of coverages:
 * - regular coverages, they may have cov terms
 * - special coverages with coverage level costs and special details (no cov terms)
 * - special coverages with special details (no cov terms) and detail (low) level costs
 */
class CoverageCostData_HOE {

  // costructor with the coverage and the coverage level cost
  construct(cov: Coverage, c: HomeownersCost_HOE) {
    _coverage = cov
    _cost = c
    _details = new ArrayList<NameValueCostData_HOE>()
  }
  
/**
 * getters and setters
 */
  property get Coverage() : Coverage{
    return _coverage
  }
  
  property get Cost() : HomeownersCost_HOE{
    return _cost
  }
  
  property get Details() : List<NameValueCostData_HOE>{
    return _details
  }

  property get SpecialCoverage() : boolean{
    return _isSpecialCoverage
  }

  property set SpecialCoverage(isSpecial: boolean){
    _isSpecialCoverage = isSpecial
  }

  property get LowLevelCost() : boolean{
    return _isLowLevelCosted
  }

  property set LowLevelCost(isLowLevel: boolean){
    _isLowLevelCosted = isLowLevel
  }
  
/**
 * Calculates the total cost per coverage
 */
  property get TotalCost(): BigDecimal{
    var total = 0bd.ofDefaultCurrency()
    if(_isLowLevelCosted){
      _details.each(\ d -> {total += d.cost.ActualAmount})
    }else{
      total = _cost.ActualAmount
    }
    
    return total
  }

  // coverage that appears in the quote page  
  var _coverage: Coverage
  
  // coverage level cost
  var _cost: HomeownersCost_HOE
  
  // details for special coverages
  var _details: List<NameValueCostData_HOE>
  
  // true if this corresponds to a special coverage
  var _isSpecialCoverage: boolean
  
  // true if the cost is at a lower level than the coverage
  var _isLowLevelCosted: boolean

}
