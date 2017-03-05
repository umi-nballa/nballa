package una.integration.mapping.hpx.common

uses java.util.List
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.math.BigDecimal
uses gw.api.domain.covterm.GenericCovTerm
uses gw.xml.XmlElement
uses gw.xml.date.XmlDate
uses gw.api.domain.covterm.TypekeyCovTerm
uses una.integration.mapping.hpx.helper.HPXRatingHelper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/1/16
 * Time: 5:14 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class HPXCoverageMapper {

  function createCoverageInfo(currentCoverage : Coverage, transactions : java.util.List<Transaction>)
                : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.CoverageCd = currentCoverage.PatternCode
    cov.CoverageDesc = currentCoverage.Pattern.Name
    cov.CategoryCd = (currentCoverage.CoverageCategory as String).compareTo("Optional") > 0 ? "Optional" : "Base"
    var coverableInfo = createCoverableInfo(currentCoverage)
    if (coverableInfo != null) {
      cov.addChild(new XmlElement("Coverable", coverableInfo))
    }
    var costInfo = createCoverageCostInfo(currentCoverage, transactions)
    for (child in costInfo.$Children) { cov.addChild(child) }
    var scheduleList = createScheduleList(currentCoverage, transactions)
    for (item in scheduleList) {cov.addChild(new XmlElement("Limit", item))}
    var deductibleScheduleList = createDeductibleScheduleList(currentCoverage, transactions)
    for (item in deductibleScheduleList) {cov.addChild(new XmlElement("Deductible", item))}
    if (currentCoverage.OwningCoverable typeis PolicyLine) {
      var covTermInfo = createCovTermInfo(currentCoverage, transactions)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    } else {
      var covTermInfo = createCovTermInfo(currentCoverage, transactions)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    }
    var effectiveDates = createEffectivePeriod(currentCoverage)
    for (child in effectiveDates.$Children) { cov.addChild(child) }
    return cov
  }

  function createCovTermInfo(currentCoverage : Coverage, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    var currCovTerms = currentCoverage.CovTerms
    for (currCovTerm in currCovTerms) {
      if (currCovTerm typeis DirectCovTerm) {
        var covTerms = createDirectCovTermInfo(currentCoverage, currCovTerm, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      }
      else if (currCovTerm typeis OptionCovTerm) {
        var covTerms = createOptionCovTermInfo(currentCoverage, currCovTerm, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      } else if (currCovTerm typeis GenericCovTerm) {
          var covTerms = createGenericCovTermInfo(currentCoverage, currCovTerm, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
      } else if (currCovTerm typeis TypekeyCovTerm) {
          var covTerms = createTypekeyCovTermInfo(currentCoverage, currCovTerm, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
      }
    }
    return cov
  }

  function createDirectCovTermInfo(currentCoverage : Coverage, currCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createDirectLimitInfo(currentCoverage, currCovTerm, transactions)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(new XmlElement("Deductible", createDirectDeductibleInfo(currentCoverage, currCovTerm, transactions)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherDirectCovTerm(currentCoverage, currCovTerm, transactions)))
    }
    return cov
  }

  function createOptionCovTermInfo(currentCoverage : Coverage, currCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createOptionLimitInfo(currentCoverage, currCovTerm, transactions)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
        cov.addChild(new XmlElement("Deductible", createOptionDeductibleInfo(currentCoverage, currCovTerm, transactions)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherOptionCovTerm(currentCoverage, currCovTerm, transactions)))
    }
      return cov
  }

  function createGenericCovTermInfo(currentCoverage : Coverage, currCovTerm : GenericCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
      cov.addChild(new XmlElement("Limit", createOtherGenericCovTerm(currentCoverage, currCovTerm, transactions)))
    return cov
  }

  function createTypekeyCovTermInfo(currentCoverage : Coverage, currCovTerm : TypekeyCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.addChild(new XmlElement("Limit", createTypekeyCovTerm(currentCoverage, currCovTerm, transactions)))
    return cov
  }

  function createDirectLimitInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    var value = currentCovTerm.Value
    var valueType = currentCovTerm.Pattern.ValueType
    limit.CurrentTermAmt.Amt = getCovTermAmount(value, valueType)
    limit.NetChangeAmt.Amt = coverage.OwningCoverable.BasedOnUntyped != null ? currentCovTerm.LimitDifference : 0
    limit.FormatPct = getCovTermPercentage(value, valueType)
    limit.Rate = 0.00
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    limit.WrittenAmt.Amt = 0
    limit.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
    return limit
  }

  function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    var value = currentCovTerm.OptionValue.Value as double
    var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
    limit.CurrentTermAmt.Amt = getCovTermAmount(value, valueType)
    limit.NetChangeAmt.Amt = coverage.OwningCoverable.BasedOnUntyped != null ? currentCovTerm.LimitDifference : 0
    limit.FormatPct = getCovTermPercentage(value, valueType)
    limit.Rate = 0.00
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    limit.WrittenAmt.Amt = 0
    limit.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
    return limit
  }
  function createOptionDeductibleInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    deductible.Description = currentCovTerm.Pattern.Name
    var value = currentCovTerm.OptionValue.Value
    var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
    deductible.FormatCurrencyAmt.Amt = getCovTermAmount(value, valueType)
    deductible.FormatPct = getCovTermPercentage(value, valueType)
    deductible.CoverageCd = coverage.PatternCode
    deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = ""
    deductible.FormatText = ""
    deductible.NetChangeAmt.Amt = 0
    deductible.WrittenAmt.Amt = 0
    deductible.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
    return deductible
  }
  function createDirectDeductibleInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    deductible.Description = currentCovTerm.Pattern.Name
    var value = currentCovTerm.Value
    var valueType = currentCovTerm.Pattern.ValueType
    deductible.FormatCurrencyAmt.Amt = getCovTermAmount(value, valueType)
    deductible.FormatPct = getCovTermPercentage(value, valueType)
    deductible.CoverageCd = coverage.PatternCode
    deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = ""
    deductible.FormatText = ""
    deductible.NetChangeAmt.Amt = 0
    deductible.WrittenAmt.Amt = 0
    deductible.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
    return deductible
  }

  function createOtherOptionCovTerm(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    limit.FormatText = currentCovTerm?.OptionValue?.Value != null ? currentCovTerm.OptionValue.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    limit.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
    return limit
  }

  function createOtherDirectCovTerm(coverage : Coverage, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    limit.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
    return limit
  }

  function createOtherGenericCovTerm(coverage : Coverage, currentCovTerm : GenericCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    limit.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
    return limit
  }

  function createTypekeyCovTerm(coverage : Coverage, currentCovTerm : TypekeyCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createCoverageCostInfo(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.WrittenAmt.Amt = 0
    cov.CurrentTermAmt.Amt = 0
    cov.NetChangeAmt.Amt = 0
    cov.ProRateFactor = 0.00
    cov.BaseRateAmt.Amt = 0.00
    if (transactions != null) {
      var cost = transactions.first()
      cov.BaseRateAmt.Amt = cost?.Amount != null ? cost.Amount.Amount : 0.00
      cov.CurrentTermAmt.Amt = cost?.Amount != null ? cost.Amount.Amount : 0.00
      var allCosts = currentCoverage.PolicyLine.Costs
      var currentPremium = 0.00
      for (covCost in allCosts) {
        if(getCostCoverage(covCost)?.PatternCode?.equals(currentCoverage.PatternCode)) {
          currentPremium = currentPremium + covCost.ActualAmount.Amount
        }
      }
      cov.WrittenAmt.Amt = currentPremium != null ? currentPremium : 0.00
      cov.ProRateFactor = cost?.Proration != null ? cost?.Proration : 0.00
      cov.NetChangeAmt.Amt = cost?.Amount != null ? cost.Amount.Amount : 0.00
      var ratingHelper = new HPXRatingHelper()
      var consentToRateAmount = 0
      if (cost != null) {
        consentToRateAmount = cost != null ? ratingHelper.getRate(currentCoverage.PolicyLine.AssociatedPolicyPeriod, cost.Cost, "amountWithNoCTR") : 0
      }
      cov.ConsentToRatePremiumAmt.Amt = consentToRateAmount != null ? consentToRateAmount : 0
    }
    return cov
  }

  function createEffectivePeriod(coverage : Coverage)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (coverage.EffectiveDate != null) {
      cov.EffectiveDt = new XmlDate(coverage.EffectiveDate)
    }
    if (coverage.ExpirationDate != null) {
      cov.ExpirationDt = new XmlDate(coverage.ExpirationDate)
    }
    return cov
  }

  function getCovTermPercentage(value : BigDecimal, valueType : CovTermModelVal) : BigDecimal {
    var pct : BigDecimal = 0
    if (value == null || value == "") {
      pct = 0
    } else if (valueType.Value == typekey.CovTermModelVal.TC_PERCENT) {
      pct = value <= 1 ? value*100 : value
    } else {
      pct = value <= 1 ? value*100 : 0
    }
    return pct
  }

  function getCovTermAmount(value : BigDecimal, valueType : CovTermModelVal) : BigDecimal {
    var val : BigDecimal = 0
    if (value == null || value == "") {
      val = 0
    } else if (valueType.Value == typekey.CovTermModelVal.TC_PERCENT) {
      val = 0
    } else {
      val = value <= 1 ? 0 : new BigDecimal(value as long)
    }
    return val
  }

  abstract function createScheduleList(currentCoverage : Coverage, transactions : java.util.List<Transaction>)
                      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>

  abstract function createDeductibleScheduleList(currentCoverage : Coverage, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType>

  abstract function createCoverableInfo(currentCoverage : Coverage) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType

  abstract function getCostCoverage(cost : Cost) : Coverage

}