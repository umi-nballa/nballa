package una.integration.mapping.hpx

uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/1/16
 * Time: 5:14 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCoverageMapper {
  function createLimit(amount : double, covTermCode : String) : wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var limitCode = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    limitCode.setText(covTermCode)
    limit.addChild(limitCode)
    var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    amt.setText(amount)
    currentTermAmount.addChild(amt)
    limit.addChild(currentTermAmount)
    return limit
  }

  function createDeductibleAmount(amount : double, covTermCode : String) : wsi.schema.una.hpx.hpx_application_request.Deductible {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.Deductible()
    var deductibleCode = new wsi.schema.una.hpx.hpx_application_request.DeductibleDesc()
    deductibleCode.setText(covTermCode)
    deductible.addChild(deductibleCode)
    var formatCurrencyAmount = new wsi.schema.una.hpx.hpx_application_request.FormatCurrencyAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    amt.setText(amount)
    formatCurrencyAmount.addChild(amt)
    deductible.addChild(formatCurrencyAmount)
    return deductible
  }

  function createDeductiblePercentage(amount : double, covTermCode : String) : wsi.schema.una.hpx.hpx_application_request.Deductible {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.Deductible()
    var deductibleCode = new wsi.schema.una.hpx.hpx_application_request.DeductibleDesc()
    deductibleCode.setText(covTermCode)
    deductible.addChild(deductibleCode)
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    formatPct.setText(amount)
    deductible.addChild(formatPct)
    return deductible
  }

  function createCoverageWithLimits(limits : List<wsi.schema.una.hpx.hpx_application_request.Limit>, covCode : String) : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var coverageCode = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    coverageCode.setText(covCode)
    cov.addChild(coverageCode)
    for (limit in limits) {
      cov.addChild(limit)
    }
    return cov
  }

  function createCoverageWithDeductibles(deductibles : List<wsi.schema.una.hpx.hpx_application_request.Deductible>, covCode : String) : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var coverageCode = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    coverageCode.setText(covCode)
    cov.addChild(coverageCode)
    for (deductible in deductibles) {
      cov.addChild(deductible)
    }
    return cov
  }

  function createCoverageWithLimitsAndDeductibles(limits : List<wsi.schema.una.hpx.hpx_application_request.Limit>,
                                                  deductibles : List<wsi.schema.una.hpx.hpx_application_request.Deductible>, covCode : String) : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var coverageCode = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    coverageCode.setText(covCode)
    cov.addChild(coverageCode)
    for (limit in limits) {
      cov.addChild(limit)
    }
    for (deductible in deductibles) {
      cov.addChild(deductible)
    }
    return cov
  }

  /************************************** Coverage  ******************************************************/
  function createCoverage(coverage : Coverage) : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var coverageCode = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    coverageCode.setText(coverage.PatternCode)
    cov.addChild(coverageCode)
    var covTerms = coverage.CovTerms
    for (covTerm in covTerms) {
      var formatCurrencyAmt = new wsi.schema.una.hpx.hpx_application_request.FormatCurrencyAmt()
      var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
      var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      var deductible = new wsi.schema.una.hpx.hpx_application_request.Deductible()
      var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
      var deductibleDesc = new wsi.schema.una.hpx.hpx_application_request.DeductibleDesc()
      var value = -1.00
      if(covTerm typeis DirectCovTerm){
        value = covTerm.Value
      } else if (covTerm typeis OptionCovTerm) {
        value = covTerm.Value
      }
      if (value != "" and value >= 0) {
        if (covTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
          var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
          var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
          var pct = new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP)
          amt.setText(pct)
          limitDesc.setText(covTerm.PatternCode)
          currentTermAmount.addChild(amt)
          limit.addChild(currentTermAmount)
          limit.addChild(limitDesc)
          cov.addChild(limit)
        } else if (covTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE) {
          if(value <= 1) {
            var pct = new BigDecimal(value*100.00).setScale(2, BigDecimal.ROUND_HALF_UP)
            formatPct.setText(pct.setScale(2).asString())
            deductible.addChild(formatPct)
            amt.setText(0.00)
            formatCurrencyAmt.addChild(amt)
            deductible.addChild(formatCurrencyAmt)
          }
          else {
            var pct = new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP)
            amt.setText(pct)
            deductibleDesc.setText(covTerm.PatternCode)
            formatCurrencyAmt.addChild(amt)
            deductible.addChild(formatCurrencyAmt)
            formatPct.setText(0.00)
            deductible.addChild(formatPct)
          }
          deductibleDesc.setText(covTerm.PatternCode)
          deductible.addChild(deductibleDesc)
          cov.addChild(deductible)
        }
      }
    }
    return cov
  }

  function createCoverages(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.Coverage> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Coverage>()
    var covs = policyPeriod.HomeownersLine_HOE.AllCoverages
    for (cov in covs) {
      coverages.add(createCoverage(cov))
    }
    return coverages
  }
}