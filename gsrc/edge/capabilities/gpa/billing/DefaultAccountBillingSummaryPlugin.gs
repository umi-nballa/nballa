package edge.capabilities.gpa.billing

uses edge.di.annotations.ForAllGwNodes
uses edge.capabilities.gpa.billing.dto.AccountBillingSummaryDTO
uses edge.capabilities.gpa.currency.local.ICurrencyPlugin
uses gw.plugin.billing.BillingAccountInfo
uses edge.PlatformSupport.Reflection
uses edge.PlatformSupport.Logger
uses edge.capabilities.gpa.billing.local.IPrimaryPayerPlugin
uses java.lang.Exception
uses gw.api.util.DisplayableException
uses edge.capabilities.gpa.currency.dto.CurrencyDTO
uses gw.pl.currency.MonetaryAmount
uses wsi.local.gw.webservice.pc.pc700.account.accountapi.faults.BadIdentifierException

class DefaultAccountBillingSummaryPlugin implements IAccountBillingSummaryPlugin {

  private static var LOGGER = new Logger(Reflection.getRelativeName(DefaultAccountBillingSummaryPlugin))

  private var _currencyPlugin : ICurrencyPlugin
  private var _billingPlugin : gw.plugin.billing.IBillingSummaryPlugin
  private var _primaryPayerPlugin : IPrimaryPayerPlugin

  @ForAllGwNodes
  construct(aCurrencyPlugin : ICurrencyPlugin, aPrimaryPayerPlugin : IPrimaryPayerPlugin) {
    this._currencyPlugin = aCurrencyPlugin
    this._primaryPayerPlugin = aPrimaryPayerPlugin
    this._billingPlugin =  gw.plugin.Plugins.get(gw.plugin.billing.IBillingSummaryPlugin)
  }

   protected function toDTO(aBillingSummary: BillingAccountInfo, anAccount: Account): AccountBillingSummaryDTO {
    final var dto = new AccountBillingSummaryDTO()

    dto.IsDelinquent = aBillingSummary.Delinquent
    dto.OutstandingCurrent = _currencyPlugin.toDTO(aBillingSummary.BilledOutstandingCurrent)
    dto.OutstandingPastDue = _currencyPlugin.toDTO(aBillingSummary.BilledOutstandingPastDue)
    dto.OutstandingTotal = _currencyPlugin.toDTO(aBillingSummary.BilledOutstandingTotal)
    dto.CollateralRequirement = _currencyPlugin.toDTO(aBillingSummary.CollateralRequirement)
    dto.CollateralHeld = _currencyPlugin.toDTO(aBillingSummary.CollateralHeld)
    dto.PrimaryPayer = _primaryPayerPlugin.toDTO(aBillingSummary.PrimaryPayer)
    dto.UnappliedFunds = _currencyPlugin.toDTO(aBillingSummary.UnappliedFundsTotal)
    dto.Unbilled = _currencyPlugin.toDTO(aBillingSummary.UnbilledTotal)

    return dto
  }

  override function getAccountBillingSummary(anAccount: Account): AccountBillingSummaryDTO {
    try{
      return this.toDTO(_billingPlugin.retrieveAccountBillingSummaries(anAccount.AccountNumber).first(), anAccount)
    } catch(e : DisplayableException){
      if(LOGGER.debugEnabled()){
        LOGGER.logError(e)
      }else{
        LOGGER.logError(e.LocalizedMessage)
      }
    } catch(e : Exception){
      LOGGER.logError(e)
    }

    return null
  }


}
