package gw.lob.bp7.blanket
uses java.math.BigDecimal

class BP7ClassificationBlanketableCoverage extends BP7BlanketableCoverage  {
  var _classificationCov : BP7ClassificationCov
  
  construct(classificationCov : BP7ClassificationCov, __blanket : BP7Blanket = null) {
    super(__blanket ?: classificationCov.Blanket)
    _classificationCov = classificationCov
  }
  
  override property get CoverageDescription() : String {
    return _classificationCov.DisplayName
  }
  
  override property get Limit() : BigDecimal {
    return _classificationCov.Classification.BP7ClassificationBusinessPersonalProperty.BP7BusnPrsnlPropLimitTerm.Value
  }

  override property get LimitValue() : String {
    return _classificationCov.Classification.BP7ClassificationBusinessPersonalProperty.BP7BusnPrsnlPropLimitTerm.DisplayValue
  }

  override property get Location() : BP7Location {
    return _classificationCov.Classification.Building.Location
  }

  override property get Building() : BP7Building {
    return _classificationCov.Classification.Building
  }

  override property get Classification(): BP7Classification {
    return _classificationCov.Classification
  }

  override function removeFromBlanket() {
    _classificationCov.Blanket = null
  }

  override function addToBlanket(blanketToAddTo : BP7Blanket) {
    blanketToAddTo.addToClassificationBlanketedCovs(_classificationCov)
  }

  override property get Eligible() : boolean {
    return Classification.BlanketEligible
  }

  override property get NumberedCoveragePath() : String {
    return displaykey.Web.Policy.BP7.Classification.NumberedCoveragePath(
           _classificationCov.Classification.Building.Location.Location.LocationNum,
           _classificationCov.Classification.Building.Building.BuildingNum,
           _classificationCov.Classification.ClassificationNumber)
  }

  override property get CoveragePath() : String {
    return _classificationCov.Classification.Building.Location.DisplayName + ": "+
           _classificationCov.Classification.Building.DisplayName + ": " +
           _classificationCov.Classification.DisplayName
  }

  override function equals(rhs : Object) : boolean {
    if(rhs typeis BP7ClassificationBlanketableCoverage) {
      return _classificationCov == rhs._classificationCov
    }
    return false
  }
  
  override function hashCode() : int {
    return _classificationCov.hashCode()
  }
  
  override function toString() : String {
    return BuildingDescription + " " + ClassificationDescription
  }
}
