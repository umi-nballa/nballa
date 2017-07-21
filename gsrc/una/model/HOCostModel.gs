package una.model

uses java.math.BigDecimal
uses java.util.Date
uses gw.api.domain.covterm.DirectCovTerm
uses java.lang.Double
uses gw.api.domain.covterm.OptionCovTerm
uses gw.entity.IEntityType
uses gw.api.domain.covterm.CovTerm

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 3/26/17
 * Time: 8:18 PM
 * To change this template use File | Settings | File Templates.
 */
class HOCostModel {
  private var _costs : List<HomeownersCost_HOE>
  private var _coverage : Coverage
  private var _isBaseCost : boolean
  private var _branch : PolicyPeriod

  construct(costs: List<HomeownersCost_HOE>, isBaseCost : boolean, coverage : Coverage){
    this._costs = costs //costs is an array to accommodate base costs of which there can be multiple
    _isBaseCost = isBaseCost
    _coverage = coverage

    this._branch = _coverage.PolicyLine.Branch
  }

  property get Premium() : BigDecimal{
    return this._costs?.sum(\ bc -> bc.ActualAmount.Amount)
  }

  property get PremiumDisplayValue() : String{
    var premium = Premium

    if(premium != null and premium != 0bd){
      return premium?.asMoney()
    }else{
      return displaykey.una.Included
    }
  }

  property get ProrationDisplayValue() : String{
    var result : String

    if(Proration != null){
      result = gw.api.util.StringUtil?.formatNumber(Proration, "#0.0000")
    }

    return result
  }

  property get LimitValue() : BigDecimal{
    var result : BigDecimal

    if(_costs.HasElements){
      //finds all policy periods with a valid status where the effective date is the same as this base cost effective date.  Provides the latest ID in the BasedOn chain.
      var eligiblePeriods = _branch.Policy.Periods.where( \ elt -> elt.EditEffectiveDate.equalsIgnoreTime(EffectiveDate)
          and (PolicyPeriodStatus.TF_OPEN.TypeKeys.contains(elt.Status)
            or PolicyPeriodStatus.TF_POSTED.TypeKeys.contains(elt.Status)
          ))
      result =  eligiblePeriods.orderByDescending(\ period -> period.ID).first().HomeownersLine_HOE.AllCoverages?.atMostOneWhere( \ elt -> elt.PatternCode == Coverage.PatternCode).LimitTerm.BigDecimalValue
    }else{
      result = Coverage.LimitTerm.BigDecimalValue
    }

    return result
  }

  property get LimitDisplayValue() : String{
    return LimitValue?.asMoney()
  }

  property get Proration() : Double{
    var result : Double

    if(this._costs.HasElements){
      result = this._costs?.first().Proration
    }

    return result
  }

  property get EffectiveDate() : Date{
    var result : Date

    if(_costs.HasElements){
      return this._costs?.first().EffectiveDate
    }

    return result
  }

  property get ExpirationDate() : Date{
    var result : Date

    if(_costs.HasElements){
      result = this._costs?.first().ExpirationDate
    }

    return result
  }

  property get Coverage() : Coverage{
    var result : Coverage

    if(_isBaseCost){
      if(_branch.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOEExists){
        result = _branch.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE
      }else if(_branch.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOEExists){
        result = _branch.HomeownersLine_HOE.Dwelling.DPDW_Dwelling_Cov_HOE
      }else{
        result = _branch.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE
      }
    }else{
      result = this._coverage
    }

    return result
  }
}