package una.integration.mapping.hpx.common

uses gw.xml.date.XmlDate
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 9/12/16
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCreditScoreMapper {
  function createCreditScoreInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.CreditScoreInfoType {
    var creditScoreInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.CreditScoreInfoType()
    creditScoreInfo.CreditScore = policyPeriod.CreditInfoExt.CreditReport.CreditScore != null ? policyPeriod.CreditInfoExt.CreditReport.CreditScore : ""
    creditScoreInfo.ReferenceNumber = policyPeriod.CreditInfoExt.CreditReport.ProductReferenceNumber != null ? policyPeriod.CreditInfoExt.CreditReport.ProductReferenceNumber : ""
    creditScoreInfo.CreditScoreDt = policyPeriod.CreditInfoExt.CreditReport.CreditScoreDate != null ? new XmlDate(policyPeriod.CreditInfoExt.CreditReport.CreditScoreDate) : null
    creditScoreInfo.CSReasonCd = policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons.Count > 0 and  policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons[0] != null ?
                                                                                                      policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons[0].CreditStatusReasonCode : ""
    creditScoreInfo.CSReasonDesc = policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons.Count > 0 and  policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons[0] != null ?
                                                                                                      policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons[0].CreditStatusReasonCode + " - " +
                                                                                                            policyPeriod.CreditInfoExt.CreditReport.CreditStatusReasons[0].CreditStatusReasonDesc  : ""
    return creditScoreInfo
  }
}