package gw.lob.bp7.location.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7LocationLimitedFungiOrBacteriaEnhancement : productmodel.BP7LocationLimitedFungiOrBacteria {
  function limitedFungiOrBacteriaTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "FungiPolicyLimitApply" -> this.Location.Line.BP7LimitedFungiBacteriaCov.BP7SeparatePremisesLocationsOptionTerm.Value ? "Yes" : "No"
    }
    var results = SystemTableQuery.query(BP7FungiLocLimitApply, map)
    return results.contains(optionCode)
  }

  function limitedFungiOrBacteriaLimitCovTermAvailable() : boolean {
    return this.BP7SeparateAnnualAggregateLimit1Term.OptionValue.OptionCode == "Yes"
  }
}
