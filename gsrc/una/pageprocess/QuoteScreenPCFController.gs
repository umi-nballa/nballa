package una.pageprocess

uses java.lang.StringBuffer
uses gw.api.domain.covterm.CovTerm
uses java.math.BigDecimal
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.text.NumberFormat
uses una.model.HOCostModel

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 3/16/17
 * Time: 4:43 PM
 * To change this template use File | Settings | File Templates.
 */
class QuoteScreenPCFController {
  private static final var VIEW_CREDIT_PERMISSION = "viewcreditscore"

  public static function getPrimaryCosts(line : HomeownersLine_HOE) : List<HomeownersCost_HOE>{
    var results : List<HomeownersCost_HOE> = {}

    results.addAll(line.VersionList.HomeownersCosts.where(\ cvl -> cvl.AllVersions.first() typeis HomeownersBaseCost_HOE).flatMap(\ h -> h.AllVersions))
    results.addAll(line.AllCoverages.where( \ elt -> elt.CoverageCategory.CodeIdentifier == "HODW_SectionI_HOE" or elt.CoverageCategory.CodeIdentifier == "HODW_SectionII_HOE")*.Cost as HomeownersCost_HOE[])

    return results
  }

  public static function getPremiumDisplayValue(cost: Cost) : String{
    var result : StringBuffer

    if(cost == null or cost.ActualAmount.Amount == 0){
      result = displaykey.una.Included
    }else{
      result = cost.ActualAmount.Amount.asMoney()
    }

    return result
  }

  public static function getCostModels(coverage: Coverage) : List< HOCostModel >{
    var results : List< HOCostModel > = {}
    var dwellingCov : DwellingCov_HOE = (coverage typeis DwellingCov_HOE) ? coverage : null
    var hoLineCov : HomeownersLineCov_HOE = (coverage typeis HomeownersLineCov_HOE) ? coverage : null

    if(dwellingCov != null and dwellingCov.IsBaseCoverage){
      var baseCosts = dwellingCov.Dwelling.Branch.AllCosts?.whereTypeIs(HomeownersBaseCost_HOE)
                                        ?.partition( \ bc -> bc.Proration)
      baseCosts.eachValue( \ baseCost -> results.add(new HOCostModel(baseCost, true, dwellingCov)))
    }else{
      if(coverage.Cost != null){
        coverage.PolicyLine.Branch.AllCosts?.where( \ cost -> isCostForCoverage(cost, coverage))?.each( \ costRow ->
          results.add(new HOCostModel({costRow as HomeownersCost_HOE}, false, coverage))
        )
      }else{
        results.add(new HOCostModel(null, false, coverage))
      }
    }

    return results
  }

  public static function getAdditionalCoverageCosts(dwelling : Dwelling_HOE) : List<HomeownersCost_HOE>{
    var allOtherCosts : List<HomeownersCost_HOE>

    allOtherCosts = dwelling.VersionList.Coverages.where( \ c -> not c.AllVersions.first().CoverageCategory.Code.equals("HODW_SectionI_HOE")).flatMap(\ c -> c.Costs).flatMap(\ c -> c.AllVersions).toList()
    allOtherCosts.addAll(dwelling.HOLine.VersionList.HOLineCoverages.where(\ c -> not c.AllVersions.first().CoverageCategory.Code.equals("HODW_SectionII_HOE")).flatMap(\ c -> c.Costs).flatMap(\ c -> c.AllVersions.toList()))

    allOtherCosts.removeWhere( \ elt -> elt.IntrinsicType == HomeownersBaseCost_HOE)

    return allOtherCosts
  }

  public static function getBasePremiumDisplayValue(branch: PolicyPeriod) : String{
    return branch.AllCosts.whereTypeIs(HomeownersBaseCost_HOE)?.sum(\ c -> c.ActualAmount.Amount)?.asMoney()
  }

  public static function isCreditInputSetVisible(user : User) : boolean{
    return user.Roles*.Role*.Privileges.hasMatch( \ privilege -> privilege.Permission.Code == VIEW_CREDIT_PERMISSION)
  }

  public static function getLimitDisplayValue(covTerm: CovTerm) : String{
    var result : String
    var value : BigDecimal

    if(covTerm typeis DirectCovTerm){
      value = covTerm.Value
    }else if(covTerm typeis OptionCovTerm){
      value = covTerm.Value
    }

    if(value != null){
      if(value > 1){
        var moneyFormatter = NumberFormat.getCurrencyInstance()
        result = moneyFormatter.format(value)
      }else{
        result = covTerm.DisplayValue
      }
    }else{
      result = covTerm.DisplayValue
    }

    return result
  }

  private static function isCostForCoverage(cost : Cost, coverage : Coverage) : boolean{
    return (cost as HomeownersCost_HOE).Coverage.PatternCode == coverage.PatternCode
  }
}