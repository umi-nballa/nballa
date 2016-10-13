package una.integration.mapping.hpx.common

uses una.integration.mapping.hpx.common.HPXBillingInfoMapper
uses una.integration.mapping.hpx.homeowners.HPXDwellingPolicyMapper
uses una.integration.mapping.hpx.common.HPXGeneralPartyInfoMapper
uses una.integration.mapping.hpx.common.HPXJobMapper
uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
uses una.integration.mapping.hpx.common.HPXPaymentOptionMapper
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
    itemIdInfo.OtherIdentifier.OtherId = 0
    itemIdInfo.OtherIdentifier.OtherIdTypeCd = "CreditBureau"
    return itemIdInfo
  }

  /************************************** Policy Summary Info ******************************************************/
  function createPolicySummaryInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.PolicySummaryInfoType {
    var transactionMapper = new HPXJobMapper ()
    var billingInfoMapper = new HPXBillingInfoMapper ()
    var policySummaryInfo = transactionMapper.createJobStatus(policyPeriod)
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


  /************************************** Insured Or Principal ******************************************************/
  function createInsuredOrPrincipal(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var creditScoreMapper = new HPXCreditScoreMapper()
    var insuredOrPrincipal = new wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalType()
    insuredOrPrincipal.addChild(new XmlElement("ItemIdInfo", createItemIdInfo()))
    insuredOrPrincipal.addChild(new XmlElement("GeneralPartyInfo", generalPartyInfoMapper.createGeneralPartyInfo
                                                              (policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact,
                                                                                   policyPeriod.PrimaryNamedInsured)))
    var creditScoreInfo = creditScoreMapper.createCreditScoreInfo(policyPeriod)
    var insuredOrPrincipalInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.InsuredOrPrincipalInfoType()
    var principalInfo = new wsi.schema.una.hpx.hpx_application_request.types.complex.PrincipalInfoType()
    principalInfo.addChild(new XmlElement("CreditScoreInfo", creditScoreInfo))
    insuredOrPrincipalInfo.addChild(new XmlElement("PrincipalInfo" , principalInfo))
    insuredOrPrincipal.addChild(new XmlElement("InsuredOrPrincipalInfo" , insuredOrPrincipalInfo))
    return insuredOrPrincipal
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
    // billing method
    /*
    var billingMethodInfo = billingInfoMapper.createBillingMethodInfo(policyPeriod)
    for (child in billingMethodInfo.$Children) {
      policyInfo.addChild(child)
    }

    var paymentOptions = paymentOptionMapper.createPaymentOptions(policyPeriod)
    for (paymentOption in paymentOptions) {
      policyInfo.addChild(paymentOption)
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

  function createCoveragesInfo (currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>,
                                    transactions : java.util.List<Transaction>, previousTransactions : java.util.List<Transaction>)
                                                          : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    // added or changed coverages
    for (cov in currentCoverages) {
      var trxs = transactions.where( \ elt -> cov.PatternCode.equals(getCostCoverage(elt.Cost).PatternCode))
      if (trxs?.Count > 0) {
        if (previousCoverages != null) {
          var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(cov.PatternCode))
          var prevTrxs = previousTransactions.where( \ elt -> cov.PatternCode.equals(getCostCoverage(elt.Cost).PatternCode))
          coverages.add(getCoverageMapper().createCoverageInfo(cov, previousCoverage, trxs, prevTrxs))
        } else {
          coverages.add(getCoverageMapper().createCoverageInfo(cov, null, trxs, null))
        }
      }
    }
    // removed coverages
    if (previousCoverages != null) {
      for (cov in previousCoverages) {
        if (currentCoverages.hasMatch( \ elt1 -> elt1.PatternCode.equals(cov.PatternCode)))
          continue
        var trxs = transactions.where( \ elt -> cov.PatternCode.equals(getCostCoverage(elt.Cost).PatternCode))
        if (trxs?.Count > 0) {
          coverages.add(getCoverageMapper().createCoverageInfo(cov, null, null, trxs))
        }
      }
    }
    return coverages
  }

  /*
  function createCoveragesInfo(policyPeriod : PolicyPeriod, previousPeriod : PolicyPeriod, currentCoverages : java.util.List<Coverage>, previousCoverages : java.util.List<Coverage>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType> {
    var coverages = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.CoverageType>()
    var transactions = getTransactions(policyPeriod)
    var previousTransactions = getTransactions(previousPeriod)
    // added or changed coverages
    for (cov in currentCoverages) {
      var trxs = transactions.where( \ elt -> cov.PatternCode.equals(getCostCoverage(elt.Cost).PatternCode))
      if (trxs?.Count > 0) {
        if (previousCoverages != null) {
          var previousCoverage = previousCoverages.firstWhere( \ elt -> elt.PatternCode.equals(cov.PatternCode))
          var prevTrxs = previousTransactions.where( \ elt -> cov.PatternCode.equals(getCostCoverage(elt.Cost).PatternCode))
          coverages.add(getCoverageMapper().createCoverageInfo(cov, previousCoverage, trxs, prevTrxs))
        } else {
          coverages.add(getCoverageMapper().createCoverageInfo(cov, null, trxs, null))
        }
      }
    }
    // removed coverages
    if (previousCoverages != null) {
      for (cov in previousCoverages) {
        if (currentCoverages.hasMatch( \ elt1 -> elt1.PatternCode.equals(cov.PatternCode)))
          continue
        var trxs = transactions.where( \ elt -> cov.PatternCode.equals(getCostCoverage(elt.Cost).PatternCode))
        if (trxs?.Count > 0) {
          coverages.add(getCoverageMapper().createCoverageInfo(cov, null, null, trxs))
        }
      }
    }
    return coverages
  }
  */
  abstract function getCoverages(policyPeriod : PolicyPeriod) : java.util.List<Coverage>

  abstract function getTransactions(policyPeriod : PolicyPeriod) : java.util.List<Transaction>

  abstract function getCostCoverage(cost : Cost) : Coverage

  abstract function getCoverageMapper() : HPXCoverageMapper

}