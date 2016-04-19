package gw.lob.bp7.rating

uses gw.api.database.Query
uses gw.lang.reflect.features.PropertyReference
uses java.lang.Integer
uses java.math.BigDecimal
uses java.math.RoundingMode

abstract class BP7AbstractRater {
  
  protected var _ratingEngine : BP7SysTableRatingEngine

  private function getRateNumber(classCode : String) : Integer {
    var query = Query.make(BP7RateNumber)
    query.compare(BP7RateNumber#ClassCode.PropertyInfo.Name, Equals, classCode)    
    var rateNumber = BP7RateNumber#RateNumber.get(query.select().AtMostOneRow)
    return rateNumber
  }
  
  protected function getRateNumberRelativityFactor(classCode : String) : BigDecimal {
    var rateNumber = getRateNumber(classCode)
    
    var query = Query.make(RateFactorTable)
    query.compare("RateNumber", Equals, rateNumber)
    
    var factor = query.select().AtMostOneRow["RateNumberFactor"] as BigDecimal
    return factor
  }
  
  protected function calculateRates(cost : BP7CostData, classCode : String, basis : BigDecimal) {
    cost.Basis = basis
    cost.NumDaysInRatedTerm = _ratingEngine.NumDaysInCoverageRatedTerm
    cost.StandardBaseRate = getBaseRate()
    cost.StandardAdjRate = (cost.StandardBaseRate
      * getRateNumberRelativityFactor(classCode)
      * getLimitRelativityFactor(cost.Basis)).setScale(3, RoundingMode.HALF_UP)

    cost.StandardTermAmount = ( cost.Basis * cost.StandardAdjRate / 100 ).setScale( _ratingEngine.RoundingLevel, _ratingEngine.RoundingMode ) 
    cost.copyStandardColumnsToActualColumns()
  }
  
  abstract protected function getLimitRelativityFactor(limit : BigDecimal) : BigDecimal
  abstract protected property get RateFactorTable() : Type
  abstract protected property get BaseRateTable() : Type
  
  protected function getBaseRate() : BigDecimal {
    var query = Query.make(BaseRateTable)
    
    return query.select().AtMostOneRow["Rate"] as BigDecimal
  }
  
  function getInterpolateFactor(results : List<Bean>, columnForProperty : PropertyReference, columnForFactor : PropertyReference, paramValue : Integer) : BigDecimal {
    var bestBelow = results.lastWhere(\ bean -> (columnForProperty.get(bean) as BigDecimal) <= paramValue)
    var bestAbove = results.firstWhere(\ bean -> (columnForProperty.get(bean) as BigDecimal) >= paramValue)

    if (bestBelow == null or bestAbove == null) {
      return null // can't interpolate unless we find both!!
    }

    var loParam = columnForProperty.get(bestBelow) as BigDecimal
    var loFactor = columnForFactor.get(bestBelow) as BigDecimal
    var hiParam = columnForProperty.get(bestAbove) as BigDecimal
    var hiFactor = columnForFactor.get(bestAbove) as BigDecimal
    
    if (hiParam == loParam) return loFactor

    return loFactor + (hiFactor - loFactor) * (paramValue - loParam) / (hiParam - loParam)
  }

}
