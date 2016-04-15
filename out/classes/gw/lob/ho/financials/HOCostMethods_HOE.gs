package gw.lob.ho.financials

/**
 * Additional methods and properties provided by the costs that supply this interface.
 */

@Export
interface HOCostMethods_HOE {
  property get Coverage() : Coverage
  property get Dwelling() : Dwelling_HOE
  property get State() : Jurisdiction
  property get Location() : PolicyLocation
}
