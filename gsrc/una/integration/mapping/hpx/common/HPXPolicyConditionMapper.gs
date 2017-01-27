package una.integration.mapping.hpx.common

uses gw.api.domain.covterm.GenericCovTerm
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses java.math.BigDecimal
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
abstract class HPXPolicyConditionMapper {
  function createPolicyConditionInfo(currentPolicyCondition : PolicyCondition, previousPolicyCondition : PolicyCondition, transactions : java.util.List<Transaction>)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.CoverageCd = currentPolicyCondition.PatternCode
    cov.PolicyConditionDesc = currentPolicyCondition.Pattern.Description
    var coverableInfo = createCoverableInfo(currentPolicyCondition, previousPolicyCondition)
    if (coverableInfo != null) {
      cov.addChild(new XmlElement("Coverable", coverableInfo))
    }
    var costInfo = createCoverageCostInfo(transactions)
    for (child in costInfo.$Children) { cov.addChild(child) }
    var scheduleList = createScheduleList(currentPolicyCondition, previousPolicyCondition, transactions)
    for (item in scheduleList) {cov.addChild(new XmlElement("Limit", item))}
    var deductibleScheduleList = createDeductibleScheduleList(currentPolicyCondition, previousPolicyCondition, transactions)
    for (item in deductibleScheduleList) {cov.addChild(new XmlElement("Deductible", item))}
    if (currentPolicyCondition.OwningCoverable typeis PolicyLine) {
      var covTermInfo = createCovTermInfo(currentPolicyCondition, previousPolicyCondition, transactions)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    } else {
      var covTermInfo = createCovTermInfo(currentPolicyCondition, previousPolicyCondition, transactions)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    }
    var effectiveDates = createEffectivePeriod(currentPolicyCondition)
    for (child in effectiveDates.$Children) { cov.addChild(child) }
    return cov
  }

  function createCovTermInfo(currentPolicyCondition : PolicyCondition, previousPolicyCondition : PolicyCondition, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    var currCovTerms = currentPolicyCondition.CovTerms
    for (currCovTerm in currCovTerms) {
      if (currCovTerm typeis DirectCovTerm) {
        if (previousPolicyCondition != null) {
          var prevCovTerm = previousPolicyCondition.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
          var covTerms = createDirectCovTermInfo(currentPolicyCondition, currCovTerm, prevCovTerm as DirectCovTerm, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createDirectCovTermInfo(currentPolicyCondition, currCovTerm, null, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      }
      else if (currCovTerm typeis OptionCovTerm) {
        if (previousPolicyCondition != null) {
          var prevCovTerm = previousPolicyCondition.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
          var covTerms = createOptionCovTermInfo(currentPolicyCondition, currCovTerm, prevCovTerm as OptionCovTerm, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createOptionCovTermInfo(currentPolicyCondition, currCovTerm, null, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      } else if (currCovTerm typeis GenericCovTerm) {
        if (previousPolicyCondition != null) {
          var prevCovTerm = previousPolicyCondition.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
          var covTerms = createGenericCovTermInfo(currentPolicyCondition, currCovTerm, prevCovTerm as GenericCovTerm, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createGenericCovTermInfo(currentPolicyCondition, currCovTerm, null, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      } else if (currCovTerm typeis TypekeyCovTerm) {
        if (previousPolicyCondition != null) {
          var prevCovTerm = previousPolicyCondition.CovTerms.firstWhere( \ elt -> elt.PatternCode.equals(currCovTerm.PatternCode))
          var covTerms = createTypekeyCovTermInfo(currentPolicyCondition, currCovTerm, prevCovTerm as TypekeyCovTerm, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
        else {
          var covTerms = createTypekeyCovTermInfo(currentPolicyCondition, currCovTerm, null, transactions)
          for (child in covTerms.$Children) { cov.addChild(child) }
        }
      }
    }
    return cov
  }

  function createDirectCovTermInfo(currentPolicyCondition : PolicyCondition, currCovTerm : DirectCovTerm, prevCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createDirectLimitInfo(currentPolicyCondition, currCovTerm, prevCovTerm as DirectCovTerm, transactions)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(new XmlElement("Deductible", createDirectDeductibleInfo(currentPolicyCondition, currCovTerm, prevCovTerm as DirectCovTerm, transactions)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherDirectCovTerm(currentPolicyCondition, currCovTerm, prevCovTerm as DirectCovTerm, transactions)))
    }
    return cov
  }

  function createOptionCovTermInfo(currentPolicyCondition : PolicyCondition, currCovTerm : OptionCovTerm, prevCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createOptionLimitInfo(currentPolicyCondition, currCovTerm, prevCovTerm as OptionCovTerm, transactions)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(new XmlElement("Deductible", createOptionDeductibleInfo(currentPolicyCondition, currCovTerm, prevCovTerm as OptionCovTerm, transactions)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherOptionCovTerm(currentPolicyCondition, currCovTerm, prevCovTerm as OptionCovTerm, transactions)))
    }
    return cov
  }

  function createGenericCovTermInfo(currentPolicyCondition : PolicyCondition, currCovTerm : GenericCovTerm, prevCovTerm : GenericCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.addChild(new XmlElement("Limit", createOtherGenericCovTerm(currentPolicyCondition, currCovTerm, prevCovTerm as GenericCovTerm, transactions)))
    return cov
  }

  function createTypekeyCovTermInfo(currentPolicyCondition : PolicyCondition, currCovTerm : TypekeyCovTerm, prevCovTerm : TypekeyCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.addChild(new XmlElement("Limit", createTypekeyCovTerm(currentPolicyCondition, currCovTerm, prevCovTerm, transactions)))
    return cov
  }

  function createDirectLimitInfo(currentPolicyCondition : PolicyCondition, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    var value = currentCovTerm.Value != null ? new BigDecimal(currentCovTerm.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    limit.CurrentTermAmt.Amt = !(value == null || value == "") ? value : 0.00
    limit.NetChangeAmt.Amt = previousCovTerm != null ? value - orignalValue : 0.00
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    limit.WrittenAmt.Amt = 0.00
    return limit
  }

  function createOptionLimitInfo(currentPolicyCondition : PolicyCondition, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    var value = currentCovTerm.OptionValue != null ? new BigDecimal(currentCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    limit.CurrentTermAmt.Amt = !(value == null || value == "") ? value : 0.00
    limit.NetChangeAmt.Amt = previousCovTerm != null ? value - orignalValue : 0.00
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    limit.WrittenAmt.Amt = 0.00
    return limit
  }
  function createOptionDeductibleInfo(currentPolicyCondition : PolicyCondition, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    var value = currentCovTerm.OptionValue.Value as double
    var pctValue = (value == null || value == "") ? 0 : (value <= 1) ? value*100.00 : 0
    value = (value == null || value == "") ? 0.00 : value > 1 ? new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    deductible.FormatCurrencyAmt.Amt = value
    deductible.FormatPct = pctValue
    deductible.CoverageCd = currentPolicyCondition.PatternCode
    deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = ""
    deductible.FormatText = ""
    return deductible
  }
  function createDirectDeductibleInfo(currentPolicyCondition : PolicyCondition, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    var value = currentCovTerm.Value as double
    var pctValue = (value == null || value == "") ? 0 : (value <= 1) ? value*100.00 : 0
    value = (value == null || value == "") ? 0.00 : value > 1 ? new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    deductible.FormatCurrencyAmt.Amt = value
    deductible.FormatPct = pctValue
    deductible.CoverageCd = currentPolicyCondition.PatternCode
    deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = ""
    deductible.FormatText = ""
    return deductible
  }

  function createOtherOptionCovTerm(currentPolicyCondition : PolicyCondition, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.OptionValue?.Value != null ? currentCovTerm.OptionValue.Value : ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0.00
    return limit
  }

  function createOtherDirectCovTerm(currentPolicyCondition : PolicyCondition, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0.00
    return limit
  }

  function createOtherGenericCovTerm(currentPolicyCondition : PolicyCondition, currentCovTerm : GenericCovTerm, previousCovTerm : GenericCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0.00
    return limit
  }

  function createTypekeyCovTerm(condition : PolicyCondition, currentCovTerm : TypekeyCovTerm, previousCovTerm : TypekeyCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0.00
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.CoverageCd = condition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0.00
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

  function createEffectivePeriod(policyCondition : PolicyCondition)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (policyCondition.EffectiveDate != null) {
      cov.EffectiveDt = new XmlDate(policyCondition.EffectiveDate)
    }
    if (policyCondition.ExpirationDate != null) {
      cov.ExpirationDt = new XmlDate(policyCondition.ExpirationDate)
    }
    return cov
  }

  abstract function createScheduleList(currentPolicyCondition : PolicyCondition, previousPolicyCondition : PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>


  abstract function createDeductibleScheduleList(currentPolicyCondition: PolicyCondition, previousPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
        : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType>

  abstract function createCoverableInfo(currentPolicyCondition : PolicyCondition, previousPolicyCondition : PolicyCondition) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType

}