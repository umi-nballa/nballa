package gw.lob.bp7.blanket
uses java.math.BigDecimal
uses java.lang.Integer

interface BP7Blanketable {
  property get LocationNumber() : Integer
  property get BuildingNumber() : Integer
  property get ClassificationNumber() : Integer
  
  property get LocationDescription() : String
  property get BuildingDescription() : String
  property get ClassificationDescription()  : String
  property get CoverageDescription() : String
  property get NumberedCoveragePath() : String
  property get CoveragePath() : String

  property get Limit() : BigDecimal
  property get LimitValue() : String
  
  property get FontColor() : String
  property get Included() : boolean
  property set Included(value : boolean)

  property get Eligible() : boolean
}
