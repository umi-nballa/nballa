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
   // policySummaryInfo.addChild(billingInfoMapper.createBillingInfo(policyPeriod))
    // TODO  - start
    //policySummaryInfo.addChild(new XmlElement("FullTermAmt", new FullTermAmtType()))
    //policySummaryInfo.addChild(new XmlElement("RecoveryAssessmentAmt", new RecoveryAssessmentAmtType()))
    //policySummaryInfo.addChild(new XmlElement("ChangeRecoveryAssessmentAmt", new ChangeRecoveryAssessmentAmtType()))
    policySummaryInfo.RecoveryAssessmentPct = 0
    //policySummaryInfo.addChild(new XmlElement("PremiumChangeAmt", new PremiumChangeAmtType()))
    //policySummaryInfo.addChild(new XmlElement("NetChangeAmt", new NetChangeAmtType()))
    //policySummaryInfo.addChild(new XmlElement("WrittenAmt", new WrittenAmtType()))
    policySummaryInfo.QuoteInd = false
    //policySummaryInfo.addChild(new XmlElement("BillingInfo", new BillingInfoType()))
    policySummaryInfo.FileNumber = ""
    //policySummaryInfo.addChild(new XmlElement("OtherOrPriorPolicy", new OtherOrPriorPolicyType()))
   // policySummaryInfo.addChild(new XmlElement("Fee", new FeeType()))
   // policySummaryInfo.addChild(new XmlElement("ReinstateInfo", new ReinstateInfoType()))
  //  policySummaryInfo.addChild(new XmlElement("RenewalInfo", new RenewalInfoType()))
    // TODO - end
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
    personHolderType.BirthDate = person.DateOfBirth != null ? new XmlDate(person.DateOfBirth) : new XmlDate()
    physicalAddressType.AddressLine1 = person.PrimaryAddress.AddressLine1 != null ? person.PrimaryAddress.AddressLine1 : ""
    physicalAddressType.City = person.PrimaryAddress.City != null ? person.PrimaryAddress.City : ""
    physicalAddressType.State = person.PrimaryAddress.State != null ? person.PrimaryAddress.State : ""
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



  function createUWCompany(policyCompany : String) : wsi.schema.una.hpx.hpx_application_request.types.complex.UWCompanyType {
    var uwCompanyType = new wsi.schema.una.hpx.hpx_application_request.types.complex.UWCompanyType()
    var insuranceProviderType = new wsi.schema.una.hpx.hpx_application_request.types.complex.InsuranceProviderType()
    insuranceProviderType.OrganizationName = policyCompany != null ? policyCompany : ""
    uwCompanyType.addChild(new XmlElement("InsuranceProvider", insuranceProviderType))
    return uwCompanyType
  }


  /************************************** Insured Or Principal ******************************************************/
  function createInsuredOrPrincipal(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType {
    var primaryNamedInsuredMapper = new HPXPrimaryNamedInsuredMapper()
    return primaryNamedInsuredMapper.createPrimaryNamedInsured(policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact,
                                                               policyPeriod.PrimaryNamedInsured, policyPeriod.Policy.Account.AccountOrgType)
  }

  /*************************************  Policy Detail ************************************************************/
  function createPolicyDetails(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyInfoType {
    var compositionUnitMapper = new HPXCompositionUnitMapper()
    var dwellingPolicyMapper = new HPXDwellingPolicyMapper()
    var transactionMapper = new HPXJobMapper ()
    var billingInfoMapper = new HPXBillingInfoMapper()
    var paymentOptionMapper = new HPXPaymentOptionMapper()
    var priorPoliciesMapper = new HPXPriorPolicyMapper()
    var producerMapper = new HPXProducerMapper()
    var policyInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PolicyInfoType()
    policyInfo.LOBCd = policyPeriod.HomeownersLine_HOEExists != null ? typekey.PolicyLine.TC_HOMEOWNERSLINE_HOE :
                       policyPeriod.BP7LineExists != null ? typekey.PolicyLine.TC_BP7BUSINESSOWNERSLINE :
                       policyPeriod.CPLineExists != null ? typekey.PolicyLine.TC_COMMERCIALPROPERTYLINE :
                       policyPeriod.GLLineExists != null ? typekey.PolicyLine.TC_GENERALLIABILITYLINE : ""
    policyInfo.PolicyNumber = policyPeriod.PolicyNumber != null ? policyPeriod.PolicyNumber : ""
    policyInfo.AccountNumberId = policyPeriod.Policy.Account.AccountNumber
    policyInfo.PolicyTermCd = policyPeriod.TermType
    policyInfo.ContractTerm.EffectiveDt = new XmlDate(policyPeriod.PeriodStart)
    policyInfo.ContractTerm.ExpirationDt = new XmlDate(policyPeriod.PeriodEnd)
    policyInfo.TermProcessDt = new XmlDate(policyPeriod.WrittenDate)
    policyInfo.ControllingStateProvCd = policyPeriod.BaseState
    // user
    var jobCreationUser = transactionMapper.createJobCreationUser(policyPeriod)
    policyInfo.addChild(new XmlElement("MiscParty", jobCreationUser))
    // prior policies
    var priorPoliciesInfo = priorPoliciesMapper.createPriorPolicies(policyPeriod)
    for (priorPolicyInfo in priorPoliciesInfo) {
      policyInfo.addChild(new XmlElement("OtherOrPriorPolicy", priorPolicyInfo))
    }
    policyInfo.TierCd = policyPeriod.EffectiveDatedFields.ProducerCode.Organization.Tier
    policyInfo.TierDesc = policyPeriod.EffectiveDatedFields.ProducerCode.Organization.Tier.Description
    // producer branch
    policyInfo.BranchDesc = policyPeriod.EffectiveDatedFields.ProducerCode.Branch
    // billing method - TODO
    /*
    if (policyPeriod.Job.DisplayType != typekey.Job.TC_ISSUANCE) {
      var billingMethodInfo = billingInfoMapper.createBillingMethodInfo(policyPeriod)
      for (child in billingMethodInfo.$Children) {
        policyInfo.addChild(child)
      }
      var paymentOptions = paymentOptionMapper.createPaymentOptions(policyPeriod)
      for (paymentOption in paymentOptions) {
        policyInfo.addChild(""paymentOption)
      }
    }
    */

    return policyInfo
  }

  function createQuestionSet(policyPeriod: PolicyPeriod): List<wsi.schema.una.hpx.hpx_application_request.types.complex.QuestionAnswerType> {
    var questions = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.QuestionAnswerType>()
    var questionAnswers = policyPeriod.PeriodAnswers
    for (q in questionAnswers) {
      var question = new wsi.schema.una.hpx.hpx_application_request.types.complex.QuestionAnswerType()
      question.QuestionText = q.Question.Text
      question.QuestionCd = q.QuestionCode
      question.YesNoCd = q.BooleanAnswer != null ? q.BooleanAnswer : 0
      question.Explanation = q.Question.SupplementalTexts.atMostOne().Text != null ? q.Question.SupplementalTexts.atMostOne().Text : ""
      questions.add(question)
    }
    return questions
  }

  function createStructuresInfo(policyPeriod : PolicyPeriod) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType> {
    var structures = new java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DwellType>()
    var structureMapper = getStructureMapper()
    var locationMapper = new HPXLocationMapper()
    var classificationMapper = getClassificationMapper ()
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    var coverableStructures = getStructures(policyPeriod)
    for (coverableStructure in coverableStructures) {
      var propertyStructure = structureMapper.createStructure(coverableStructure)  //.createBuilding(bldg)
      var strucureCovs = createCoveragesInfo(getStructureCoverages(policyPeriod, coverableStructure), getStructureCoverages(previousPeriod, coverableStructure),
          getStructureCoverageTransactions(policyPeriod, coverableStructure))
      for (cov in strucureCovs) { propertyStructure.addChild(new XmlElement("Coverage", cov))}
      var structureExclusions = createExclusionsInfo(getStructureExclusions(policyPeriod, coverableStructure), getStructureExclusions(previousPeriod, coverableStructure),
          getStructureCoverageTransactions(policyPeriod, coverableStructure))
      for (excl in structureExclusions) { propertyStructure.addChild(new XmlElement("Exclusion", excl))}
      var structurePolicyConditions = createPolicyConditionsInfo(getStructurePolicyConditions(policyPeriod, coverableStructure), getStructurePolicyConditions(previousPeriod, coverableStructure),
          getStructureCoverageTransactions(policyPeriod, coverableStructure))
      for (cond in structureExclusions) { propertyStructure.addChild(new XmlElement("PolicyCondition", cond))}
      var additionalInts = getAdditionalInterests(coverableStructure)
      var additionalInterests = createAdditionalInterests(additionalInts, coverableStructure, structureMapper)
      for (additionalInterest in additionalInterests) { propertyStructure.addChild(new XmlElement("AdditionalInterest", additionalInterest))}
      // structure location
      var structureLoc = getLocation(coverableStructure)
      var location = locationMapper.createLocation(structureLoc)
      var locationCovs = createCoveragesInfo(getLocationCoverages(policyPeriod, coverableStructure), getLocationCoverages(previousPeriod, coverableStructure),
                                             getLocationCoverageTransactions(policyPeriod, coverableStructure))
      var locationExclusions = createExclusionsInfo(getLocationExclusions(policyPeriod, coverableStructure), getLocationExclusions(previousPeriod, coverableStructure),
          getLocationCoverageTransactions(policyPeriod, coverableStructure))
      var locationPolicyConditions = createPolicyConditionsInfo(getLocationPolicyConditions(policyPeriod, coverableStructure), getLocationPolicyConditions(previousPeriod, coverableStructure),
          getLocationCoverageTransactions(policyPeriod, coverableStructure))
      for (loc in locationCovs) { location.addChild(new XmlElement("Coverage", loc))}
      for (locExcl in locationExclusions) { location.addChild(new XmlElement("Exclusion", locExcl))}
      for (locCond in locationPolicyConditions) { location.addChild(new XmlElement("PolicyCondition", locCond))}
      propertyStructure.addChild(new XmlElement("Location", location))
      // building classifications
      var structureClassifications = getClassifications(coverableStructure)
      for (structureClassification in structureClassifications) {
        var buildlingClassification = classificationMapper.createClassification(structureClassification)
        var classifcnCovs = createCoveragesInfo(getClassificationCoverages(policyPeriod, structureClassification), getClassificationCoverages(previousPeriod, structureClassification),
            getClassificationCoverageTransactions(policyPeriod, structureClassification))
        for (classifcn in classifcnCovs) { buildlingClassification.addChild(new XmlElement("Coverage", classifcn))}
        var classifcnExclusions = createExclusionsInfo(getClassificationExclusions(policyPeriod, structureClassification), getClassificationExclusions(previousPeriod, structureClassification),
            getClassificationCoverageTransactions(policyPeriod, structureClassification))
        for (classifcnExclusion in classifcnExclusions) { buildlingClassification.addChild(new XmlElement("Exclusion", classifcnExclusion))}
        var classifcnPolicyConditions = createPolicyConditionsInfo(getClassificationPolicyConditions(policyPeriod, structureClassification), getClassificationPolicyConditions(previousPeriod, structureClassification),
            getClassificationCoverageTransactions(policyPeriod, structureClassification))
        for (classifcnCond in classifcnExclusions) { buildlingClassification.addChild(new XmlElement("PolicyCondition", classifcnCond))}
        propertyStructure.addChild(new XmlElement("BP7Classification", buildlingClassification))
      }

      structures.add(propertyStructure)
    }
    return structures
  }

  function createLineCoverages(policyPeriod : PolicyPeriod, policyLine : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    return createCoveragesInfo(getLineCoverages(getPolicyLine(policyPeriod)), getLineCoverages(getPolicyLine(previousPeriod)),
                               getLineCoverageTransactions(policyPeriod, policyLine))
  }


  function createLineExclusions(policyPeriod : PolicyPeriod, policyLine : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    return createExclusionsInfo(getLineExclusions(getPolicyLine(policyPeriod)), getLineExclusions(getPolicyLine(previousPeriod)),
        getLineCoverageTransactions(policyPeriod, policyLine))
  }

  function createLinePolicyConditions(policyPeriod : PolicyPeriod, policyLine : Coverable) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var policyPeriodHelper = new HPXPolicyPeriodHelper()
    var previousPeriod = policyPeriodHelper.getPreviousBranch(policyPeriod)
    return createPolicyConditionsInfo(getLinePolicyConditions(getPolicyLine(policyPeriod)), getLinePolicyConditions(getPolicyLine(previousPeriod)),
        getLineCoverageTransactions(policyPeriod, policyLine))
  }

  function createCoveragesInfo (currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>,
                                transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var jobHelper = new HPXJobHelper()
    var changedCoveragePatterns = jobHelper.getChangedCoveragePatterns(currentCoverages?.first().PolicyLine.AssociatedPolicyPeriod, currentCoverages?.first().OwningCoverable)
    // added or changed coverages
    for (cov in currentCoverages) {
      var trxs = transactions.where( \ elt -> cov.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
      if (cov.PolicyLine.AssociatedPolicyPeriod.BasedOn == null or changedCoveragePatterns.contains(cov.PatternCode)) {
        if (previousCoverages != null) {
          var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(cov.PatternCode))
          coverages.add(getCoverageMapper().createCoverageInfo(cov, previousCoverage, trxs))
        } else {
          coverages.add(getCoverageMapper().createCoverageInfo(cov, null, trxs))
        }
      }
    }
    // removed coverages
    if (previousCoverages != null) {
      for (cov in previousCoverages) {
        if (currentCoverages.hasMatch( \ elt1 -> elt1.PatternCode.equals(cov.PatternCode)))
          continue
        var trxs = transactions.where( \ elt -> cov.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
        coverages.add(getCoverageMapper().createCoverageInfo(cov, null, null))
      }
    }
    return coverages
  }

  function createExclusionsInfo (currentExclusions : java.util.List<Exclusion>, previousExclusions : java.util.List<Exclusion>,
                                 transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    // added or changed exclusions
    for (excl in currentExclusions) {
      var trxs = transactions.where( \ elt -> excl.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
      if (previousExclusions != null) {
        var previousExclusion = previousExclusions.firstWhere( \ elt -> elt.PatternCode.equals(excl.PatternCode))
        coverages.add(getExclusionMapper().createExclusionInfo(excl, previousExclusion, trxs))
      } else {
        coverages.add(getExclusionMapper().createExclusionInfo(excl, null, trxs))
      }
    }
    // removed exclusions
    if (previousExclusions != null) {
      for (excl in previousExclusions) {
        if (currentExclusions.hasMatch( \ elt1 -> elt1.PatternCode.equals(excl.PatternCode)))
          continue
        var trxs = transactions.where( \ elt -> excl.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
        coverages.add(getExclusionMapper().createExclusionInfo(excl, null, null))
      }
    }
    return coverages
  }

  function createPolicyConditionsInfo (currentPolicyConditions : java.util.List<PolicyCondition>, previousPolicyConditions : java.util.List<PolicyCondition>,
                                 transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    // added or changed policy conditions
    for (cond in currentPolicyConditions) {
      var trxs = transactions.where( \ elt -> cond.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
      if (previousPolicyConditions != null) {
        var previousPolicyCondition = previousPolicyConditions.firstWhere( \ elt -> elt.PatternCode.equals(cond.PatternCode))
        coverages.add(getPolicyConditionMapper().createPolicyConditionInfo(cond, previousPolicyCondition, trxs))
      } else {
        coverages.add(getPolicyConditionMapper().createPolicyConditionInfo(cond, null, trxs))
      }
    }
    // removed policy conditions
    if (previousPolicyConditions != null) {
      for (cond in previousPolicyConditions) {
        if (currentPolicyConditions.hasMatch( \ elt1 -> elt1.PatternCode.equals(cond.PatternCode)))
          continue
        var trxs = transactions.where( \ elt -> cond.PatternCode.equals(getCoverageMapper().getCostCoverage(elt.Cost).PatternCode))
        coverages.add(getPolicyConditionMapper().createPolicyConditionInfo(cond, null, null))
      }
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
      discount.DiscountAmount.Amt = estimatedDiscount.Percent * windPremium / 100
      discounts.add(discount)
    }
    return discounts
  }

  function createAdditionalInterests(additionalInterestDetails : AddlInterestDetail [], coverable : Coverable, mapper : HPXStructureMapper) : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.AdditionalInterestType> {
    var additionalInterestMapper = new HPXAdditionalInterestMapper()
    var additionalInterests = additionalInterestMapper.createAdditionalInterests(additionalInterestDetails, mapper, coverable)
    return additionalInterests
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

  abstract function getEstimatedWindDiscounts(policyPeriod : PolicyPeriod) : List<HPXEstimatedDiscount>

  abstract function getHurricaneWindPremium(policyPeriod : PolicyPeriod) : BigDecimal

  abstract function getCoverageMapper() : HPXCoverageMapper

  abstract function getStructureMapper() : HPXStructureMapper

  abstract function getClassificationMapper() : HPXClassificationMapper

  abstract function getExclusionMapper() : HPXExclusionMapper

  abstract function getPolicyConditionMapper() : HPXPolicyConditionMapper

}