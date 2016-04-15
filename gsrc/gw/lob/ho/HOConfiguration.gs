package gw.lob.ho

uses gw.plugin.rateflow.IRateRoutineConfig
uses gw.policy.PolicyLineConfiguration
uses gw.lob.ho.rating.HORateRoutineConfig
uses gw.api.productmodel.PolicyLinePatternLookup

class HOConfiguration extends PolicyLineConfiguration {

  override property get RateRoutineConfig(): IRateRoutineConfig {
    return new HORateRoutineConfig()
  }

  override property get AllowedCurrencies(): List<Currency> {
    var pattern = PolicyLinePatternLookup.getByPublicID(InstalledPolicyLine.TC_HO.UnlocalizedName)
    return pattern.AvailableCurrenciesByPriority
  }
}