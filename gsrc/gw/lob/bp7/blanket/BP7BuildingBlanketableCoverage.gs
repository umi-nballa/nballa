package gw.lob.bp7.blanket
uses java.math.BigDecimal

class BP7BuildingBlanketableCoverage extends BP7BlanketableCoverage {
  var _buildingCov : BP7BuildingCov
  
  construct(buildingCov : BP7BuildingCov, __blanket : BP7Blanket = null) {
    super(__blanket ?: buildingCov.Blanket)
    _buildingCov = buildingCov
  }
  
  override property get CoverageDescription() : String {
    return _buildingCov.DisplayName
  }
  
  override property get Limit() : BigDecimal {
    return _buildingCov.Building.BP7Structure.BP7BuildingLimitTerm.Value
  }

  override property get LimitValue() : String {
    return _buildingCov.Building.BP7Structure.BP7BuildingLimitTerm.DisplayValue
  }

  override property get Location() : BP7Location {
    return _buildingCov.Building.Location
  }

  override property get Building() : BP7Building {
    return _buildingCov.Building
  }

  override property get Classification() : BP7Classification {
    return null
  }

  override function addToBlanket(blanketToAddTo : BP7Blanket) {
    blanketToAddTo.addToBuildingBlanketedCovs(_buildingCov)
  }
  
  override property get Eligible() : boolean {
    return Building.BlanketEligible
  }
  
  override property get NumberedCoveragePath() : String {
    return displaykey.Web.Policy.BP7.Building.NumberedCoveragePath(
           _buildingCov.Building.Location.Location.LocationNum,
           _buildingCov.Building.Building.BuildingNum)
  }

  override property get CoveragePath() : String {
    return _buildingCov.Building.Location.DisplayName + ": " +
           _buildingCov.Building.DisplayName
  }
  
  override function equals(rhs : Object) : boolean {
    if(rhs typeis BP7BuildingBlanketableCoverage) {
      return _buildingCov == rhs._buildingCov
    }
    return false
  }
  
  override function hashCode() : int {
    return _buildingCov.hashCode()
  }

  override function toString(): String {
    return BuildingDescription
  }

  override function removeFromBlanket(){
    _buildingCov.Blanket = null
  }
}
