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
  function createCreditScoreInfo(creditReports : CreditReportExt[]) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CreditScoreInfoType> {
    var creditScores = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CreditScoreInfoType>()
    for (report in creditReports) {
      var creditScoreInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.CreditScoreInfoType()
      creditScoreInfo.CreditScore = report.CreditScore != null ? report.CreditScore : ""
      creditScoreInfo.ReferenceNumber = report.ProductReferenceNumber != null ? report.ProductReferenceNumber : ""
      creditScoreInfo.CreditScoreDt = report.CreditScoreDate != null ? new XmlDate(report.CreditScoreDate) : null
      creditScoreInfo.CSReasonCd = report.CreditStatusReasons.Count > 0 and  report.CreditStatusReasons[0] != null ?
                                                                                                        report.CreditStatusReasons[0].CreditStatusReasonCode : ""
      creditScoreInfo.CSReasonDesc = report.CreditStatusReasons.Count > 0 and  report.CreditStatusReasons[0] != null ?
                                                                                                        report.CreditStatusReasons[0].CreditStatusReasonCode + " - " +
                                                                                                            report.CreditStatusReasons[0].CreditStatusReasonDesc  : ""
      creditScores.add(creditScoreInfo)
    }
    return creditScores
  }
}