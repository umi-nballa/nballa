package gw.lob.bp7

uses gw.plugin.rateflow.IRateRoutineConfig
uses gw.policy.PolicyLineConfiguration
uses gw.api.productmodel.PolicyLinePatternLookup
uses gw.lob.bp7.rating.BP7RateRoutineConfig

@Export
class BP7Configuration extends PolicyLineConfiguration {

  override property get RateRoutineConfig(): IRateRoutineConfig {
    return new BP7RateRoutineConfig()
  }

  override property get AllowedCurrencies(): List<Currency> {
    var pattern = PolicyLinePatternLookup.getByPublicID(InstalledPolicyLine.TC_BP7.UnlocalizedName)
    return pattern.AvailableCurrenciesByPriority
  }
}