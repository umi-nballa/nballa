package edge.capabilities.policychange

uses edge.security.EffectiveUserProvider
uses edge.capabilities.policychange.bind.IPolicyChangeBindPlugin
uses edge.capabilities.policychange.quote.IPolicyChangeQuotePlugin
uses edge.capabilities.policychange.draft.IPolicyChangeDraftPlugin
uses edge.capabilities.policychange.dto.PolicySummaryDTO
uses edge.security.authorization.IAuthorizerProviderPlugin
uses edge.di.annotations.InjectableNode
uses edge.jsonrpc.annotation.JsonRpcMethod
uses edge.capabilities.policy.local.IPolicyAccessPlugin
uses gw.api.webservice.exception.BadIdentifierException
uses edge.capabilities.policy.util.PolicyUtil

class AgentPolicyChangeHandler extends PolicyChangeHandler{

  private var _policyAccessPlugin: IPolicyAccessPlugin

  @InjectableNode
  construct(authorizer:IAuthorizerProviderPlugin, retrievalPlugin:IPolicyChangeRetrievalPlugin,
            draftPlugin:IPolicyChangeDraftPlugin, quotingPlugin:IPolicyChangeQuotePlugin,
            bindingPlugin:IPolicyChangeBindPlugin, aUserProvider: EffectiveUserProvider, policyAccessPlugin: IPolicyAccessPlugin) {

    super(authorizer, retrievalPlugin, draftPlugin, quotingPlugin, bindingPlugin, aUserProvider)
    this._policyAccessPlugin = policyAccessPlugin
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
}
