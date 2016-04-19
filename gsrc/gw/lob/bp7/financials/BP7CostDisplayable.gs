package gw.lob.bp7.financials
uses java.util.Date
uses java.math.BigDecimal

interface BP7CostDisplayable {
  property get Qualifier() : BP7Qualifier
  property get CostProrated() : boolean
  property get DisplayLocation() : BP7Location
  property get DisplayDescription() : String
  property get DisplayCoverageName() : String
 
  property get DisplayEffectiveDate() : Date
  property get DisplayExpirationDate() : Date
  property get DisplayBasis() : BigDecimal
  property get DisplayProration() : double

  property get DisplayActualBaseRate() : BigDecimal
  property get DisplayActualAdjRate() : BigDecimal
  property get DisplayActualAmount() : BigDecimal
  property get DisplayActualTermAmount() : BigDecimal

  property get DisplayBlanketed() : boolean
  property get DisplayBlanket() : String
  function isEffective(effectiveDate : Date) : boolean

  property get DisplayCostID() : Key
  property get RelatedWorksheetCost() : BP7CostDisplayable
  property get AssociatedBlanket() : BP7Blanket
}

