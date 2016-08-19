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
  function createCoveragesInfo(currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>) : java.util.List<wsi.schema.una.hpx.hpx_application_request.Coverage> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Coverage>()
    for (cov in currentCoverages) {
      var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(cov.PatternCode))
      if (previousCoverage != null) {
        coverages.add(createCoverageInfo(cov, previousCoverage))
      }
    }
    return coverages
  }

  function createCoverageInfo(currentCoverage : Coverage, previousCoverage : Coverage) : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var coverageCode = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    coverageCode.setText(currentCoverage.PatternCode)
    cov.addChild(coverageCode)
    var currCovTerms = currentCoverage.CovTerms
    for (currCovTerm in currCovTerms) {
      var prevCovTerm = previousCoverage.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
      if (currCovTerm typeis DirectCovTerm) {
        if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT ) {
           cov.addChild(createDirectLimitInfo(currCovTerm, prevCovTerm as DirectCovTerm))
        } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
          cov.addChild(createDirectDeductibleInfo(currCovTerm, prevCovTerm as DirectCovTerm))
        }
      } else if (currCovTerm typeis OptionCovTerm) {
        if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT ) {
          cov.addChild(createOptionLimitInfo(currCovTerm, prevCovTerm as OptionCovTerm))
        } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
          cov.addChild(createOptionDeductibleInfo(currCovTerm, prevCovTerm as OptionCovTerm))
        }
      }
    }
    return cov
  }

  function createDirectLimitInfo(currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm) : wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
    var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var value = currentCovTerm.Value as double
    if (value == null || value == "") value = 0.00
    var formattedAmt = new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP)
    amt.setText(formattedAmt)
    limitDesc.setText(currentCovTerm.PatternCode)
    currentTermAmount.addChild(amt)
    limit.addChild(currentTermAmount)
    limit.addChild(limitDesc)
    // net change amount
    var orignalValue = previousCovTerm.Value
    var changedValue = value - orignalValue
    var formattedNetChange = new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP)
    changeAmt.setText(changedValue)
    netChangeAmount.addChild(changeAmt)
    limit.addChild(netChangeAmount)
    return limit
  }

  function createOptionLimitInfo(currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm) : wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
    var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var value = currentCovTerm.OptionValue.Value as double
    if (value == null || value == "") value = 0.00
    var formattedAmt = new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP)
    amt.setText(formattedAmt)
    limitDesc.setText(currentCovTerm.PatternCode)
    currentTermAmount.addChild(amt)
    limit.addChild(currentTermAmount)
    limit.addChild(limitDesc)
    // net change amount
    var orignalValue = previousCovTerm.OptionValue.Value
    var changedValue = value - orignalValue
    var formattedNetChange = new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP)
    changeAmt.setText(changedValue)
    netChangeAmount.addChild(changeAmt)
    limit.addChild(netChangeAmount)
    return limit
  }
  function createOptionDeductibleInfo(currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm) : wsi.schema.una.hpx.hpx_application_request.Deductible {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.Deductible()
    var formatCurrencyAmt = new wsi.schema.una.hpx.hpx_application_request.FormatCurrencyAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var deductibleDesc = new wsi.schema.una.hpx.hpx_application_request.DeductibleDesc()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var value = currentCovTerm.OptionValue.Value as double
    if (value == null || value == "") value = 0.00
    if(value <= 1) {
      var pct = new BigDecimal(value*100.00).setScale(2, BigDecimal.ROUND_HALF_UP)
      formatPct.setText(pct.setScale(2).asString())
      deductible.addChild(formatPct)
      amt.setText(0.00)
      formatCurrencyAmt.addChild(amt)
      deductible.addChild(formatCurrencyAmt)
    }
    else {
      var formattedAmt = new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP)
      amt.setText(formattedAmt)
      deductibleDesc.setText(currentCovTerm.PatternCode)
      formatCurrencyAmt.addChild(amt)
      deductible.addChild(formatCurrencyAmt)
      formatPct.setText(0.00)
      deductible.addChild(formatPct)
    }
    deductibleDesc.setText(currentCovTerm.PatternCode)
    deductible.addChild(deductibleDesc)
    return deductible
  }
  function createDirectDeductibleInfo(currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm) : wsi.schema.una.hpx.hpx_application_request.Deductible {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.Deductible()
    var formatCurrencyAmt = new wsi.schema.una.hpx.hpx_application_request.FormatCurrencyAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var deductibleDesc = new wsi.schema.una.hpx.hpx_application_request.DeductibleDesc()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var value = currentCovTerm.Value as double
    if (value == null || value == "") value = 0.00
    if(value <= 1) {
      var pct = new BigDecimal(value*100.00).setScale(2, BigDecimal.ROUND_HALF_UP)
      formatPct.setText(pct.setScale(2).asString())
      deductible.addChild(formatPct)
      amt.setText(0.00)
      formatCurrencyAmt.addChild(amt)
      deductible.addChild(formatCurrencyAmt)
    }
    else {
      var formattedAmt = new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP)
      amt.setText(formattedAmt)
      deductibleDesc.setText(currentCovTerm.PatternCode)
      formatCurrencyAmt.addChild(amt)
      deductible.addChild(formatCurrencyAmt)
      formatPct.setText(0.00)
      deductible.addChild(formatPct)
    }
    deductibleDesc.setText(currentCovTerm.PatternCode)
    deductible.addChild(deductibleDesc)
    return deductible
  }
}