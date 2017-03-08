package una.integration.mapping.hpx.common

uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.GenericCovTerm
uses gw.xml.XmlElement
uses gw.xml.date.XmlDate
uses gw.api.domain.covterm.TypekeyCovTerm

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 10/24/16
 * Time: 4:29 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class HPXExclusionMapper {
  function createExclusionInfo(currentExclusion : Exclusion, transactions : java.util.List<Transaction>)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.CoverageCd = currentExclusion.PatternCode
    cov.ExclusionDesc = currentExclusion.Pattern.Name
    var coverableInfo = createCoverableInfo(currentExclusion)
    if (coverableInfo != null) {
      cov.addChild(new XmlElement("Coverable", coverableInfo))
    }
    var costInfo = createCoverageCostInfo(transactions)
    for (child in costInfo.$Children) { cov.addChild(child) }
    var scheduleList = createScheduleList(currentExclusion, transactions)
    for (item in scheduleList) {cov.addChild(new XmlElement("Limit", item))}
    var deductibleScheduleList = createDeductibleScheduleList(currentExclusion, transactions)
    for (item in deductibleScheduleList) {cov.addChild(new XmlElement("Deductible", item))}
    if (currentExclusion.OwningCoverable typeis PolicyLine) {
      var covTermInfo = createCovTermInfo(currentExclusion, transactions)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    } else {
      var covTermInfo = createCovTermInfo(currentExclusion, transactions)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    }
    var effectiveDates = createEffectivePeriod(currentExclusion)
    for (child in effectiveDates.$Children) { cov.addChild(child) }
    return cov
  }

  function createCovTermInfo(currentExclusion : Exclusion, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    var currCovTerms = currentExclusion.CovTerms
    currCovTerms?.sortBy(\ elt -> elt?.Pattern?.Name)
    for (currCovTerm in currCovTerms) {
      if (currCovTerm typeis DirectCovTerm) {
        var covTerms = createDirectCovTermInfo(currentExclusion, currCovTerm, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      }
      else if (currCovTerm typeis OptionCovTerm) {
        var covTerms = createOptionCovTermInfo(currentExclusion, currCovTerm, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      } else if (currCovTerm typeis GenericCovTerm) {
        var covTerms = createGenericCovTermInfo(currentExclusion, currCovTerm, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      } else if (currCovTerm typeis TypekeyCovTerm) {
        var covTerms = createTypekeyCovTermInfo(currentExclusion, currCovTerm, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      }
    }
    return cov
  }

  function createDirectCovTermInfo(currentExclusion : Exclusion, currCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createDirectLimitInfo(currentExclusion, currCovTerm, transactions)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(new XmlElement("Deductible", createDirectDeductibleInfo(currentExclusion, currCovTerm, transactions)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherDirectCovTerm(currentExclusion, currCovTerm, transactions)))
    }
    return cov
  }

  function createOptionCovTermInfo(currentExclusion : Exclusion, currCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createOptionLimitInfo(currentExclusion, currCovTerm, transactions)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(new XmlElement("Deductible", createOptionDeductibleInfo(currentExclusion, currCovTerm, transactions)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherOptionCovTerm(currentExclusion, currCovTerm, transactions)))
    }
    return cov
  }

  function createGenericCovTermInfo(currentExclusion : Exclusion, currCovTerm : GenericCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.addChild(new XmlElement("Limit", createOtherGenericCovTerm(currentExclusion, currCovTerm, transactions)))
    return cov
  }

  function createTypekeyCovTermInfo(currentExclusion : Exclusion, currCovTerm : TypekeyCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.addChild(new XmlElement("Limit", createTypekeyCovTerm(currentExclusion, currCovTerm, transactions)))
    return cov
  }

  function createDirectLimitInfo(exclusion : Exclusion, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CurrentTermAmt.Amt = 0
    limit.NetChangeAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.CoverageCd = exclusion.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createOptionLimitInfo(exclusion : Exclusion, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CurrentTermAmt.Amt = 0
    limit.NetChangeAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.CoverageCd = exclusion.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }
  function createOptionDeductibleInfo(exclusion : Exclusion, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    deductible.FormatCurrencyAmt.Amt = 0
    deductible.FormatPct = 0
    deductible.CoverageCd = exclusion.PatternCode
    deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = ""
    deductible.FormatText = ""
    return deductible
  }
  function createDirectDeductibleInfo(exclusion : Exclusion, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    deductible.FormatCurrencyAmt.Amt = 0
    deductible.FormatPct = 0
    deductible.CoverageCd = exclusion.PatternCode
    deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = ""
    deductible.FormatText = ""
    return deductible
  }

  function createOtherOptionCovTerm(exclusion : Exclusion, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = exclusion.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createOtherDirectCovTerm(exclusion : Exclusion, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = exclusion.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createOtherGenericCovTerm(exclusion : Exclusion, currentCovTerm : GenericCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = exclusion.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createTypekeyCovTerm(exclusion : Exclusion, currentCovTerm : TypekeyCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = exclusion.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createCoverageCostInfo(transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (transactions != null) {
      var cost = transactions.first()
      cov.BaseRateAmt.Amt = cost?.Amount != null ? cost.Amount.Amount : 0.00
      cov.CurrentTermAmt.Amt = cost?.Amount != null ? cost.Amount.Amount : 0.00
      cov.WrittenAmt.Amt = cost?.Amount != null ? cost.Amount.Amount : 0.00
      cov.ProRateFactor = cost?.Proration != null ? cost?.Proration : 0.00
      cov.NetChangeAmt.Amt = cost?.Amount != null ? cost.Amount.Amount : 0.00
    }
    return cov
  }

  function createEffectivePeriod(exclusion : Exclusion)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (exclusion.EffectiveDate != null) {
      cov.EffectiveDt = new XmlDate(exclusion.EffectiveDate)
    }
    if (exclusion.ExpirationDate != null) {
      cov.ExpirationDt = new XmlDate(exclusion.ExpirationDate)
    }
    return cov
  }

  abstract function createScheduleList(currentExclusion : Exclusion, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>

  abstract function createDeductibleScheduleList(currentExclusion: Exclusion, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType>

  abstract function createCoverableInfo(currentExclusion : Exclusion) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType

}