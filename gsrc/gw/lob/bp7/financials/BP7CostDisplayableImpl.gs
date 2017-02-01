package gw.lob.bp7.financials

uses java.util.Date
uses java.math.BigDecimal

class BP7CostDisplayableImpl implements BP7CostDisplayable {
  var _cost : BP7Cost

  construct(cost : BP7Cost) {
    _cost = cost
  }

  override property get DisplayLocation() : BP7Location {
    switch(typeof _cost) {
      case BP7LiabilityLessorCovCost:
        return _cost.AssociatedBuilding.Location
      case BP7LiabilityOccupantCovCost:
        return _cost.AssociatedClassification.Building.Location
      case BP7BuildingCovCost:
        return _cost.Building.Location
      case BP7BlanketedBuildingCovCost:
        return _cost.Building.Location
      case BP7ClassificationCovCost:
        return _cost.Classification.Building.Location
      case BP7BlanketedClassificationCovCost:
        return _cost.Classification.Building.Location
      case BP7LocationCovCost:
          return _cost.Location
      default:
        throw "unknown cost type " + typeof _cost
    }
  }

  override property get Qualifier() : BP7Qualifier {
    return _cost.CostQualifier
  }

  override property get CostProrated() : boolean {
    return _cost.Prorated
  }

  override property get DisplayDescription() : String {
    switch(typeof _cost) {
      case BP7LiabilityLessorCovCost:
        return _cost.AssociatedBuilding.DisplayName
      case BP7LiabilityOccupantCovCost:
        return _cost.AssociatedClassification.Building.DisplayName + ": " +
               _cost.AssociatedClassification.DisplayName
      case BP7BuildingCovCost:
        return _cost.Building.DisplayName
      case BP7BlanketedBuildingCovCost:
        return _cost.Building.DisplayName
      case BP7ClassificationCovCost:
        return _cost.Classification.Building.DisplayName + ": " +
               _cost.Classification.DisplayName
      case BP7BlanketedClassificationCovCost:
        return _cost.Classification.Building.DisplayName + ": " +
               _cost.Classification.DisplayName
      case BP7LineCovCost:
          return _cost.Line.DisplayName
      case BP7LocationCovCost:
          return _cost.Location.DisplayName
      case BP7TaxCost_Ext:
          return _cost.ChargePattern.DisplayName
        default:
        throw "unknown cost type " + typeof _cost
    }
  }

  override property get DisplayBlanketed() : boolean {
    return _cost typeis BP7BlanketedBuildingCovCost
        || _cost typeis BP7BlanketedClassificationCovCost
  }
  
  override property get DisplayCoverageName() : String {
    if(_cost typeis BP7LineCovCost){
      if(_cost.BP7CostType != null){
        if(_cost.BP7CostType == BP7CostType_Ext.TC_ORDINANCEORLAWCOVERAGE1 || _cost.BP7CostType == BP7CostType_Ext.TC_ORDINANCEORLAWCOVERAGE2 ||
           _cost.BP7CostType == BP7CostType_Ext.TC_ORDINANCEORLAWCOVERAGE3){
          return _cost.BP7CostType.Description
        }
        return _cost.Coverage.DisplayName + " - " + _cost.BP7CostType.Description
      }
    }
    if(_cost typeis BP7TaxCost_Ext)
      return ""
    return _cost.Coverage.DisplayName
  }
  
  override property get DisplayEffectiveDate() : Date {
    return _cost.EffectiveDate
  }

  override property get DisplayExpirationDate() : Date {
    return _cost.ExpirationDate
  }

  override property get DisplayActualAdjRate() : BigDecimal {
    return _cost.ActualAdjRate
  }

  override property get DisplayActualBaseRate() : BigDecimal {
    return _cost.ActualBaseRate
  }

  override property get DisplayBasis() : BigDecimal {
    return _cost.Basis
  }

  override property get DisplayActualAmount() : BigDecimal {
    return _cost.ActualAmount
  }
  
  override property get DisplayActualTermAmount() : BigDecimal {
    return _cost.ActualTermAmount
  }

  override property get DisplayProration() : double {
    return _cost.Proration
  }

  override property get DisplayBlanket() : String {
    switch(typeof _cost) {
      case BP7BlanketedBuildingCovCost:
        return _cost.BuildingBlanket.BlanketType.DisplayName
      case BP7BlanketedClassificationCovCost:
        return _cost.ClassificationBlanket.BlanketType.DisplayName
      default:
        throw "unknown cost type " + typeof _cost
    }
  }

  override function isEffective(effectiveDate : Date) : boolean {
    return _cost.isEffective(effectiveDate)
  }

  override property get DisplayCostID() : Key {
    return _cost.ID
  }

  override property get RelatedWorksheetCost(): BP7CostDisplayable {
    var relatedCost = _cost
    while (relatedCost.RatingWorksheet == null and relatedCost.BasedOn != null) {
      relatedCost = relatedCost.BasedOn
    }
    return relatedCost
  }

  override property get AssociatedBlanket(): BP7Blanket {
    switch(typeof _cost) {
      case BP7BlanketedBuildingCovCost:
          return _cost.BuildingBlanket
      case BP7BlanketedClassificationCovCost:
          return _cost.ClassificationBlanket
        default:
        throw "unknown cost type " + typeof _cost
    }
  }
}
