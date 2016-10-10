package una.integration.mapping.hpx.common

uses java.util.List
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.math.BigDecimal
uses gw.api.domain.covterm.GenericCovTerm
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/1/16
 * Time: 5:14 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class HPXCoverageMapper {

  function createCoverageInfo(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)
                : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.CoverageCd = currentCoverage.PatternCode
    var coverableInfo = createCoverableInfo(currentCoverage, previousCoverage)
    if (coverableInfo != null) {
      cov.addChild(new XmlElement("Coverable", coverableInfo))
    }
    var costInfo = createCoverageCostInfo(transactions)
    for (child in costInfo.$Children) { cov.addChild(child) }
    var scheduleList = createScheduleList(currentCoverage, previousCoverage, transactions)
    for (item in scheduleList) {cov.addChild(new XmlElement("Limit", item))}
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

  function createCovTermInfo(currentCoverage : Coverage, previousCoverage : Coverage) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
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

  function createDirectCovTermInfo(currentCoverage : Coverage, currCovTerm : DirectCovTerm, prevCovTerm : DirectCovTerm)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createDirectLimitInfo(currentCoverage, currCovTerm, prevCovTerm as DirectCovTerm)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(new XmlElement("Deductible", createDirectDeductibleInfo(currentCoverage, currCovTerm, prevCovTerm as DirectCovTerm)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherDirectCovTerm(currentCoverage, currCovTerm, prevCovTerm as DirectCovTerm)))
    }
    return cov
  }

  function createOptionCovTermInfo(currentCoverage : Coverage, currCovTerm : OptionCovTerm, prevCovTerm : OptionCovTerm)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createOptionLimitInfo(currentCoverage, currCovTerm, prevCovTerm as OptionCovTerm)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
        cov.addChild(new XmlElement("Deductible", createOptionDeductibleInfo(currentCoverage, currCovTerm, prevCovTerm as OptionCovTerm)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherOptionCovTerm(currentCoverage, currCovTerm, prevCovTerm as OptionCovTerm)))
    }
      return cov
  }

  function createGenericCovTermInfo(currentCoverage : Coverage, currCovTerm : GenericCovTerm, prevCovTerm : GenericCovTerm)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
      cov.addChild(new XmlElement("Limit", createOtherGenericCovTerm(currentCoverage, currCovTerm, prevCovTerm as GenericCovTerm)))
    return cov
  }

  function createDirectLimitInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    var value = currentCovTerm.Value != null ? new BigDecimal(currentCovTerm.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    limit.CurrentTermAmt.Amt = !(value == null || value == "") ? value : 0.00
    limit.NetChangeAmt.Amt = previousCovTerm != null ? value - orignalValue : 0.00
    limit.FormatPct = 0
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    return limit
  }

  function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    var value = currentCovTerm.OptionValue != null ? new BigDecimal(currentCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    limit.CurrentTermAmt.Amt = !(value == null || value == "") ? value : 0.00
    limit.NetChangeAmt.Amt = previousCovTerm != null ? value - orignalValue : 0.00
    limit.FormatPct = 0
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    return limit
  }
  function createOptionDeductibleInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    var value = currentCovTerm.OptionValue.Value as double
    var pctValue = (value == null || value == "") ? 0 : (value <= 1) ? value*100.00 : 0
    value = (value == null || value == "") ? 0.00 : value > 1 ? new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    deductible.FormatCurrencyAmt.Amt = value
    deductible.FormatPct = pctValue
    //deductible.CoverageCd = coverage.PatternCode
    //deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = currentCovTerm.PatternCode
    deductible.FormatText = ""
    return deductible
  }
  function createDirectDeductibleInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    var value = currentCovTerm.Value as double
    var pctValue = (value == null || value == "") ? 0 : (value <= 1) ? value*100.00 : 0
    value = (value == null || value == "") ? 0.00 : value > 1 ? new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    deductible.FormatCurrencyAmt.Amt = value
    deductible.FormatPct = pctValue
    //deductible.CoverageCd = coverage.PatternCode
    //deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = currentCovTerm.PatternCode
    deductible.FormatText = ""
    return deductible
  }

  function createOtherOptionCovTerm(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.OptionValue?.Value != null ? currentCovTerm.OptionValue.Value : ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.NetChangeAmt.Amt = 0.00
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    return limit
  }

  function createOtherDirectCovTerm(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.NetChangeAmt.Amt = 0.00
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    return limit
  }

  function createOtherGenericCovTerm(coverage : Coverage, currentCovTerm : GenericCovTerm, previousCovTerm : GenericCovTerm): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.NetChangeAmt.Amt = 0.00
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    return limit  }

  function createCoverageCostInfo(transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    var cost = transactions.first().Cost
    cov.BaseRateAmt.Amt = cost?.ActualBaseRate != null ? cost.ActualBaseRate : -99999999.99
    cov.CurrentTermAmt.Amt = cost?.StandardBaseRate != null ? cost.StandardBaseRate : -99999999.99
    cov.WrittenAmt.Amt = cost?.ActualTermAmount != null ? cost.ActualTermAmount : -99999999.99
    cov.ProRateFactor = cost?.Proration != null ? cost?.Proration : -99999999.99
    return cov
  }

  function createEffectivePeriod(coverage : Coverage)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (coverage.EffectiveDate != null) {
      cov.EffectiveDt.Day = coverage.EffectiveDate.DayOfMonth
      cov.EffectiveDt.Month = coverage.EffectiveDate.MonthOfYear
      cov.EffectiveDt.Year = coverage.EffectiveDate.YearOfDate
    }
    if (coverage.ExpirationDate != null) {
      cov.ExpirationDt.Day = coverage.ExpirationDate.DayOfMonth
      cov.ExpirationDt.Month = coverage.ExpirationDate.MonthOfYear
      cov.ExpirationDt.Year = coverage.ExpirationDate.YearOfDate
    }
    return cov
  }

  abstract function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)
                      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>

  abstract function createCoverableInfo(currentCoverage : Coverage, previousCoverage : Coverage) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType
}