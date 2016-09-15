package una.integration.mapping.hpx.common
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 9/12/16
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCreditScoreMapper {
  function createCreditScoreInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.CreditScoreInfo {
    var creditScoreInfo = new wsi.schema.una.hpx.hpx_application_request.CreditScoreInfo()
    if (policyPeriod.CreditInfoExt.CreditReport.CreditScore != null) {
      var creditScore = new wsi.schema.una.hpx.hpx_application_request.CreditScore()
      creditScore.setText(policyPeriod.CreditInfoExt.CreditReport.CreditScore)
      creditScoreInfo.addChild(creditScore)
    }
    if (policyPeriod.CreditInfoExt.CreditReport.ProductReferenceNumber != null) {
      var ncfProductRef = new wsi.schema.una.hpx.hpx_application_request.ReferenceNumber()
      ncfProductRef.setText(policyPeriod.CreditInfoExt.CreditReport.ProductReferenceNumber)
      creditScoreInfo.addChild(ncfProductRef)
    }
    if (policyPeriod.CreditInfoExt.CreditReport.CreditScoreDate != null) {
      var creditScoreDate = new wsi.schema.una.hpx.hpx_application_request.ReferenceNumber()
      creditScoreDate.setText(policyPeriod.CreditInfoExt.CreditReport.CreditScoreDate)
      creditScoreInfo.addChild(creditScoreDate)
    }
    if (policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons != null) {
      for (reason in policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons) {
        var creditScoreReasonCd = new wsi.schema.una.hpx.hpx_application_request.CSReasonCd()
        var creditScoreReasonDesc = new wsi.schema.una.hpx.hpx_application_request.CSReasonDesc()
        creditScoreReasonCd.setText(reason.CreditStatusReasonCode + " - " + reason.CreditStatusReasonDesc)
        creditScoreInfo.addChild(creditScoreReasonCd)
      }
    }
    return creditScoreInfo
  }
}