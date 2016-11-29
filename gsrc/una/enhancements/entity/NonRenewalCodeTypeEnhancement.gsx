package una.enhancements.entity

uses una.config.ConfigParamsUtil
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/21/16
 * Time: 7:45 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement NonRenewalCodeTypeEnhancement: typekey.NonRenewalCode {
  function getNonRenewExplanationCodes(policyTerm : PolicyTerm) : List<NonRenewalExplanationPattern>{
    var results : NonRenewalExplanationPattern[]

    var allPatternCodes = policyTerm.getAvailableNonRenewalExplanationPatterns()

    switch(policyTerm.NonRenewReason){
      case TC_RiskChar:
        results = allPatternCodes.where( \ pattern -> RiskCharacteristicExplanationCodes.contains(pattern.Code))
        break
      case TC_CombinationFactors:
        results = allPatternCodes.where( \ pattern -> CombinationOfFactorsExplanationCodes.contains(pattern.Code))
        break
      case TC_DocInfo:
        results = allPatternCodes.where( \ pattern -> DocumentationExplanationCodes.contains(pattern.Code))
        break
      case TC_LossHistory:
        results = allPatternCodes.where( \ pattern -> LossHistoryExplanationCodes.contains(pattern.Code))
        break
      case TC_AgentAppt:
        results = allPatternCodes.where( \ pattern -> AgentAppointmentExplanationCodes.contains(pattern.Code))
        break
      case TC_Other:
        results = allPatternCodes.where( \ pattern -> OtherExplanationCodes.contains(pattern.Code))
        break
      case TC_BusinessClosed:
        results = allPatternCodes.where( \ pattern -> OtherExplanationCodes.contains(pattern.Code))
        break
      case TC_PropertySold:
        results = allPatternCodes.where( \ pattern -> PropertySoldExplanationCodes.contains(pattern.Code))
        break
      case TC_CovPlacedElse:
        results = allPatternCodes.where( \ pattern -> CoveragePlacedElsewhereExplanationCodes.contains(pattern.Code))
        break
      case TC_RenewalNotTaken:
        results = allPatternCodes.where( \ pattern -> NotTakenExplanationCodes.contains(pattern.Code))
        break
      case TC_OtherInsured:
        results = allPatternCodes.where( \ pattern -> OtherNotProvidedExplanationCodes.contains(pattern.Code))
        break
      case TC_PolicyRewritten:
        results = allPatternCodes.where( \ pattern -> RewrittenExplanationCodes.contains(pattern.Code))
        break
      case TC_LossHist:
        results = allPatternCodes.where( \ pattern -> LossHistoryCarrierExplanationCodes.contains(pattern.Code))
        break
      case TC_ChangeInRisk:
        results = allPatternCodes.where( \ pattern -> RiskChangeExplanationCodes.contains(pattern.Code))
        break
      case TC_IneligibleOps:
        results = allPatternCodes.where( \ pattern -> IneligibleOperationsCodes.contains(pattern.Code))
        break
      case TC_IneligibleTenant:
        results = allPatternCodes.where( \ pattern -> IneligibleTenantExplanationCodes.contains(pattern.Code))
        break
      case TC_FailureUWDocs:
        results = allPatternCodes.where( \ pattern -> UnderwritingDocsExplanationCodes.contains(pattern.Code))
        break
      case TC_FailureComplyUWReq:
        results = allPatternCodes.where( \ pattern -> UnderwritingComplyExplanationCodes.contains(pattern.Code))
        break
      case TC_AgentNotWithUicna:
        results = allPatternCodes.where( \ pattern -> AgentDismissedExplanationCodes.contains(pattern.Code))
        break
      case TC_DuplicateCov:
        results = allPatternCodes.where( \ pattern -> DuplicateCovExplanationCodes.contains(pattern.Code))
        break
      case TC_OtherCarrier:
        results = allPatternCodes.where( \ pattern -> NonRenewCarrierOtherExplanationCodes.contains(pattern.Code))
        break
      default:
        break
    }

    return results?.toSet()?.orderByDescending( \ pattern -> pattern.Body).toTypedArray()
  }

  private property get RiskCharacteristicExplanationCodes() : List<String>{
    return ConfigParamsUtil.getList(TC_NonRenewRiskCharacteristicsCodes, null)
  }

  private property get DocumentationExplanationCodes() : List<String>{
    return ConfigParamsUtil.getList(TC_NonRenewDocumentationCodes, null)
  }

  private property get CombinationOfFactorsExplanationCodes() : List<String>{
    return RiskCharacteristicExplanationCodes
           .concat(DocumentationExplanationCodes)
           .concat(LossHistoryExplanationCodes)
           .concat(AgentAppointmentExplanationCodes).toList()
  }

  private property get AgentAppointmentExplanationCodes() : List<String>{
    return ConfigParamsUtil.getList(TC_NonRenewAgentApptCodes, null)
  }

  private property get LossHistoryExplanationCodes() : List<String>{
    return {"losshistory"}
  }

  private property get OtherExplanationCodes() : List<String> {
    return {"misstatementmisrep"}
  }

  private property get BusinessClosedExplanationCodes() : List<String> {
    return {"businessclsd"}
  }

  private property get PropertySoldExplanationCodes() : List<String> {
    return {"propsold"}
  }

  private property get CoveragePlacedElsewhereExplanationCodes() : List<String> {
    return {"covplacedelsewhr"}
  }

  private property get NotTakenExplanationCodes(): List<String>{
    return {"offernotaccepted"}
  }

  private property get OtherNotProvidedExplanationCodes() : List<String>{
    return {"insuredreq"}
  }

  private property get RewrittenExplanationCodes() : List<String> {
    return {"rewriteuicna"}
  }

  private property get LossHistoryCarrierExplanationCodes() : List<String>{
    return {"carrierlosshistory"}
  }

  private property get RiskChangeExplanationCodes() : List<String>{
    return {"changeinrisk"}
  }

  private property get IneligibleOperationsCodes() : List<String>{
    return {"ineligibleoper"}
  }

  private property get IneligibleTenantExplanationCodes() : List<String>{
    return {"ineligibletenants"}
  }

  private property get UnderwritingDocsExplanationCodes() : List<String>{
    return {"failureuwdocs"}
  }

  private property get UnderwritingComplyExplanationCodes() : List<String>{
    return {"failurecomplyuwreq"}
  }

  private property get AgentDismissedExplanationCodes() : List<String>{
    return {"agentdismiss"}
  }

  private property get DuplicateCovExplanationCodes() : List<String>{
    return {"duplicatecov"}
  }

  private property get NonRenewCarrierOtherExplanationCodes() : List<String>{
    return {"nonrenewcarrier"}
  }
}
