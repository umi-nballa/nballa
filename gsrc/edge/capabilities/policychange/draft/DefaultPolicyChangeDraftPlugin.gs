package edge.capabilities.policychange.draft

uses edge.capabilities.policychange.dto.PolicyChangeDTO
uses edge.di.annotations.ForAllGwNodes
uses edge.capabilities.address.IPolicyAddressPlugin
uses edge.capabilities.policychange.lob.ILobDraftPlugin
uses edge.capabilities.policychange.dto.DraftLobDataDTO
uses edge.capabilities.currency.dto.AmountDTO
uses edge.capabilities.policychange.util.PolicyChangeUtil
uses edge.capabilities.policychange.dto.PolicyChangeHistoryDTO
uses edge.PlatformSupport.Bundle
uses java.util.ArrayList
uses edge.capabilities.quote.lob.ILobQuotingPlugin
uses edge.capabilities.quote.lob.dto.QuoteLobDataDTO

/**
 * {@inheritDoc}
 *
 * This implementation delegates the update of different parts of the DTO to instances of the following plugins:
 *
 *   - IPolicyAddressPlugin
 *   - ILobPolicyPlugin
 */
class DefaultPolicyChangeDraftPlugin implements IPolicyChangeDraftPlugin {

  private var _addressPlugin : IPolicyAddressPlugin
  private var _lobPlugin : ILobDraftPlugin <DraftLobDataDTO>
  private var _coverageLobPlugin : ILobQuotingPlugin <QuoteLobDataDTO>

  @ForAllGwNodes
  construct(addressPlugin:IPolicyAddressPlugin, lobPlugin : ILobDraftPlugin <DraftLobDataDTO>, coveragesPlugin : ILobQuotingPlugin<QuoteLobDataDTO>) {
    _addressPlugin = addressPlugin
    _lobPlugin = lobPlugin
    _coverageLobPlugin = coveragesPlugin
  }

  override function toDto(period: PolicyPeriod): PolicyChangeDTO {
    var dto = new PolicyChangeDTO()

    toDto(dto, period)

    return dto
  }

  override function toDto(change: PolicyChange): PolicyChangeDTO {
    var dto = new PolicyChangeDTO()
    dto.JobID = change.JobNumber

    toDto(dto, change.LatestPeriod)
    dto.History = getHistory(change.LatestPeriod)
    return dto
  }

  override function updateFromDto(change: PolicyChange, dto: PolicyChangeDTO) {
    var period = change.LatestPeriod
    _addressPlugin.updateFromDTO(period.PolicyAddress, dto.PolicyAddress)
    period.PolicyAddress.AddressType = dto.PolicyAddress.AddressType
    _lobPlugin.updateExistingDraftSubmission(period, dto.Lobs)
  }

  override function updateCoveragesFromDto(period: PolicyPeriod, coverages: QuoteLobDataDTO) {
    _coverageLobPlugin.updateCustomQuote(period, coverages)
  }

  protected function toDto(dto: PolicyChangeDTO, period: PolicyPeriod) {
    dto.PolicyNumber = period.PolicyNumber
    dto.AccountNumber = period.Policy.Account.AccountNumber
    dto.AccountName = period.Policy.Account.AccountHolder.AccountContact.DisplayName
    dto.EffectiveDate = period.EditEffectiveDate
    dto.ProductCode = period.Policy.ProductCode
    dto.MinimumEffectiveDate = PolicyChangeUtil.computeMinimumStartDate(period.Policy).trimToMidnight()
    dto.PeriodEnd = period.PeriodEnd
    dto.PeriodStart = period.PeriodStart
    dto.Status = period.Status
    dto.TotalCost = AmountDTO.fromMonetaryAmount(period.TotalCostRPT)
    if ( period.Status != PolicyPeriodStatus.TC_BOUND) {
      dto.PreviousTotalCost = AmountDTO.fromMonetaryAmount(period.BasedOn.TotalCostRPT)
    } else {
      dto.PreviousTotalCost = dto.TotalCost
    }

    dto.TransactionCost = AmountDTO.fromMonetaryAmount(period.TransactionCostRPT)
    dto.PolicyAddress = _addressPlugin.toDto(period.PolicyAddress)
    var address = period.PolicyAddress.Address
    dto.PolicyAddress.PublicID = period.PolicyAddress.PublicID
    dto.PolicyAddress.DisplayName = period.PolicyAddress.Address.DisplayName
    dto.PolicyAddress.AddressType = period.PolicyAddress.AddressType
    dto.Lobs = _lobPlugin.toDraftDTO(period)
    dto.CoverageLobs = _coverageLobPlugin.getQuoteDetails(period)
  }

  function getHistory(period : PolicyPeriod) : PolicyChangeHistoryDTO[]{
    var history = new ArrayList<PolicyChangeHistoryDTO>()
    Bundle.transaction(\bundle ->{
      period = bundle.add(period)
      var diffItems = period.getDiffItems(DiffReason.TC_POLICYREVIEW)
        for (diff in diffItems){
          var dto = _lobPlugin.toHistoryDTO(diff)
          if (dto != null && !history.hasMatch( \ elt -> dto.EntityType == elt.EntityType && elt.FixedId == dto.FixedId) ){
            //Ensure that there isn't unnecessary info in the history
            history.add(dto)
          }
      }
    })
    return history.toTypedArray()
  }
}
