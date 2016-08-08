package una.integration.mapping.hpx
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
}