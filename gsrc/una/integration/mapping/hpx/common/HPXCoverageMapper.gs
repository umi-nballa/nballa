package una.integration.mapping.hpx.common

uses java.util.List
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.math.BigDecimal
uses gw.api.domain.covterm.GenericCovTerm

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/1/16
 * Time: 5:14 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class HPXCoverageMapper {

  function createCoverageInfo(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var coverageCode = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    coverageCode.setText(currentCoverage.PatternCode)
    cov.addChild(coverageCode)
    var coverableInfo = createCoverableInfo(currentCoverage, previousCoverage)
    if (coverableInfo != null) {
      cov.addChild(coverableInfo)
    }
    var costInfo = createCoverageCostInfo(transactions)
    for (child in costInfo.$Children) { cov.addChild(child) }
    var scheduleList = createScheduleList(currentCoverage, previousCoverage, transactions)
    for (item in scheduleList) {cov.addChild(item)}
    if (currentCoverage.OwningCoverable typeis PolicyLine) {
      var covTermInfo = createCovTermInfo(currentCoverage, previousCoverage)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    } else {
      var covTermInfo = createCovTermInfo(currentCoverage, previousCoverage)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    }
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
          var covTerms = createDirectCovTermInfo(currentCoverage, currCovTerm, prevCovTerm as DirectCovTerm)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createDirectCovTermInfo(currentCoverage, currCovTerm, null)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      }
      else if (currCovTerm typeis OptionCovTerm) {
        if (previousCoverage != null) {
          var prevCovTerm = previousCoverage.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
          var covTerms = createOptionCovTermInfo(currentCoverage, currCovTerm, prevCovTerm as OptionCovTerm)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createOptionCovTermInfo(currentCoverage, currCovTerm, null)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      } else if (currCovTerm typeis GenericCovTerm) {
        if (previousCoverage != null) {
          var prevCovTerm = previousCoverage.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
          var covTerms = createGenericCovTermInfo(currentCoverage, currCovTerm, prevCovTerm as GenericCovTerm)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createGenericCovTermInfo(currentCoverage, currCovTerm, null)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      }
    }
    return cov
  }

  function createDirectCovTermInfo(currentCoverage : Coverage, currCovTerm : DirectCovTerm, prevCovTerm : DirectCovTerm)  : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(createDirectLimitInfo(currentCoverage, currCovTerm, prevCovTerm as DirectCovTerm))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(createDirectDeductibleInfo(currentCoverage, currCovTerm, prevCovTerm as DirectCovTerm))
    } else {
      cov.addChild(createOtherDirectCovTerm(currentCoverage, currCovTerm, prevCovTerm as DirectCovTerm))
    }
    return cov
  }

  function createOptionCovTermInfo(currentCoverage : Coverage, currCovTerm : OptionCovTerm, prevCovTerm : OptionCovTerm)  : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
    cov.addChild(createOptionLimitInfo(currentCoverage, currCovTerm, prevCovTerm as OptionCovTerm))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
        cov.addChild(createOptionDeductibleInfo(currentCoverage, currCovTerm, prevCovTerm as OptionCovTerm))
    } else {
      cov.addChild(createOtherOptionCovTerm(currentCoverage, currCovTerm, prevCovTerm as OptionCovTerm))
    }
      return cov
  }

  function createGenericCovTermInfo(currentCoverage : Coverage, currCovTerm : GenericCovTerm, prevCovTerm : GenericCovTerm)  : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
      cov.addChild(createOtherGenericCovTerm(currentCoverage, currCovTerm, prevCovTerm as GenericCovTerm))
    return cov
  }

  function createDirectLimitInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm) : wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
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
    formatPct.setText(0)
    limit.addChild(formatPct)
    coverageCd.setText(coverage.PatternCode)
    limit.addChild(coverageCd)
    scheduleType.setText("")
    limit.addChild(scheduleType)
    return limit
  }

  function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm) : wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
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
    formatPct.setText(0)
    limit.addChild(formatPct)
    coverageCd.setText(coverage.PatternCode)
    limit.addChild(coverageCd)
    scheduleType.setText("")
    limit.addChild(scheduleType)
    return limit
  }
  function createOptionDeductibleInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm) : wsi.schema.una.hpx.hpx_application_request.Deductible {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.Deductible()
    var formatCurrencyAmt = new wsi.schema.una.hpx.hpx_application_request.FormatCurrencyAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var deductibleDesc = new wsi.schema.una.hpx.hpx_application_request.DeductibleDesc()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
    var value = currentCovTerm.OptionValue.Value as double
    if (value == null || value == "") value = 0.00
    if (value == 0.00) {
      formatPct.setText(0)
      deductible.addChild(formatPct)
      amt.setText(0.00)
      formatCurrencyAmt.addChild(amt)
      deductible.addChild(formatCurrencyAmt)
    }
    else if(value <= 1) {
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
      formatPct.setText(0)
      deductible.addChild(formatPct)
    }
    deductibleDesc.setText(currentCovTerm.PatternCode)
    deductible.addChild(deductibleDesc)
    coverageCd.setText(coverage.PatternCode)
    deductible.addChild(coverageCd)
    return deductible
  }
  function createDirectDeductibleInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm) : wsi.schema.una.hpx.hpx_application_request.Deductible {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.Deductible()
    var formatCurrencyAmt = new wsi.schema.una.hpx.hpx_application_request.FormatCurrencyAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var deductibleDesc = new wsi.schema.una.hpx.hpx_application_request.DeductibleDesc()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
    var value = currentCovTerm.Value as double
    if (value == null || value == "") value = 0.00
    if (value == 0.00) {
      formatPct.setText(0)
      deductible.addChild(formatPct)
      amt.setText(0.00)
      formatCurrencyAmt.addChild(amt)
      deductible.addChild(formatCurrencyAmt)
    }
    else if(value <= 1) {
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
    coverageCd.setText(coverage.PatternCode)
    deductible.addChild(coverageCd)
    return deductible
  }

  function createOtherOptionCovTerm(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm): wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
    var formatText = new wsi.schema.una.hpx.hpx_application_request.FormatText()
    var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    formatText.setText(currentCovTerm.OptionValue.Value)
    limit.addChild(formatText)
    amt.setText(0.00)
    currentTermAmount.addChild(amt)
    limit.addChild(currentTermAmount)
    formatPct.setText(0)
    limit.addChild(formatPct)
    changeAmt.setText(0.00)
    netChangeAmount.addChild(changeAmt)
    limit.addChild(netChangeAmount)
    limitDesc.setText(currentCovTerm.PatternCode)
    limit.addChild(limitDesc)
    coverageCd.setText(coverage.PatternCode)
    limit.addChild(coverageCd)
    scheduleType.setText("")
    limit.addChild(scheduleType)
    return limit
  }

  function createOtherDirectCovTerm(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm): wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
    var formatText = new wsi.schema.una.hpx.hpx_application_request.FormatText()
    var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    formatText.setText(currentCovTerm.Value)
    limit.addChild(formatText)
    amt.setText(0.00)
    currentTermAmount.addChild(amt)
    limit.addChild(currentTermAmount)
    formatPct.setText(0)
    limit.addChild(formatPct)
    changeAmt.setText(0.00)
    netChangeAmount.addChild(changeAmt)
    limit.addChild(netChangeAmount)
    limitDesc.setText(currentCovTerm.PatternCode)
    limit.addChild(limitDesc)
    coverageCd.setText(coverage.PatternCode)
    limit.addChild(coverageCd)
    scheduleType.setText("")
    limit.addChild(scheduleType)
    return limit
  }

  function createOtherGenericCovTerm(coverage : Coverage, currentCovTerm : GenericCovTerm, previousCovTerm : GenericCovTerm): wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
    var formatText = new wsi.schema.una.hpx.hpx_application_request.FormatText()
    var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
    var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
    var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
    var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    if (currentCovTerm?.Value != null) {
      formatText.setText(currentCovTerm.Value)
    } else formatText.setText("")
    limit.addChild(formatText)
    amt.setText(0.00)
    currentTermAmount.addChild(amt)
    limit.addChild(currentTermAmount)
    formatPct.setText(0)
    limit.addChild(formatPct)
    changeAmt.setText(0.00)
    netChangeAmount.addChild(changeAmt)
    limit.addChild(netChangeAmount)
    limitDesc.setText(currentCovTerm.PatternCode)
    limit.addChild(limitDesc)
    coverageCd.setText(coverage.PatternCode)
    limit.addChild(coverageCd)
    scheduleType.setText("")
    limit.addChild(scheduleType)
    return limit
  }

  function createCoverageCostInfo(transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.Coverage {
    var cov = new wsi.schema.una.hpx.hpx_application_request.Coverage()
    var cost = transactions.first().Cost
    // base rate
    var baseRateAmt = new wsi.schema.una.hpx.hpx_application_request.BaseRateAmt()
    var baseRateAmtAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
    var baseRatePremium = cost.ActualBaseRate
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
    // prorate factor
    var prorateFactor = new wsi.schema.una.hpx.hpx_application_request.ProRateFactor()
    if (cost != null) {
      var proration = cost.Proration
      prorateFactor.setText(proration)
    } else {
      prorateFactor.setText(-99999999.99)
    }
    cov.addChild(prorateFactor)
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

  abstract function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)
                      : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit>

  abstract function createCoverableInfo(currentCoverage : Coverage, previousCoverage : Coverage) : wsi.schema.una.hpx.hpx_application_request.Coverable
}