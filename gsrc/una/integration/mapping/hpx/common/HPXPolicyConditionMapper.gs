package una.integration.mapping.hpx.common

uses gw.api.domain.covterm.GenericCovTerm
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.OptionCovTerm
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
  function createPolicyConditionInfo(currentPolicyCondition : PolicyCondition, transactions : java.util.List<Transaction>)
      : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.CoverageCd = currentPolicyCondition.PatternCode
    cov.PolicyConditionDesc = currentPolicyCondition.Pattern.Name
    var coverableInfo = createCoverableInfo(currentPolicyCondition)
    if (coverableInfo != null) {
      cov.addChild(new XmlElement("Coverable", coverableInfo))
    }
    var costInfo = createCoverageCostInfo(transactions)
    for (child in costInfo.$Children) { cov.addChild(child) }
    var scheduleList = createScheduleList(currentPolicyCondition, transactions)
    for (item in scheduleList) {cov.addChild(new XmlElement("Limit", item))}
    var deductibleScheduleList = createDeductibleScheduleList(currentPolicyCondition, transactions)
    for (item in deductibleScheduleList) {cov.addChild(new XmlElement("Deductible", item))}
    if (currentPolicyCondition.OwningCoverable typeis PolicyLine) {
      var covTermInfo = createCovTermInfo(currentPolicyCondition, transactions)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    } else {
      var covTermInfo = createCovTermInfo(currentPolicyCondition, transactions)
      for (child in covTermInfo.$Children) { cov.addChild(child) }
    }
    var effectiveDates = createEffectivePeriod(currentPolicyCondition)
    for (child in effectiveDates.$Children) { cov.addChild(child) }
    return cov
  }

  function createCovTermInfo(currentPolicyCondition : PolicyCondition, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    var currCovTerms = currentPolicyCondition.CovTerms
    currCovTerms?.sortBy(\ elt -> elt?.Pattern?.Name)
    for (currCovTerm in currCovTerms) {
      if (currCovTerm typeis DirectCovTerm) {
        var covTerms = createDirectCovTermInfo(currentPolicyCondition, currCovTerm, null, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      }
      else if (currCovTerm typeis OptionCovTerm) {
        var covTerms = createOptionCovTermInfo(currentPolicyCondition, currCovTerm, null, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      } else if (currCovTerm typeis GenericCovTerm) {
        var covTerms = createGenericCovTermInfo(currentPolicyCondition, currCovTerm, null, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      } else if (currCovTerm typeis TypekeyCovTerm) {
        var covTerms = createTypekeyCovTermInfo(currentPolicyCondition, currCovTerm, null, transactions)
        for (child in covTerms.$Children) { cov.addChild(child) }
      }
    }
    return cov
  }

  function createDirectCovTermInfo(currentPolicyCondition : PolicyCondition, currCovTerm : DirectCovTerm, prevCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createDirectLimitInfo(currentPolicyCondition, currCovTerm, transactions)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(new XmlElement("Deductible", createDirectDeductibleInfo(currentPolicyCondition, currCovTerm, transactions)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherDirectCovTerm(currentPolicyCondition, currCovTerm, transactions)))
    }
    return cov
  }

  function createOptionCovTermInfo(currentPolicyCondition : PolicyCondition, currCovTerm : OptionCovTerm, prevCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    if (currCovTerm.ModelType == typekey.CovTermModelType.TC_LIMIT) {
      cov.addChild(new XmlElement("Limit", createOptionLimitInfo(currentPolicyCondition, currCovTerm, transactions)))
    } else if (currCovTerm.ModelType == typekey.CovTermModelType.TC_DEDUCTIBLE ) {
      cov.addChild(new XmlElement("Deductible", createOptionDeductibleInfo(currentPolicyCondition, currCovTerm, transactions)))
    } else {
      cov.addChild(new XmlElement("Limit", createOtherOptionCovTerm(currentPolicyCondition, currCovTerm, transactions)))
    }
    return cov
  }

  function createGenericCovTermInfo(currentPolicyCondition : PolicyCondition, currCovTerm : GenericCovTerm, prevCovTerm : GenericCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.addChild(new XmlElement("Limit", createOtherGenericCovTerm(currentPolicyCondition, currCovTerm, transactions)))
    return cov
  }

  function createTypekeyCovTermInfo(currentPolicyCondition : PolicyCondition, currCovTerm : TypekeyCovTerm, prevCovTerm : TypekeyCovTerm, transactions : java.util.List<Transaction>)  : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType {
    var cov = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType()
    cov.addChild(new XmlElement("Limit", createTypekeyCovTerm(currentPolicyCondition, currCovTerm, transactions)))
    return cov
  }

  function createDirectLimitInfo(currentPolicyCondition : PolicyCondition, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CurrentTermAmt.Amt = 0
    limit.NetChangeAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createOptionLimitInfo(currentPolicyCondition : PolicyCondition, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()

    limit.CurrentTermAmt.Amt = 0
    limit.NetChangeAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.FormatText = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }
  function createOptionDeductibleInfo(currentPolicyCondition : PolicyCondition, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    var value = currentCovTerm.OptionValue.Value
    deductible.FormatCurrencyAmt.Amt = value
    deductible.FormatPct = 0
    deductible.CoverageCd = currentPolicyCondition.PatternCode
    deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = ""
    deductible.FormatText = ""
    return deductible
  }
  function createDirectDeductibleInfo(currentPolicyCondition : PolicyCondition, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
    var value = currentCovTerm.Value
    deductible.FormatCurrencyAmt.Amt = value
    deductible.FormatPct = 0
    deductible.CoverageCd = currentPolicyCondition.PatternCode
    deductible.CoverageSubCd = currentCovTerm.PatternCode
    deductible.DeductibleDesc = ""
    deductible.FormatText = ""
    return deductible
  }

  function createOtherOptionCovTerm(currentPolicyCondition : PolicyCondition, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.OptionValue?.Value != null ? currentCovTerm.OptionValue.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createOtherDirectCovTerm(currentPolicyCondition : PolicyCondition, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createOtherGenericCovTerm(currentPolicyCondition : PolicyCondition, currentCovTerm : GenericCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = currentPolicyCondition.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.LimitDesc = ""
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createTypekeyCovTerm(condition : PolicyCondition, currentCovTerm : TypekeyCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.FormatText = currentCovTerm?.Value != null ? currentCovTerm.Value : ""
    limit.CurrentTermAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.NetChangeAmt.Amt = 0
    limit.CoverageCd = condition.PatternCode
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

  abstract function createScheduleList(currentPolicyCondition : PolicyCondition, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>


  abstract function createDeductibleScheduleList(currentPolicyCondition: PolicyCondition, transactions : java.util.List<Transaction>)
        : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType>

  abstract function createCoverableInfo(currentPolicyCondition : PolicyCondition) : wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType

}