package gw.lob.bp7.building.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7BuildingLimitedFungiOrBacteriaEnhancement : productmodel.BP7BuildingLimitedFungiOrBacteria {
  function limitedFungiOrBacteriaAggregateLimitTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "SeparateAnnualAggLimit" -> this.Building.Location.BP7LocationLimitedFungiOrBacteria.BP7SeparateAnnualAggregateLimit1Term.ValueAsString
    }
    var results = SystemTableQuery.query(BP7FungiStructLimitApply, map)
    return results.contains(optionCode)
  }

  function limitedFungiOrBacteriaFungiLimitCovTermAvailable() : boolean {
    return this.BP7SeparateAnnualAggregateLimitTerm.OptionValue.OptionCode == "Yes"
  }
}
