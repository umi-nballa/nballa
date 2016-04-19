package gw.lob.bp7.location.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaEnhancement : productmodel.BP7RestaurantsLossOrDamageToCustomersAutosLegalLia {
  function restaurantsLossOrDamageOtherThanCollisionAnyOneEventDedAvailable(optionCode : String) : boolean {
    var map = {
        "OTCEachAutoDed" -> this.BP7OTCEachAutoDed1Term.OptionValue.OptionCode
    }
    var results = SystemTableQuery.query(BP7OTCAnyOneEventDed, map)
    return results.contains(optionCode)
  }

  function restaurantsLossOrDamageCollisionDedAvailable(optionCode : String) : boolean {
    var map = {
        "OTCEachAutoDed" -> this.BP7OTCEachAutoDed1Term.OptionValue.OptionCode,
        "OTCAnyOneEventDed" -> this.BP7OTCAnyOneEventDed1Term.OptionValue.OptionCode
    }
    var results = SystemTableQuery.query(BP7CollisionDed, map)
    return results.contains(optionCode)
  }
}
