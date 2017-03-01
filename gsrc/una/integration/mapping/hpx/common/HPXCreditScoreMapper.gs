package una.integration.mapping.hpx.common

uses gw.xml.XmlElement
uses gw.xml.date.XmlDate
uses gw.xml.date.XmlDateTime
uses una.utils.DateUtil
uses java.text.SimpleDateFormat

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
    var report = creditReports.where( \ report -> report != null && report.ProductReference != null) .last()
    var creditScoreInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.CreditScoreInfoType()
    var sourceFormat = new SimpleDateFormat("dd/MM/yyyy");
    creditScoreInfo.CreditScore = report.CreditScore != null ? report.CreditScore : ""
    creditScoreInfo.ReferenceNumber = report.ProductReference != null ?  report.ProductReference : ""
    creditScoreInfo.CreditScoreDt = report.CreditScoreDate != null ? new XmlDate(report.CreditScoreDate) : null
    creditScoreInfo.CSReasonCd = report.CreditStatusReasons.Count > 0 and  report.CreditStatusReasons[0] != null ?
                                                                                                      report.CreditStatusReasons[0].CreditStatusReasonCode : ""
    creditScoreInfo.CSReasonDesc = report.CreditStatusReasons.Count > 0 and  report.CreditStatusReasons[0] != null ?
                                                                                                      report.CreditStatusReasons[0].CreditStatusReasonCode + " - " +
                                                                                                          report.CreditStatusReasons[0].CreditStatusReasonDesc  : ""
    creditScoreInfo.CaseID = report.Quoteback != null ? report.Quoteback : ""
    creditScoreInfo.Quoteback = report.Quoteback != null ? report.Quoteback : ""
    creditScoreInfo.Account = report.PncAccount != null ? report.PncAccount : ""
    creditScoreInfo.NodeLocation = report.ReportCode != null ? report.ReportCode : ""
    creditScoreInfo.UserID = report.UserID != null ? report.UserID : ""
    creditScoreInfo.ProcessingStatus = report.Status != null ? report.Status : ""
    creditScoreInfo.InquiryOptions = ""
    creditScoreInfo.AKA = ""
    creditScoreInfo.SpecialBillingID = ""
    creditScoreInfo.OrderDate = report.DateRequestOrdered != null ? new XmlDate(sourceFormat.parse(report.DateRequestOrdered)) : new XmlDate()
    creditScoreInfo.CompleteDate = report.DateRequestCompleted != null ? new XmlDate(sourceFormat.parse(report.DateRequestCompleted)) : new XmlDate()
    var creditMsgs = new List<String>()
    for(message in report.CreditStatusReasons) {
      creditMsgs.add(message.CreditStatusReasonCode + " - " + message.CreditStatusReasonDesc)
    }
    creditScoreInfo.CreditResponseMessage = creditMsgs

    var creditSearchSubjectType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchSubjectType()
    creditSearchSubjectType.FirstName = report.SearchFirstName != null ? report.SearchFirstName : ""
    creditSearchSubjectType.LastName = report.SearchLastName != null ? report.SearchLastName : ""
    creditSearchSubjectType.MiddleName = report.SearchMiddleName != null ? report.SearchMiddleName : ""
    creditSearchSubjectType.SSN = report.SearchSSN != null ? report.SearchSSN : ""
    creditSearchSubjectType.BirthDate = report.SearchDateOfBirth != null ? new XmlDate(report.SearchDateOfBirth) : new XmlDate()
    var clueSearchSubjectGenderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.GenderType()
    clueSearchSubjectGenderType.GenderID = report.SearchGender != null ? report.SearchGender : ""
    clueSearchSubjectGenderType.GenderCode = report.SearchGender != null ? report.SearchGender : ""
    clueSearchSubjectGenderType.GenderDesc = report.SearchGender != null ? report.SearchGender : ""
    clueSearchSubjectGenderType.addChild(new XmlElement("Gender", clueSearchSubjectGenderType))
    var physicalSearchAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PhysicalAddressType()
    physicalSearchAddressType.AddressLine1 = report.SearchAddressLine1 != null ? report.SearchAddressLine1 : ""
    physicalSearchAddressType.City = report.SearchAddressCity != null ? report.SearchAddressCity : ""
    physicalSearchAddressType.State = report.SearchAddressState != null ? report.SearchAddressState.Code : ""
    physicalSearchAddressType.PostalCode = report.SearchAddressZip != null ? report.SearchAddressZip : ""
    clueSearchSubjectGenderType.addChild(new XmlElement("PhysicalAddress", physicalSearchAddressType))
    creditScoreInfo.addChild(new XmlElement("CreditSearchSubject", creditSearchSubjectType))

    var clueResponseSubjectType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchSubjectType()
    clueResponseSubjectType.FirstName = report.FirstName != null ? report.FirstName : ""
    clueResponseSubjectType.LastName = report.LastName != null ? report.LastName : ""
    clueResponseSubjectType.MiddleName = report.MiddleName != null ? report.MiddleName : ""
    clueResponseSubjectType.SSN = report.SSN != null ? report.SSN : ""
    clueResponseSubjectType.BirthDate = report.DateOfBirth != null ? new XmlDate(report.DateOfBirth) : new XmlDate()
    var clueResponseSubjectGenderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.GenderType()
    clueResponseSubjectGenderType.GenderID = report.Gender != null ? report.Gender : ""
    clueResponseSubjectGenderType.GenderCode = report.Gender != null ? report.Gender : ""
    clueResponseSubjectGenderType.GenderDesc = report.Gender != null ? report.Gender : ""
    clueResponseSubjectType.addChild(new XmlElement("Gender", clueResponseSubjectGenderType))
    var physicalResponseAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PhysicalAddressType()
    physicalResponseAddressType.AddressLine1 = report.SearchAddressLine1 != null ? report.SearchAddressLine1 : ""
    physicalResponseAddressType.City = report.AddressCity != null ? report.AddressCity : ""
    physicalResponseAddressType.State = report.AddressState != null ? report.AddressState.Code : ""
    physicalResponseAddressType.PostalCode = report.AddressZip != null ? report.AddressZip : ""
    clueResponseSubjectType.addChild(new XmlElement("PhysicalAddress", physicalResponseAddressType))
    creditScoreInfo.addChild(new XmlElement("CreditResponseSubject", clueResponseSubjectType))

    var creditSearchAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchAddressType()
    var riskSearchAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.RiskAddressType()
    riskSearchAddressType.AddressLine1 = report.SearchAddressLine1 != null ? report.SearchAddressLine1 : ""
    riskSearchAddressType.City = report.SearchAddressCity != null ? report.SearchAddressCity : ""
    riskSearchAddressType.State = report.SearchAddressState != null ? report.SearchAddressState.Code : ""
    riskSearchAddressType.PostalCode = report.SearchAddressZip != null ? report.SearchAddressZip : ""
    creditSearchAddressType.addChild(new XmlElement("RiskAddress", riskSearchAddressType))
    creditScoreInfo.addChild(new XmlElement("CreditSearchAddress", creditSearchAddressType))

    var creditResponseAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchAddressType()
    var riskResponseAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.RiskAddressType()
    riskResponseAddressType.AddressLine1 = report.AddressLine1 != null ? report.AddressLine1 : ""
    riskResponseAddressType.City = report.AddressCity != null ? report.AddressCity : ""
    riskResponseAddressType.State = report.AddressState != null ? report.AddressState.Code : ""
    riskResponseAddressType.PostalCode = report.AddressZip != null ? report.AddressZip : ""
    creditResponseAddressType.addChild(new XmlElement("RiskAddress", riskResponseAddressType))
    creditScoreInfo.addChild(new XmlElement("CreditResponseAddress", creditResponseAddressType))

    //creditScores
    creditScores.add(creditScoreInfo)
    return creditScores
  }
}