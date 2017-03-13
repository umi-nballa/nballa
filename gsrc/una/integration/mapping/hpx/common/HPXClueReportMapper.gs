package una.integration.mapping.hpx.common
uses gw.xml.XmlElement
uses gw.xml.date.XmlDate
uses gw.xml.date.XmlDateTime
uses una.integration.mapping.hpx.homeowners.HPXDwellingPolicyMapper
uses una.utils.DateUtil
uses java.text.SimpleDateFormat

/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/26/16
 * Time: 11:03 AM
 * To change this template use File | Settings | File Templates.
 */
class HPXClueReportMapper {
  function createClueReport(priorLoss: HOPriorLoss_Ext, clueClaimInstance : int) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimsDocumentPublishType {
    var claimElement = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimsDocumentPublishType()
    var claimPropertyIncidentType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimPropertyIncidentType()
    var mortgageInformationType = new wsi.schema.una.hpx.hpx_application_request.types.complex.MortgageInformationType()
    var noteMapper = new HPXNoteMapper()
    var policyMapper = new HPXDwellingPolicyMapper()
    var sourceFormat = new SimpleDateFormat("dd/MM/yyyy");

    if(clueClaimInstance == 0)
    {
      for(clueMessage in priorLoss.ClueReport.messages)
      {
        var messageNote = noteMapper.createClueMessageNote(clueMessage)
        messageNote.ClaimNumber = priorLoss.ClaimNum != null ? priorLoss.ClaimNum : ""
        claimElement.addChild(new XmlElement("ClaimNotes", messageNote))
      }
      claimElement.addChild(new XmlElement("ClueSearchInfo", createClueSearchInfo(priorLoss)))
    }
    claimElement.ClaimID = priorLoss.ID != null ? priorLoss.ID : ""
    claimElement.addChild(new XmlElement("ClueHeader", createClueHeader(priorLoss.ClueReport)))
    claimElement.ClaimDate = priorLoss.ClaimDate != null ? new XmlDate(sourceFormat.parse(priorLoss.ClaimDate)) : new XmlDate()
    claimElement.ClaimAge = priorLoss.ClaimAge != null ? priorLoss.ClaimAge : ""
    claimElement.ClaimNumber = priorLoss.ClaimNum != null ? priorLoss.ClaimNum : ""
    claimElement.addChild(new XmlElement("PolicySummary", policyMapper.createPriorLossPolicySummaryInfo(priorLoss)))
    claimElement.AMB = priorLoss.AmBest != null ? priorLoss.AmBest : ""
    claimElement.CatastropheInd = priorLoss.CatastropheInica != null ? priorLoss.CatastropheInica : ""
    claimElement.addChild(new XmlElement("ClaimExposure", createClaimExposure(priorLoss)))
    claimElement.addChild(new XmlElement("LossLocation", createLossLocation(priorLoss)))
    claimElement.addChild(new XmlElement("ClaimPropertyIncident", createClaimPropertyIncident(priorLoss)))
    claimElement.LossDescription = priorLoss.LocationOfLoss != null ? priorLoss.LocationOfLoss : ""
    claimElement.ClueFileNumber = priorLoss.ClueFileNumber != null ? priorLoss.ClueFileNumber : ""
    for(clueNarrative in priorLoss.ClueReport.narratives)
    {
      var narrativeNote = noteMapper.createClueNarrativeNote(clueNarrative)
      narrativeNote.ClaimNumber = priorLoss.ClaimNum != null ? priorLoss.ClaimNum : ""
      claimElement.addChild(new XmlElement("ClaimNotes", narrativeNote))
    }
    for(claimPayment in priorLoss.ClaimPayment) {
      var clueLoss = createClueLossSummary(claimPayment)
      clueLoss.ClaimNumber = priorLoss.ClaimNum != null ? priorLoss.ClaimNum : ""
      claimElement.addChild(new XmlElement("ClueLossSummary", clueLoss))
    }
    return claimElement
  }

  function createClueHeader(clueReport : ClueReport_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClueHeaderType {
    var clueHeaderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueHeaderType()
    var sourceFormat = new SimpleDateFormat("dd/MM/yyyy");
    clueHeaderType.QuotebackID = clueReport.QuotebackID != null ? clueReport.QuotebackID : ""
    clueHeaderType.CaseID = clueReport.QuotebackID != null ? clueReport.QuotebackID : ""
    clueHeaderType.ReferenceNumber = clueReport.ReferenceNumber != null ? clueReport.ReferenceNumber : ""
    clueHeaderType.OrderDate = clueReport.OrderDate != null ? new XmlDate(sourceFormat.parse(clueReport.OrderDate)) : new XmlDate()
    clueHeaderType.Requestor = clueReport.Requestor != null ? clueReport.Requestor : ""
    clueHeaderType.AccountNumber = clueReport.AccountNumber != null ? clueReport.AccountNumber : ""
    clueHeaderType.CompleteDate = clueReport.CompleteDate != null ? new XmlDate(sourceFormat.parse(clueReport.CompleteDate)) : new XmlDate()
    clueHeaderType.ClueProcessingStatus = clueReport.ProcessingStatus != null ? clueReport.ProcessingStatus : ""
    clueHeaderType.ClueTotalRiskClaims = clueReport.RiskClaims != null ? clueReport.RiskClaims : ""
    clueHeaderType.ClueTotalSubjectClaims = clueReport.SubjectClaims != null ? clueReport.SubjectClaims : ""
    clueHeaderType.NodeLocation = clueReport.NodeLocation != null ? clueReport.NodeLocation : ""
    return clueHeaderType
  }

  function createClueSearchInfo(priorLoss : HOPriorLoss_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchInfoType {
    var clueSearchInfoType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchInfoType()
    var mortgageInformationType = new wsi.schema.una.hpx.hpx_application_request.types.complex.MortgageInformationType()
    var policyMapper = new HPXDwellingPolicyMapper()
    mortgageInformationType.LoanNumber = priorLoss.mortgageNum != null ? priorLoss.mortgageNum : ""
    mortgageInformationType.MortgageCompanyName = priorLoss.mortgageComp != null ? priorLoss.mortgageComp : ""
    clueSearchInfoType.addChild(new XmlElement("MortgageInformation", mortgageInformationType))
    if(priorLoss.ClueReport.Subject1 != null) {
      clueSearchInfoType.addChild(new XmlElement("ClueSearchSubject", createClueSearchSubject(priorLoss.ClueReport.Subject1)))
    }
    if(priorLoss.ClueReport.Subject2 != null) {
      clueSearchInfoType.addChild(new XmlElement("ClueSearchSubject", createClueSearchSubject(priorLoss.ClueReport.Subject2)))
    }
    clueSearchInfoType.addChild(new XmlElement("ClueSearchAddress", createClueSearchAddress(priorLoss.ClueReport)))
    clueSearchInfoType.addChild(new XmlElement("PolicySummary", policyMapper.createCluePolicySummaryInfo(priorLoss.ClueReport)))
    return clueSearchInfoType
  }

  function createClueSearchSubject(person : Person) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchSubjectType {
    var clueSearchSubjectType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchSubjectType()
    var genderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.GenderType()
    var contactMechanismType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ContactMechanismType()
    clueSearchSubjectType.PersonID = person.ID != null ? person.ID : ""
    clueSearchSubjectType.FirstName = person.FirstName != null ? person.FirstName : ""
    clueSearchSubjectType.LastName = person.LastName != null ? person.LastName : ""
    clueSearchSubjectType.FullName = person.DisplayName != null ? person.DisplayName : ""
    clueSearchSubjectType.SSN = person.SSNOfficialID != null ? person.SSNOfficialID : ""
    genderType.GenderID = person.Gender.Code != null ? person.Gender.Code: ""
    genderType.GenderCode = person.Gender.Code != null ? person.Gender.Code: ""
    genderType.GenderDesc = person.Gender.Description != null ? person.Gender.Description: ""
    clueSearchSubjectType.addChild(new XmlElement("Gender", genderType))
    clueSearchSubjectType.BirthDate = person.DateOfBirth != null ? new XmlDate(person.DateOfBirth) : new XmlDate()
    contactMechanismType.HomePhone = person.HomePhone != null ? person.HomePhone : ""
    clueSearchSubjectType.addChild(new XmlElement("ContactMechanism", contactMechanismType))
    return clueSearchSubjectType
  }

  function createClueLossSummary(claimPayment : ClaimPayment_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClueLossSummaryType {
    var clueLossSummaryType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueLossSummaryType()
    var typecodeMapper = gw.api.util.TypecodeMapperUtil.getTypecodeMapper()
    if(claimPayment.ClaimDisposition_Ext != null) {
      clueLossSummaryType.Disposition = claimPayment.ClaimDisposition_Ext != null ? claimPayment.ClaimDisposition_Ext.toString() :""
    }
    clueLossSummaryType.addChild(new XmlElement("LossCause", createLossCause(claimPayment.LossCause_Ext)))
    clueLossSummaryType.AmountPaid = claimPayment.ClaimAmount != null ? claimPayment.ClaimAmount : ""
    return clueLossSummaryType
  }

  function createClueSearchAddress(clueReport : ClueReport_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchAddressType {
    var clueSearchAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClueSearchAddressType()
    clueSearchAddressType.addChild(new XmlElement("PostalAddress", createPostalAddress(clueReport.MailAddress)))
    clueSearchAddressType.addChild(new XmlElement("RiskAddress", createRiskAddress(clueReport.RiskAddress)))
    clueSearchAddressType.addChild(new XmlElement("PriorAddress", createPriorAddress(clueReport.PriorAddress)))
    return clueSearchAddressType
  }

  function createPostalAddress(address : Address) : wsi.schema.una.hpx.hpx_application_request.types.complex.PostalAddressType {
    var postalAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PostalAddressType()
    postalAddressType.AddressID = address.ID != null ? address.ID : ""
    postalAddressType.AddressLine1 = address.AddressLine1 != null ? address.AddressLine1 : ""
    postalAddressType.AddressLine2 = address.AddressLine2 != null ? address.AddressLine2 : ""
    postalAddressType.AddressLine3 = address.AddressLine3 != null ? address.AddressLine3 : ""
    postalAddressType.City = address.City != null ? address.City : ""
    postalAddressType.State = address.State.Code != null ? address.State.Code : ""
    postalAddressType.Country = address.Country.Code != null ? address.Country.Code : ""
    postalAddressType.PostalCode = address.PostalCode != null ? address.PostalCode : ""
    return postalAddressType
  }

  function createPriorAddress(address : Address) : wsi.schema.una.hpx.hpx_application_request.types.complex.PriorAddressType {
    var priorAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PriorAddressType()
    priorAddressType.AddressID = address.ID != null ? address.ID : ""
    priorAddressType.AddressLine1 = address.AddressLine1 != null ? address.AddressLine1 : ""
    priorAddressType.AddressLine2 = address.AddressLine2 != null ? address.AddressLine2 : ""
    priorAddressType.AddressLine3 = address.AddressLine3 != null ? address.AddressLine3 : ""
    priorAddressType.City = address.City != null ? address.City : ""
    priorAddressType.State = address.State.Code != null ? address.State.Code : ""
    priorAddressType.Country = address.Country.Code != null ? address.Country.Code : ""
    priorAddressType.PostalCode = address.PostalCode != null ? address.PostalCode : ""
    return priorAddressType
  }

  function createRiskAddress(address : PolicyLocation) : wsi.schema.una.hpx.hpx_application_request.types.complex.RiskAddressType {
    var riskAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.RiskAddressType()
    riskAddressType.AddressID = address.ID != null ? address.ID : ""
    riskAddressType.AddressLine1 = address.AddressLine1 != null ? address.AddressLine1 : ""
    riskAddressType.AddressLine2 = address.AddressLine2 != null ? address.AddressLine2 : ""
    riskAddressType.AddressLine3 = address.AddressLine3 != null ? address.AddressLine3 : ""
    riskAddressType.City = address.City != null ? address.City : ""
    riskAddressType.State = address.State.Code != null ? address.State.Code : ""
    riskAddressType.Country = address.Country.Code != null ? address.Country.Code : ""
    riskAddressType.PostalCode = address.PostalCode != null ? address.PostalCode : ""
    return riskAddressType
  }

  function createClaimExposure(priorLoss : HOPriorLoss_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimExposureType {
    var claimExposureType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimExposureType()
    claimExposureType.addChild(new XmlElement("ClaimantRole", createClaimant(priorLoss)))
    return claimExposureType
  }

  function createClaimant(priorLoss : HOPriorLoss_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimantRoleType {
    var claimantRoleType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimantRoleType()
    var claimantType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimantType()
    var physicalAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PhysicalAddressType()
    var genderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.GenderType()
    var contactMechanismType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ContactMechanismType()
    var person = priorLoss.ClaimIssuer
    claimantType.ClaimNumber = priorLoss.ClaimNum != null ? priorLoss.ClaimNum : ""
    claimantType.PersonID = person.ID != null ? person.ID : ""
    claimantType.FirstName = person.FirstName != null ? person.FirstName : ""
    claimantType.LastName = person.LastName != null ? person.LastName : ""
    claimantType.FullName = person.DisplayName != null ? person.DisplayName : ""
    claimantType.SSN = person.SSNOfficialID != null ? person.SSNOfficialID : ""
    claimantType.BirthDate = person.DateOfBirth != null ? new XmlDate(person.DateOfBirth) : new XmlDate()
    claimantType.ClueMatchIndicator = priorLoss.CluePropertyMatch.ClaimantMatchIndicator != null ?  priorLoss.CluePropertyMatch.ClaimantMatchIndicator.Code : typekey.ClueMatchIndicator_Ext.TC_NOMATCH
    physicalAddressType.AddressLine1 = person.PrimaryAddress.AddressLine1 != null ? person.PrimaryAddress.AddressLine1 : ""
    physicalAddressType.City = person.PrimaryAddress.City != null ? person.PrimaryAddress.City : ""
    physicalAddressType.State = person.PrimaryAddress.State != null ? person.PrimaryAddress.State.Code : ""
    physicalAddressType.PostalCode = person.PrimaryAddress.PostalCode != null ? person.PrimaryAddress.PostalCode : ""
    genderType.GenderID = person.Gender.Code != null ? person.Gender.Code : ""
    genderType.GenderCode = person.Gender.Code != null ? person.Gender.Code : ""
    genderType.GenderDesc = person.Gender.Description != null ? person.Gender.Description : ""
    contactMechanismType.HomePhone = person.HomePhone != null ? person.HomePhone : ""
    claimantType.addChild(new XmlElement("PhysicalAddress", physicalAddressType))
    claimantType.addChild(new XmlElement("Gender", genderType))
    claimantType.addChild(new XmlElement("ContactMechanism", contactMechanismType))
    claimantRoleType.addChild(new XmlElement("Claimant", claimantType))
    return claimantRoleType
  }

  function createLossLocation(priorLoss : HOPriorLoss_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.LossLocationType {
    var lossLocationType = new wsi.schema.una.hpx.hpx_application_request.types.complex.LossLocationType()
    lossLocationType.AddressLine1 = priorLoss.Address != null ? priorLoss.Address : ""
    lossLocationType.City = priorLoss.City != null ? priorLoss.City : ""
    lossLocationType.State = priorLoss.State != null ? priorLoss.State : ""
    lossLocationType.PostalCode = priorLoss.Zip != null ? priorLoss.Zip : ""
    lossLocationType.ClueMatchIndicator = priorLoss.CluePropertyMatch.LocationOfLossMatchIndicator  != null ?  priorLoss.CluePropertyMatch.LocationOfLossMatchIndicator.Code : typekey.ClueMatchIndicator_Ext.TC_NOMATCH
    return lossLocationType
  }

  function createClaimPropertyIncident(priorLoss : HOPriorLoss_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimPropertyIncidentType {
    var claimPropertyIncidentType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ClaimPropertyIncidentType()
    var mortgageInformationType = new wsi.schema.una.hpx.hpx_application_request.types.complex.MortgageInformationType()
    mortgageInformationType.LoanNumber = priorLoss.mortgageNum != null ? priorLoss.mortgageNum : ""
    mortgageInformationType.MortgageCompanyName = priorLoss.mortgageComp != null ? priorLoss.mortgageComp : ""
    claimPropertyIncidentType.addChild(new XmlElement("MortgageInformation", mortgageInformationType))
    return claimPropertyIncidentType
  }

  function createLossCause(lossCause : LossCause_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.LossCauseType {
    var lossCauseType = new wsi.schema.una.hpx.hpx_application_request.types.complex.LossCauseType()
    lossCauseType.LossCauseType = lossCause.Code != null ? lossCause.Code : ""
    lossCauseType.LossCauseTypeCode = lossCause.Code != null ? lossCause.Code : ""
    lossCauseType.LossCauseTypeDesc = lossCause.Description != null ? lossCause.Description : ""
    return lossCauseType
  }
}