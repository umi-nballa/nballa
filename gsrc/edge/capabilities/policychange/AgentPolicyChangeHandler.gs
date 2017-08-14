package edge.capabilities.policychange

uses edge.capabilities.policy.local.IPolicyAccessPlugin
uses edge.capabilities.policy.util.PolicyUtil
uses edge.capabilities.policychange.bind.IPolicyChangeBindPlugin
uses edge.capabilities.policychange.draft.IPolicyChangeDraftPlugin
uses edge.capabilities.policychange.dto.PolicyChangeActivityDTO
uses edge.capabilities.policychange.dto.PolicyChangeDTO
uses edge.capabilities.policychange.dto.PolicySummaryDTO
uses edge.capabilities.policychange.quote.IPolicyChangeQuotePlugin
uses edge.capabilities.policychange.util.PolicyChangeActivityUtil
uses edge.capabilities.policycommon.accountcontact.IAccountContactPlugin
uses edge.di.annotations.InjectableNode
uses edge.jsonrpc.annotation.JsonRpcMethod
uses edge.security.EffectiveUserProvider
uses edge.security.authorization.IAuthorizerProviderPlugin
uses gw.api.webservice.exception.BadIdentifierException
uses edge.capabilities.quote.lob.homeowners.draft.mappers.contact.PolicyAdditionalInterestMapper

class AgentPolicyChangeHandler extends PolicyChangeHandler{

  private var _policyAccessPlugin: IPolicyAccessPlugin
  private var _accountContactPlugin : IAccountContactPlugin
  private var _policyUtil : edge.capabilities.helpers.PolicyUtil
  var _retrievePlugin : IPolicyChangeRetrievalPlugin

  @InjectableNode
  construct(authorizer:IAuthorizerProviderPlugin, retrievalPlugin:IPolicyChangeRetrievalPlugin,
            draftPlugin:IPolicyChangeDraftPlugin, quotingPlugin:IPolicyChangeQuotePlugin,
            bindingPlugin:IPolicyChangeBindPlugin, aUserProvider: EffectiveUserProvider,
            policyAccessPlugin: IPolicyAccessPlugin, contactPlugin : IAccountContactPlugin,
            policyUtil: edge.capabilities.helpers.PolicyUtil) {

    super(authorizer, retrievalPlugin, draftPlugin, quotingPlugin, bindingPlugin, aUserProvider)
    this._policyAccessPlugin = policyAccessPlugin
    this._accountContactPlugin = contactPlugin
    this._policyUtil = policyUtil
    this._retrievePlugin = retrievalPlugin
  }

  /**
   * Returns the  PolicySummaryDTO
   *
   * @returns a PolicySummaryDTO containing the policy
   */
  @JsonRpcMethod
  override function getAvailablePolicy(policyNumber: String) : PolicySummaryDTO {

    final var period = PolicyUtil.getLatestPolicyPeriodByPolicyNumber(policyNumber)

    if (period == null || !_policyAccessPlugin.hasAccess(period) || !period.Policy.Issued) {
      throw new BadIdentifierException("Bad policy number " + policyNumber)
    }

    return populatePolicySummaryDTO(period.Policy)
  }

  @JsonRpcMethod
  function addMortgagee(changeDto:PolicyChangeDTO) : PolicySummaryDTO{
    var job = save(changeDto)
    var policyPeriod = _retrievePlugin.retrieveByJobNumber(job.JobID)
    gw.transaction.Transaction.runWithNewBundle( \bundle -> {
      policyPeriod = bundle.add(policyPeriod)
      var company = new Company()
      var newInterestDetail = policyPeriod.HomeownersLine_HOE.Dwelling.addAdditionalInterestDetail(company)
      var newAdditionalInterest = newInterestDetail.PolicyAddlInterest
      newAdditionalInterest.ContactDenorm = company
      var mapper = new PolicyAdditionalInterestMapper()
      _accountContactPlugin.updateContact(newAdditionalInterest.ContactDenorm,changeDto.CoverageLobs.Homeowners.AdditionalInterest.Contact)
      mapper.updateContactRole(newAdditionalInterest,changeDto.CoverageLobs.Homeowners.AdditionalInterest)
    })
    quote(job.JobID)
    bind(job.JobID,null)
    return populatePolicySummaryDTO(policyPeriod.Policy)
  }

  @JsonRpcMethod
  function createActivityForPolicyChange(policyChangeActivityDTO : PolicyChangeActivityDTO) : PolicySummaryDTO{
    var policy = _policyUtil.getPolicyByPolicyNumber(policyChangeActivityDTO.PolicyNumber)
    var description = PolicyChangeActivityUtil.constructActivityDescription(policyChangeActivityDTO)
    gw.transaction.Transaction.runWithNewBundle( \bundle -> {
      policy = bundle.add(policy)
      var activity = ActivityPattern.finder.getActivityPatternByCode("agency_policy_change_request").createPolicyActivity(bundle,policy,null,description,null,null,null,null,null)
      activity.assignToRole(TC_UNDERWRITER)
    })
    return populatePolicySummaryDTO(policy)
  }
}
