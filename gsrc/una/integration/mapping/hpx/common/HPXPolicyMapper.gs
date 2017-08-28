package una.integration.mapping.hpx.common

uses una.integration.mapping.hpx.common.HPXBillingInfoMapper
uses una.integration.mapping.hpx.homeowners.HPXDwellingPolicyMapper
uses una.integration.mapping.hpx.common.HPXGeneralPartyInfoMapper
uses una.integration.mapping.hpx.common.HPXJobMapper
uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
uses una.integration.mapping.hpx.common.HPXPaymentOptionMapper
uses una.integration.mapping.hpx.common.HPXEstimatedDiscount
uses gw.xml.XmlElement
uses wsi.schema.una.hpx.hpx_application_request.types.complex.ItemIdInfoType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.FullTermAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.RecoveryAssessmentAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.ChangeRecoveryAssessmentAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.PremiumChangeAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.NetChangeAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.WrittenAmtType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.BillingInfoType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.OtherOrPriorPolicyType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.ReinstateInfoType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.RenewalInfoType
uses wsi.schema.una.hpx.hpx_application_request.types.complex.FeeType
uses gw.xml.date.XmlDate
uses una.integration.mapping.hpx.helper.HPXJobHelper
uses una.integration.mapping.hpx.helper.HPXPolicyPeriodHelper
uses java.math.BigDecimal
uses una.utils.PropertiesHolder
uses java.util.Date
uses una.integration.mapping.hpx.common.composition.HPXAllFormsCompositionUnitMapper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/2/16
 * Time: 8:54 AM
 * To change this template use File | Settings | File Templates.
 */
abstract class HPXPolicyMapper {

  function createItemIdInfo() : wsi.schema.una.hpx.hpx_application_request.types.complex.ItemIdInfoType {
    var itemIdInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.ItemIdInfoType()
    itemIdInfo.AgencyId = 0
    itemIdInfo.InsurerId = 0
    itemIdInfo.SystemId = "00000000-0000-0000-0000-000000000000"
    itemIdInfo.OtherIdentifier.OtherId = java.util.UUID.randomUUID().toString()
    itemIdInfo.OtherIdentifier.OtherIdTypeCd = "DocID"
    return itemIdInfo
  }

  /************************************** Policy Summary Info ******************************************************/
  function createPolicySummaryInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryInfoType {
    var transactionMapper = new HPXJobMapper ()
    var billingInfoMapper = new HPXBillingInfoMapper ()
    var policySummaryInfo = transactionMapper.createJobStatus(policyPeriod, this)
    policySummaryInfo.addChild(new XmlElement("ItemIdInfo", createItemIdInfo()))
    policySummaryInfo.RecoveryAssessmentPct = 0
    policySummaryInfo.QuoteInd = false
    policySummaryInfo.FileNumber = ""
    var uwCompany = new wsi.schema.una.hpx.hpx_application_request.types.complex.UWCompanyType()
    uwCompany.UWCompanyRoleID = "InsuranceCarrier"
    uwCompany.addChild(new XmlElement("InsuranceProvider", createInsuranceProvider()))
    policySummaryInfo.addChild(new XmlElement("UWCompany", createUWCompanyInfo(policyPeriod)))
    var allCosts = policyPeriod.AllCosts.sum(\ elt -> elt.ActualTermAmount)
    policySummaryInfo.WrittenAmt.Amt = allCosts.Amount
    var glCosts = policyPeriod.GLLineExists ? policyPeriod.GLLine.Costs.sum(\ elt -> elt.ActualTermAmount).Amount : null
    policySummaryInfo.GeneralLiabilityWrittenAmt.Amt = glCosts
    var cpBuildingCosts = policyPeriod.CPLineExists ?  policyPeriod.CPLine.Costs.whereTypeIs(CPBuildingCovCost).sum(\ elt -> elt.ActualTermAmount).Amount : null
    policySummaryInfo.CommercialPropertyBuildingWrittenAmt.Amt = cpBuildingCosts
    var cpLineCosts = policyPeriod.CPLineExists ? policyPeriod.CPLine.Costs.whereTypeIs(CPLineCovCost).sum(\ elt -> elt.ActualTermAmount).Amount : null
    policySummaryInfo.CommercialPropertyLineWrittenAmt.Amt = cpLineCosts
    return policySummaryInfo
  }

  /************************************** Policy Summary Info For Clue Report  ******************************************************/
  function createCluePolicySummaryInfo(clueReport : ClueReport_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryType {
    var transactionMapper = new HPXJobMapper ()
    var billingInfoMapper = new HPXBillingInfoMapper ()
    var policySummaryInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryType()
    policySummaryInfo.PolicyNumber = clueReport.PolicyNumber != null ? clueReport.PolicyNumber : ""
    policySummaryInfo.LOB = clueReport.PolicyType != null ? clueReport.PolicyType : ""
    policySummaryInfo.addChild(new XmlElement("UWCompany", createUWCompany(clueReport.PolicyCompany)))
    return policySummaryInfo
  }

  function createPriorLossPolicySummaryInfo(priorLoss : HOPriorLoss_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryType {
    var transactionMapper = new HPXJobMapper ()
    var billingInfoMapper = new HPXBillingInfoMapper ()
    var policySummaryInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryType()
    policySummaryInfo.PolicyNumber = priorLoss.PolicyNum != null ? priorLoss.PolicyNum : ""
    policySummaryInfo.LOB = priorLoss.PropertyType != null ? priorLoss.PropertyType : ""
    policySummaryInfo.addChild(new XmlElement("UWCompany", createUWCompany(priorLoss.PolicyCompany)))
    policySummaryInfo.addChild(new XmlElement("PolicyHolder", createPriorLossPolicyHolder(priorLoss)))
    return policySummaryInfo
  }

  function createPriorLossPolicyHolder(priorLoss : HOPriorLoss_Ext) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyHolderType {
    var policyHolderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyHolderType()
    policyHolderType.FullName = priorLoss.PolicyHolderName != null ? priorLoss.PolicyHolderName : ""
    policyHolderType.ClueMatchIndicator = priorLoss.CluePropertyMatch.InsuredMatchIndicator != null ? priorLoss.CluePropertyMatch.InsuredMatchIndicator.Code : typekey.ClueMatchIndicator_Ext.TC_NOMATCH
    policyHolderType.addChild(new XmlElement("PersonHolder", createPriorLossPersonHolderType(priorLoss.PolicyHolder)))
    return policyHolderType
  }

  function createPriorLossPersonHolderType(person : Person) : wsi.schema.una.hpx.hpx_application_request.types.complex.PersonHolderType {
    var personHolderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PersonHolderType()
    var physicalAddressType = new wsi.schema.una.hpx.hpx_application_request.types.complex.PhysicalAddressType()
    var genderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.GenderType()
    var contactMechanismType = new wsi.schema.una.hpx.hpx_application_request.types.complex.ContactMechanismType()
    personHolderType.FirstName = person.FirstName != null ? person.FirstName : ""
    personHolderType.LastName = person.LastName != null ? person.LastName : ""
    personHolderType.SSN = person.SSNOfficialID != null ? person.SSNOfficialID : ""
    personHolderType.BirthDate = person.DateOfBirth != null ? new XmlDate(person.DateOfBirth) : null
    physicalAddressType.AddressLine1 = person.PrimaryAddress.AddressLine1 != null ? person.PrimaryAddress.AddressLine1 : ""
    physicalAddressType.City = person.PrimaryAddress.City != null ? person.PrimaryAddress.City : ""
    physicalAddressType.State = person.PrimaryAddress.State != null ? person.PrimaryAddress.State : null
    physicalAddressType.PostalCode = person.PrimaryAddress.PostalCode != null ? person.PrimaryAddress.PostalCode : ""
    genderType.GenderID = person.Gender.Code != null ? person.Gender.Code : ""
    genderType.GenderCode = person.Gender.Code != null ? person.Gender.Code : ""
    genderType.GenderDesc = person.Gender.Code != null ? person.Gender.Code : ""
    contactMechanismType.HomePhone = person.HomePhone != null ? person.HomePhone : ""
    personHolderType.addChild(new XmlElement("PhysicalAddress", physicalAddressType))
    personHolderType.addChild(new XmlElement("Gender", genderType))
    personHolderType.addChild(new XmlElement("ContactMechanism", contactMechanismType))
    return personHolderType
  }

  function createUWCompanyInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.UWCompanyType {
    var uwCompany = new wsi.schema.una.hpx.hpx_application_request.types.complex.UWCompanyType()
    uwCompany.UWCompanyRoleID = policyPeriod.UWCompany
    uwCompany.addChild(new XmlElement("InsuranceProvider", createInsuranceProvider()))
    return uwCompany
  }

  function createUWCompany(policyCompany : String) : wsi.schema.una.hpx.hpx_application_request.types.complex.UWCompanyType {
    var uwCompanyType = new wsi.schema.una.hpx.hpx_application_request.types.complex.UWCompanyType()
    var insuranceProviderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.InsuranceProviderType()
    insuranceProviderType.OrganizationName = policyCompany != null ? policyCompany : ""
    uwCompanyType.addChild(new XmlElement("InsuranceProvider", insuranceProviderType))
    return uwCompanyType
  }

  function createInsuranceProvider() : wsi.schema.una.hpx.hpx_application_request.types.complex.InsuranceProviderType {
    var carrier = new wsi.schema.una.hpx.hpx_application_request.types.complex.InsuranceProviderType()
    carrier.OrganizationName = "Universal North America"
    carrier.OfficeLocation.LocationID = 1
    carrier.OfficeLocation.LocationCode = PropertiesHolder.getProperty("HPX_Carrier_Address_City")
    carrier.OfficeLocation.LocationName = PropertiesHolder.getProperty("HPX_Carrier_Name")
    carrier.OfficeLocation.IsPrincipalLocation = true
    carrier.OfficeLocation.addChild(new XmlElement("PhysicalAddress", createCarrierPhyiscalAddress()))
    carrier.OfficeLocation.addChild(new XmlElement("ContactMechanisms", createCarrierContactMechanisms()))
    return carrier
  }

  function createCarrierPhyiscalAddress() : wsi.schema.una.hpx.hpx_application_request.types.complex.PhysicalAddressType {
    var address = new wsi.schema.una.hpx.hpx_application_request.types.complex.PhysicalAddressType()
    address.AddressLine1 = PropertiesHolder.getProperty("HPX_Carrier_Address_Street")
    address.City = PropertiesHolder.getProperty("HPX_Carrier_Address_City")
    address.State = PropertiesHolder.getProperty("HPX_Carrier_Address_State")
    address.Country = PropertiesHolder.getProperty("HPX_Carrier_Address_Country")
    address.PostalCode = PropertiesHolder.getProperty("HPX_Carrier_Address_Zipcode")
    return address
  }

  function createCarrierContactMechanisms() : wsi.schema.una.hpx.hpx_application_request.types.complex.ContactMechanismsType {
    var contactMechanisms = new wsi.schema.una.hpx.hpx_application_request.types.complex.ContactMechanismsType()
    contactMechanisms.WorkPhone = PropertiesHolder.getProperty("HPX_Carrier_Phone_Number")
    return contactMechanisms
  }

  /************************************** Insured Or Principal ******************************************************/
  function createInsuredOrPrincipal(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType {
    var primaryNamedInsuredMapper = new HPXPrimaryNamedInsuredMapper()
    return primaryNamedInsuredMapper.createPrimaryNamedInsured(policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact,
                                                               policyPeriod.PrimaryNamedInsured, policyPeriod.Policy.Account.AccountOrgType)
  }

  /*************************************  Policy Detail ************************************************************/
  function createPolicyDetails(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyInfoType {
    var dwellingPolicyMapper = new HPXDwellingPolicyMapper()
    var transactionMapper = new HPXJobMapper ()
    var billingInfoMapper = new HPXBillingInfoMapper()
    var paymentOptionMapper = new HPXPaymentOptionMapper()
    var priorPoliciesMapper = new HPXPriorPolicyMapper()
    var producerMapper = new HPXProducerMapper()
    var policyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyInfoType()
    policyInfo.LOBCd = policyPeriod.HomeownersLine_HOEExists ? typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE :
                       policyPeriod.BP7LineExists ? typekey.PolicyLine.TC_BP7BUSINESSOWNERSLINE :
                       policyPeriod.CPLineExists ? typekey.PolicyLine.TC_COMMERCIALPROPERTYLINE :
                       policyPeriod.GLLineExists ? typekey.PolicyLine.TC_GENERALLIABILITYLINE : ""
    policyInfo.PolicyNumber = policyPeriod.PolicyNumber != null ? policyPeriod.PolicyNumber : ""
    policyInfo.AccountNumberId = policyPeriod.Policy.Account.AccountNumber
    policyInfo.PolicyTermCd = policyPeriod.TermType
    policyInfo.ContractTerm.EffectiveDt = new XmlDate(policyPeriod.PeriodStart)
    policyInfo.ContractTerm.ExpirationDt = new XmlDate(policyPeriod.PeriodEnd)
    policyInfo.TermProcessDt = new XmlDate(policyPeriod.WrittenDate)
    policyInfo.ControllingStateProvCd = policyPeriod.BaseState
    var jobCreationUser = transactionMapper.createJobCreationUser(policyPeriod)
    policyInfo.addChild(new XmlElement("MiscParty", jobCreationUser))
    var priorPoliciesInfo = priorPoliciesMapper.createPriorPolicies(policyPeriod)
    for (priorPolicyInfo in priorPoliciesInfo) {
      policyInfo.addChild(new XmlElement("OtherOrPriorPolicy", priorPolicyInfo))
    }
    policyInfo.TierCd = policyPeriod.EffectiveDatedFields.ProducerCode.Organization.Tier
    policyInfo.TierDesc = policyPeriod.EffectiveDatedFields.ProducerCode.Organization.Tier.Description
    policyInfo.BranchDesc = policyPeriod.EffectiveDatedFields.ProducerCode.Branch
    if (policyPeriod.Job.Subtype == typekey.Job.TC_ISSUANCE or policyPeriod.Job.Subtype == typekey.Job.TC_RENEWAL or
        policyPeriod.Job.Subtype == typekey.Job.TC_SUBMISSION or policyPeriod.Job.Subtype == typekey.Job.TC_REWRITENEWACCOUNT or
        policyPeriod.Job.Subtype == typekey.Job.TC_REWRITE) {
      var paymentOptions = paymentOptionMapper.createPaymentOptions(policyPeriod)
      for (paymentOption in paymentOptions) {
        policyInfo.addChild(new XmlElement("PaymentOption", paymentOption))
      }
      var quoteMapper = new HPXQuoteMapper()
      var quote = quoteMapper.createQuote(policyPeriod)
      policyInfo.addChild(new XmlElement("QuoteInfo", quote))
    }
    var policyFormsMapper = new HPXAllFormsCompositionUnitMapper()
    var allPolicyForms = policyFormsMapper.createDocumentForms(policyPeriod.NewlyAddedForms)
    for (policyForm in allPolicyForms) {
      policyInfo.addChild(new XmlElement("Form", policyForm))
    }
    var uwDeclined = policyPeriod.UWIssuesActiveOnly.length
    if (uwDeclined) {
      var declinationReasons = createDeclinationReasons(policyPeriod)
      var declinationReasonsCredit = createDeclinationReasonsCredit(policyPeriod)
      if (declinationReasonsCredit != null) {
        declinationReasons.addAll(createDeclinationReasonsCredit(policyPeriod))
      }
      for (reason in declinationReasons) {
        policyInfo.addChild(new XmlElement("DeclinationInfo", reason))
      }
    }
    return policyInfo
  }

  function createQuestionSet(policyPeriod: PolicyPeriod): List<wsi.schema.una.hpx.hpx_application_request.types.complex.QuestionAnswerType> {
    var questions = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.QuestionAnswerType>()
    var questionAnswers = policyPeriod.PeriodAnswers
    for (q in questionAnswers) {
      var question = new wsi.schema.una.hpx.hpx_application_request.types.complex.QuestionAnswerType()
      question.QuestionText = q.Question.Text != null ? q.Question.Text : ""
      question.QuestionCd = q.QuestionCode
      question.YesNoCd = q.BooleanAnswer != null ? q.BooleanAnswer : 0
      question.Explanation = q?.Question?.SupplementalTexts?.atMostOne()?.Text != null ? q.Question.SupplementalTexts.atMostOne().Text : ""
      questions.add(question)
    }
    return questions
  }

  function createStructuresInfo(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType> {
    var structures = new java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType>()
    var coverableStructures = getStructures(policyPeriod)
    for (coverableStructure in coverableStructures) {
      var propertyStructure = createPropertyInfo(coverableStructure)
      var location = createLocationInfo(coverableStructure)
      propertyStructure.addChild(new XmlElement("Location", location))
      var structureClassifications = getClassifications(coverableStructure)
      for (structureClassification in structureClassifications) {
        var buildingClassification = createClassificationInfo(structureClassification)
        propertyStructure.addChild(new XmlElement("BP7Classification", buildingClassification))
      }
      structures.add(propertyStructure)
    }
    return structures
  }

  private function createPropertyInfo(coverableStructure : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType {
    var structureMapper = getStructureMapper()
    var propertyStructure = structureMapper.createStructure(coverableStructure)
    var policyPeriod = coverableStructure.PolicyLine.AssociatedPolicyPeriod
    var strucureCovs = createCoveragesInfo(getStructureCoverages(policyPeriod, coverableStructure),getStructureCoverageTransactions(policyPeriod, coverableStructure))
    for (cov in strucureCovs) { propertyStructure.addChild(new XmlElement("Coverage", cov))}
    var structureExclusions = createExclusionsInfo(getStructureExclusions(policyPeriod, coverableStructure), getStructureCoverageTransactions(policyPeriod, coverableStructure))
    for (excl in structureExclusions) { propertyStructure.addChild(new XmlElement("Exclusion", excl))}
    var structurePolicyConditions = createPolicyConditionsInfo(getStructurePolicyConditions(policyPeriod, coverableStructure), getStructureCoverageTransactions(policyPeriod, coverableStructure))
    for (cond in structurePolicyConditions) { propertyStructure.addChild(new XmlElement("PolicyCondition", cond))}
    var additionalInts = getAdditionalInterests(coverableStructure)
    var additionalInterests = createAdditionalInterests(additionalInts, coverableStructure, structureMapper)
    for (additionalInterest in additionalInterests) { propertyStructure.addChild(new XmlElement("AdditionalInterest", additionalInterest))}
    return propertyStructure
  }

  private function createLocationInfo(coverableStructure : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.LocationType {
    var structureLoc = getLocation(coverableStructure)
    var locationMapper = new HPXLocationMapper()
    var policyPeriod = coverableStructure.PolicyLine.AssociatedPolicyPeriod
    var location = locationMapper.createLocation(structureLoc)
    var locationCovs = createCoveragesInfo(getLocationCoverages(policyPeriod, coverableStructure), getLocationCoverageTransactions(policyPeriod, coverableStructure))
    var locationExclusions = createExclusionsInfo(getLocationExclusions(policyPeriod, coverableStructure), getLocationCoverageTransactions(policyPeriod, coverableStructure))
    var locationPolicyConditions = createPolicyConditionsInfo(getLocationPolicyConditions(policyPeriod, coverableStructure), getLocationCoverageTransactions(policyPeriod, coverableStructure))
    for (loc in locationCovs) { location.addChild(new XmlElement("Coverage", loc))}
    for (locExcl in locationExclusions) { location.addChild(new XmlElement("Exclusion", locExcl))}
    for (locCond in locationPolicyConditions) { location.addChild(new XmlElement("PolicyCondition", locCond))}
    return location
  }

  private function createClassificationInfo(structureClassification : Coverable) : wsi.schema.una.hpx.hpx_application_request.types.complex.BP7ClassificationType {
    var classificationMapper = getClassificationMapper ()
    var policyPeriod = structureClassification.PolicyLine.AssociatedPolicyPeriod
    var buildingClassification = classificationMapper.createClassification(structureClassification)
    var classificationCovs = createCoveragesInfo(getClassificationCoverages(policyPeriod, structureClassification), getClassificationCoverageTransactions(policyPeriod, structureClassification))
    for (classification in classificationCovs) { buildingClassification.addChild(new XmlElement("Coverage", classification))}
    var classificationExclusions = createExclusionsInfo(getClassificationExclusions(policyPeriod, structureClassification), getClassificationCoverageTransactions(policyPeriod, structureClassification))
    for (classificationExclusion in classificationExclusions) { buildingClassification.addChild(new XmlElement("Exclusion", classificationExclusion))}
    var classificationPolicyConditions = createPolicyConditionsInfo(getClassificationPolicyConditions(policyPeriod, structureClassification), getClassificationCoverageTransactions(policyPeriod, structureClassification))
    for (classificationCond in classificationPolicyConditions) { buildingClassification.addChild(new XmlElement("PolicyCondition", classificationCond))}
    return buildingClassification
  }

  function createLineCoverages(policyPeriod : PolicyPeriod, policyLine : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createCoveragesInfo(getLineCoverages(getPolicyLine(policyPeriod)), getLineCoverageTransactions(policyPeriod, policyLine))
  }

  function createLineExclusions(policyPeriod : PolicyPeriod, policyLine : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createExclusionsInfo(getLineExclusions(getPolicyLine(policyPeriod)), getLineCoverageTransactions(policyPeriod, policyLine))
  }

  function createLinePolicyConditions(policyPeriod : PolicyPeriod, policyLine : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    return createPolicyConditionsInfo(getLinePolicyConditions(getPolicyLine(policyPeriod)), getLineCoverageTransactions(policyPeriod, policyLine))
  }

  function createCoveragesInfo (currentCoverages : java.util.List<Coverage>, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var jobHelper = new HPXJobHelper()
    currentCoverages?.sortBy(\ elt -> elt?.Pattern?.Name)
    var changedCoveragePatterns = jobHelper.getChangedCoveragePatterns(currentCoverages?.first().PolicyLine.AssociatedPolicyPeriod, currentCoverages?.first().OwningCoverable)
    for (cov in currentCoverages) {
      var trxs = transactions.where( \ elt -> cov.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
     // if (cov.PolicyLine.AssociatedPolicyPeriod.BasedOn == null or changedCoveragePatterns.contains(cov.PatternCode)) {
        coverages.add(getCoverageMapper().createCoverageInfo(cov, trxs))
     // }
    }
    return coverages
  }

  function createExclusionsInfo (currentExclusions : java.util.List<Exclusion>, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    currentExclusions?.sortBy(\ elt -> elt?.Pattern?.Name)
    for (excl in currentExclusions) {
      var trxs = transactions.where( \ elt -> excl.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
        coverages.add(getExclusionMapper().createExclusionInfo(excl, trxs))
    }
    return coverages
  }

  function createPolicyConditionsInfo (currentPolicyConditions : java.util.List<PolicyCondition>, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    currentPolicyConditions?.sortBy(\ elt -> elt?.Pattern?.Name)
    for (cond in currentPolicyConditions) {
      var trxs = transactions.where( \ elt -> cond.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
        coverages.add(getPolicyConditionMapper().createPolicyConditionInfo(cond, trxs))
    }
    return coverages
  }

  function createDiscounts(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType> {
    var discounts = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType>()
    var discnts = policyPeriod.AllCosts.where( \ elt -> getDiscountCostTypes().contains(getDiscountCostType(elt)) )
    for (cost in discnts) {
      var discount = new wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType()
      discount.DiscountCd = getDiscountCostType(cost)
      discount.DiscountDescription = cost.DisplayName
      discount.DiscountAmount.Amt = cost.ActualTermAmount.Amount
      discount.DiscountPercent.Amt = cost.ActualBaseRate != null ? cost.ActualBaseRate * 100 : 0
      discounts.add(discount)
    }
    return discounts
  }

  function createEstimatedInsuranceScoreDiscounts(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType> {
    var discounts = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType>()
    var estimatedDiscounts = getEstimatedInsScoreDiscounts(policyPeriod)
    for (estimatedDiscount in estimatedDiscounts) {
      var discount = new wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType()
      discount.DiscountCd = estimatedDiscount.Code
      discount.DiscountDescription = estimatedDiscount.Description
      discount.DiscountPercent.Amt = estimatedDiscount.Percent
      discounts.add(discount)
    }
    return discounts
  }

  function createEstimatedWindDiscounts(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType> {
    var discounts = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType>()
    var estimatedDiscounts = getEstimatedWindDiscounts(policyPeriod)
    var windPremium = getHurricaneWindPremium(policyPeriod)
    for (estimatedDiscount in estimatedDiscounts) {
      var discount = new wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType()
      discount.DiscountCd = estimatedDiscount.Code
      discount.DiscountDescription = estimatedDiscount.Description
      discount.DiscountPercent.Amt = estimatedDiscount.Percent
      discount.DiscountAmount.Amt = windPremium != null ? estimatedDiscount.Percent * windPremium / 100 : 0
      discounts.add(discount)
    }
    return discounts
  }

  function createEstimatedBCEGDiscounts(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType> {
    var discounts = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType>()
    var estimatedDiscounts = getEstimatedBCEGDiscounts(policyPeriod)
    var windPremium = getHurricaneWindPremium(policyPeriod)
    for (estimatedDiscount in estimatedDiscounts) {
      var discount = new wsi.schema.una.hpx.hpx_application_request.types.complex.DiscountType()
      discount.DiscountCd = estimatedDiscount.Code
      discount.DiscountDescription = estimatedDiscount.Description
      discount.DiscountPercent.Amt = estimatedDiscount.Percent
      discount.DiscountAmount.Amt = windPremium != null ? estimatedDiscount.Percent * windPremium / 100 : 0
      discounts.add(discount)
    }
    return discounts
  }

  function createEstimatedPremiums(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.EstimatedPremiumType> {
    var estPremiums = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.EstimatedPremiumType>()
    var estimatedPremiums = getEstimatedPremiums(policyPeriod)
    for (estimatedPremium in estimatedPremiums) {
      var estPremium = new wsi.schema.una.hpx.hpx_application_request.types.complex.EstimatedPremiumType()
      estPremium.EstimatedPremiumCd = estimatedPremium.Code
      estPremium.EstimatedPremiumDescription = estimatedPremium.Description
      estPremium.ExposureAmount.Amt = estimatedPremium.Exposure
      estPremium.DeductibleAmount.Amt = estimatedPremium.Deductible
      estPremium.PremiumAmount.Amt = estimatedPremium.Premium
      estPremiums.add(estPremium)
    }
    return estPremiums
  }

  function createAdditionalInterests(additionalInterestDetails : AddlInterestDetail [], coverable : Coverable, mapper : HPXStructureMapper) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType> {
    var additionalInterestMapper = new HPXAdditionalInterestMapper()
    var additionalInterests = additionalInterestMapper.createAdditionalInterests(additionalInterestDetails, mapper, coverable)
    return additionalInterests
  }


 function createDeclinationReasons(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType> {
   var declinationReasons : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType>
   if (policyPeriod.Job typeis Submission) {
     declinationReasons = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType>()
      if ((policyPeriod.Job as Submission).RejectReason != null) {
        var declination = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType()
        declination.DeclinationReasonCategory =  "UserEntered"
        declination.DeclinationReasonCd = (policyPeriod.Job as Submission).RejectReason
        declination.DeclinationReasonDescription = (policyPeriod.Job as Submission).RejectReasonText
        declinationReasons.add(declination)
      }
     // UW Issues
     var uwIssues = policyPeriod.UWIssuesActiveOnly
     for (issue in uwIssues) {
       var uwReason = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType()
       uwReason.DeclinationReasonCategory =  "UWReason"
       uwReason.DeclinationReasonCd = issue.IssueType.Code
       uwReason.DeclinationReasonDescription = issue.DisplayName
       declinationReasons.add(uwReason)
     }
   }
   return declinationReasons
 }

  function createDeclinationReasonsCredit(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType> {
    var declinationReasons : List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType>
    var creditReportsInsured = policyPeriod.PolicyContactRoles.whereTypeIs(PolicyPriNamedInsured).CreditReportsExt
    var creditReportsAdditionalNamedInsured = policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlNamedInsured).CreditReportsExt
    var creditReportsAdditionalInsured = policyPeriod.PolicyContactRoles.whereTypeIs(PolicyAddlInsured).CreditReportsExt
    var creditReasons = creditReportsInsured.CreditStatusReasons.toList()
    creditReasons.addAll(creditReportsAdditionalNamedInsured.CreditStatusReasons.toList())
    creditReasons.addAll(creditReportsAdditionalInsured.CreditStatusReasons.toList())
    if (!creditReasons.Empty) {
      declinationReasons = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType>()
      for (reason in creditReasons.where( \ elt -> elt.CreditStatusReasonCode != null)) {
        var declination = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeclinationInfoType()
        declination.DeclinationReasonCategory =  "CreditStatus"
        declination.DeclinationReasonCd = reason.CreditStatusReasonCode
        declination.DeclinationReasonDescription = reason.CreditStatusReasonDesc
        declinationReasons.add(declination)
      }
    }
    return declinationReasons
  }

  abstract function getCoverages(policyPeriod : PolicyPeriod) : java.util.List<Coverage>

  abstract function getExclusions(policyPeriod : PolicyPeriod) : java.util.List<Exclusion>

  abstract function getPolicyConditions(policyPeriod : PolicyPeriod) : java.util.List<PolicyCondition>

  abstract function getTransactions(policyPeriod : PolicyPeriod) : java.util.List<Transaction>

  abstract function getStructures(policyPeriod : PolicyPeriod) : java.util.List<Coverable>

  abstract function getStructureCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage>

  abstract function getStructureExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion>

  abstract function getStructurePolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition>

  abstract function getStructureCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction>

  abstract function getScheduleTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction>

  abstract function getLocation(coverable : Coverable) : PolicyLocation

  abstract function getLocationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage>

  abstract function getLocationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion>

  abstract function getLocationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition>

  abstract function getLocationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction>

  abstract function getClassifications(coverable : Coverable) : java.util.List<BP7Classification>

  abstract function getClassificationCoverages(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Coverage>

  abstract function getClassificationExclusions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Exclusion>

  abstract function getClassificationPolicyConditions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<PolicyCondition>

  abstract function getClassificationCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction>

  abstract function getAdditionalInterests(coverable : Coverable) : AddlInterestDetail []

  abstract function getPolicyLine(policyPeriod : PolicyPeriod) : Coverable

  abstract function getLineCoverages(line : Coverable) : java.util.List<Coverage>

  abstract function getLineExclusions(line : Coverable) : java.util.List<Exclusion>

  abstract function getLinePolicyConditions(line : Coverable) : java.util.List<PolicyCondition>

  abstract function getLineCoverageTransactions(policyPeriod : PolicyPeriod, coverable : Coverable) : java.util.List<Transaction>

  abstract function getDiscountCostType(cost : Cost) :  String

  abstract function getDiscountCostTypes() : String[]

  abstract function getEstimatedInsScoreDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount>

  abstract function getEstimatedBCEGDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount>

  abstract function getEstimatedWindDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount>

  abstract function getEstimatedPremiums(policyPeriod : PolicyPeriod) : List<HPXEstimatedPremium>

  abstract function getHurricaneWindPremium(policyPeriod : PolicyPeriod) : BigDecimal

  abstract function getCoverageMapper() : HPXCoverageMapper

  abstract function getStructureMapper() : HPXStructureMapper

  abstract function getClassificationMapper() : HPXClassificationMapper

  abstract function getExclusionMapper() : HPXExclusionMapper

  abstract function getPolicyConditionMapper() : HPXPolicyConditionMapper

}