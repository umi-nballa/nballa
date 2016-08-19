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

  function createCoverageInfo(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var coverageCode = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    coverageCode.setText(currentCoverage.PatternCode)
    cov.addChild(coverageCode)
    var costInfo = createCoverageCostInfo(transactions)
    for (child in costInfo.$Children) { cov.addChild(child) }
    var covTermInfo = createCovTermInfo(currentCoverage, previousCoverage)
    for (child in covTermInfo.$Children) { cov.addChild(child) }
    var effectiveDates = createEffectivePeriod(currentCoverage)
    for (child in effectiveDates.$Children) { cov.addChild(child) }
    return cov
  }

  function createCovTermInfo(currentCoverage : Coverage, previousCoverage : Coverage) : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var currCovTerms = currentCoverage.CovTerms
    for (currCovTerm in currCovTerms) {
      if (currCovTerm typeis DirectCovTerm) {
        if (previousCoverage != null) {
          var prevCovTerm = previousCoverage.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
          var covTerms = createDirectCovTermInfo(currCovTerm, prevCovTerm as DirectCovTerm)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createDirectCovTermInfo(currCovTerm, null)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      }
      else if (currCovTerm typeis OptionCovTerm) {
        if (previousCoverage != null) {
          var prevCovTerm = previousCoverage.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
          var covTerms = createOptionCovTermInfo(currCovTerm, prevCovTerm as OptionCovTerm)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createOptionCovTermInfo(currCovTerm, null)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      }
    }
    return cov
  }

  function createDirectCovTermInfo(currCovTerm : DirectCovTerm, prevCovTerm : DirectCovTerm)  : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT ) {
      cov.addChild(createDirectLimitInfo(currCovTerm, prevCovTerm as DirectCovTerm))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(createDirectDeductibleInfo(currCovTerm, prevCovTerm as DirectCovTerm))
    }
    return cov
  }

  function createOptionCovTermInfo(currCovTerm : OptionCovTerm, prevCovTerm : OptionCovTerm)  : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT ) {
    cov.addChild(createOptionLimitInfo(currCovTerm, prevCovTerm as OptionCovTerm))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
        cov.addChild(createOptionDeductibleInfo(currCovTerm, prevCovTerm as OptionCovTerm))
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
    var orignalValue = 0.00
    if (previousCovTerm != null) {
      orignalValue = previousCovTerm.Value
    }
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
    var orignalValue = 0.00
    if (previousCovTerm != null) {
      orignalValue = previousCovTerm.OptionValue.Value
    }
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

  function createCoverageCostInfo(transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var cost = transactions.first().Cost
    // base rate
    var baseRateAmt = new wsi.schema.una.hpx.hpx_application_request.BaseRateAmt()
    var baseRateAmtAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var baseRatePremium = cost.ActualAdjRate
    if (baseRatePremium != null) {
      baseRateAmtAmt.setText(baseRatePremium)
    }
    else {
      baseRateAmtAmt.setText(-99999999.99)
    }
    baseRateAmt.addChild(baseRateAmtAmt)
    cov.addChild(baseRateAmt)
    // standard premium
    var standardPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var standardPremiumAmtAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var standardPremium = cost.StandardBaseRate
    if(standardPremium != null) {
      standardPremiumAmtAmt.setText(standardPremium)
    } else {
      standardPremiumAmtAmt.setText(-99999999.99)
    }
    standardPremiumAmt.addChild(standardPremiumAmtAmt)
    cov.addChild(standardPremiumAmt)
    // term premium
    var termPremiumAmt = new wsi.schema.una.hpx.hpx_application_request.WrittenAmt()
    var termPremiumAmtAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var termPremium = cost.ActualTermAmount
    if (termPremium != null) {
      termPremiumAmtAmt.setText(termPremium)
    } else {
      termPremiumAmtAmt.setText(-99999999.99)
    }
    termPremiumAmt.addChild(termPremiumAmtAmt)
    cov.addChild(termPremiumAmt)
    return cov
  }

  function createEffectivePeriod(coverage : Coverage)  : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var effectiveDate = new wsi.schema.una.hpx.hpx_application_request.EffectiveDt()
    if (coverage.EffectiveDate != null) {
      effectiveDate.setText(coverage.EffectiveDate)
      cov.addChild(effectiveDate)
    }
    var expiryDate = new wsi.schema.una.hpx.hpx_application_request.ExpirationDt()
    if (coverage.ExpirationDate != null) {
      expiryDate.setText(coverage.ExpirationDate)
      cov.addChild(expiryDate)
    }
    return cov
  }
}