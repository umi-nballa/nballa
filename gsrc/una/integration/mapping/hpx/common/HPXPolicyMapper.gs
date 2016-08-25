package una.integration.mapping.hpx.common

uses una.integration.mapping.hpx.common.HPXBillingInfoMapper
uses una.integration.mapping.hpx.homeowners.HPXDwellingPolicyMapper
uses una.integration.mapping.hpx.common.HPXGeneralPartyInfoMapper
uses una.integration.mapping.hpx.common.HPXJobMapper
uses una.integration.mapping.hpx.common.HPXCompositionUnitMapper
uses una.integration.mapping.hpx.common.HPXPaymentOptionMapper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/2/16
 * Time: 8:54 AM
 * To change this template use File | Settings | File Templates.
 */
abstract class HPXPolicyMapper {

  function createItemIdInfo() : wsi.schema.una.hpx.hpx_application_request.ItemIdInfo {
    var itemIdInfo = new wsi.schema.una.hpx.hpx_application_request.ItemIdInfo()
    var agencyId = new wsi.schema.una.hpx.hpx_application_request.AgencyId()
    agencyId.setText(0)
    itemIdInfo.addChild(agencyId)
    var insurerId = new wsi.schema.una.hpx.hpx_application_request.InsurerId()
    insurerId.setText(0)
    itemIdInfo.addChild(insurerId)
    var systemId = new wsi.schema.una.hpx.hpx_application_request.SystemId()
    systemId.setText("00000000-0000-0000-0000-000000000000")
    itemIdInfo.addChild(systemId)
    var otherIdentifier = new wsi.schema.una.hpx.hpx_application_request.OtherIdentifier()
    var otherIdTypeCd = new wsi.schema.una.hpx.hpx_application_request.OtherIdTypeCd()
    otherIdTypeCd.setText("CreditBureau")
    var otherId = new wsi.schema.una.hpx.hpx_application_request.OtherId()
    otherId.setText(0)
    otherIdentifier.addChild(otherIdTypeCd)
    otherIdentifier.addChild(otherId)
    itemIdInfo.addChild(otherIdentifier)
    return itemIdInfo
  }

  /************************************** Policy Summary Info ******************************************************/
  function createPolicySummaryInfo(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.PolicySummaryInfo {
    var transactionMapper = new HPXJobMapper () // TODO - move to class level
    var billingInfoMapper = new HPXBillingInfoMapper ()
    var policySummaryInfo = transactionMapper.createJobStatus(policyPeriod)
    policySummaryInfo.addChild(createItemIdInfo())
   // policySummaryInfo.addChild(billingInfoMapper.createBillingInfo(policyPeriod))
    return policySummaryInfo
  }


  /************************************** Insured Or Principal ******************************************************/
  function createInsuredOrPrincipal(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.InsuredOrPrincipal {
    var generalPartyInfoMapper = new HPXGeneralPartyInfoMapper()
    var insuredOrPrincipal = new wsi.schema.una.hpx.hpx_application_request.InsuredOrPrincipal()
    insuredOrPrincipal.addChild(createItemIdInfo())
    insuredOrPrincipal.addChild(generalPartyInfoMapper.createGeneralPartyInfo(policyPeriod.PrimaryNamedInsured.AccountContactRole.AccountContact.Contact,
        policyPeriod.PrimaryNamedInsured))
    return insuredOrPrincipal
  }

  /*************************************  Policy Detail ************************************************************/
  function createPolicyDetails(policyPeriod : PolicyPeriod) : wsi.schema.una.hpx.hpx_application_request.PolicyInfo {
    var compositionUnitMapper = new HPXCompositionUnitMapper()
    var dwellingPolicyMapper = new HPXDwellingPolicyMapper()
    var transactionMapper = new HPXJobMapper ()
    var billingInfoMapper = new HPXBillingInfoMapper()
    var paymentOptionMapper = new HPXPaymentOptionMapper()
    var priorPoliciesMapper = new HPXPriorPolicyMapper()
    var producerMapper = new HPXProducerMapper()
    var policyInfo = new wsi.schema.una.hpx.hpx_application_request.PolicyInfo()
    var lobCode = new wsi.schema.una.hpx.hpx_application_request.LOBCd()
    switch (policyPeriod.HomeownersLine_HOE.PatternCode) {
      case "HomeownersLine_HOE" : lobCode.setText(wsi.schema.una.hpx.hpx_application_request.enums.LineOfBusiness.HOME)
          break
    }
    policyInfo.addChild(lobCode)
    var policyNumber = new wsi.schema.una.hpx.hpx_application_request.PolicyNumber()
    if (policyPeriod.PolicyNumber != null) {
      policyNumber.setText(policyPeriod.PolicyNumber)
      policyInfo.addChild(policyNumber)
    }
    var accountNo = new wsi.schema.una.hpx.hpx_application_request.AccountNumberId()
    accountNo.setText(policyPeriod.Policy.Account.AccountNumber)
    policyInfo.addChild(accountNo)
    var policyTermCode = new wsi.schema.una.hpx.hpx_application_request.PolicyTermCd()
    policyTermCode.setText(policyPeriod.TermType)
    policyInfo.addChild(policyTermCode)
    var contractTerm = new wsi.schema.una.hpx.hpx_application_request.ContractTerm()
    var effectiveDate = new wsi.schema.una.hpx.hpx_application_request.EffectiveDt()
    effectiveDate.setText(policyPeriod.PeriodStart)
    contractTerm.addChild(effectiveDate)
    var expirationDate = new wsi.schema.una.hpx.hpx_application_request.ExpirationDt()
    expirationDate.setText(policyPeriod.PeriodEnd)
    contractTerm.addChild(expirationDate)
    policyInfo.addChild(contractTerm)
    var writtenDate = new wsi.schema.una.hpx.hpx_application_request.TermProcessDt()
    writtenDate.setText(policyPeriod.WrittenDate)
    policyInfo.addChild(writtenDate)
    var baseRate = new wsi.schema.una.hpx.hpx_application_request.ControllingStateProvCd()
    baseRate.setText(policyPeriod.BaseState)
    policyInfo.addChild(baseRate)
    // user
    var jobCreationUser = transactionMapper.createJobCreationUser(policyPeriod)
    policyInfo.addChild(jobCreationUser)
    // prior policies
    var priorPoliciesInfo = priorPoliciesMapper.createPriorPoliclies(policyPeriod)
    for (priorPolicyInfo in priorPoliciesInfo) {
      policyInfo.addChild(priorPolicyInfo)
    }
    // producer org tier
    var producerTierInfo = producerMapper.createProducerTierInfo(policyPeriod)
    for (child in producerTierInfo.$Children) {
      policyInfo.addChild(child)
    }
    // producer branch
    var producerBranchInfo = producerMapper.createProducerBranchInfo(policyPeriod)
    for (child in producerBranchInfo.$Children) {
      policyInfo.addChild(child)
    }
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

  function createQuestionSet(policyPeriod: PolicyPeriod): List<wsi.schema.una.hpx.hpx_application_request.QuestionAnswer> {
    var questions = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.QuestionAnswer>()
    var questionAnswers = policyPeriod.PeriodAnswers
    for (q in questionAnswers) {
      var question = new wsi.schema.una.hpx.hpx_application_request.QuestionAnswer()
      var questionText = new wsi.schema.una.hpx.hpx_application_request.QuestionText()
      questionText.setText(q.Question.Text)
      question.addChild(questionText)
      var questionCode = new wsi.schema.una.hpx.hpx_application_request.QuestionCd()
      questionCode.setText(q.QuestionCode)
      question.addChild(questionCode)
      if (q.BooleanAnswer != null) {
        var yesNoCd = new wsi.schema.una.hpx.hpx_application_request.YesNoCd()
        switch (q.BooleanAnswer) {
          case true:
              yesNoCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.Response.YES)
              break
          case false:
              yesNoCd.setText(wsi.schema.una.hpx.hpx_application_request.enums.Response.NO)
        }
        question.addChild(yesNoCd)
      }
      var explanation = new wsi.schema.una.hpx.hpx_application_request.Explanation()
      if (q.Question.SupplementalTexts.atMostOne().Text != null) {
        explanation.setText(q.Question.SupplementalTexts.atMostOne().Text)
        question.addChild(explanation)
      }
      questions.add(question)
    }
    return questions
  }

  abstract function getCoverages(policyPeriod : PolicyPeriod) : java.util.List<Coverage>

  abstract function getTransactions(policyPeriod : PolicyPeriod) : java.util.List<Transaction>
}