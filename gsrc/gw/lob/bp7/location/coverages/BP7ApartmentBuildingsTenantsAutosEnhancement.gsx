package gw.lob.bp7.location.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7ApartmentBuildingsTenantsAutosEnhancement : productmodel.BP7ApartmentBuildingsTenantsAutos {
  function apartmentsBuildingsLossOrDamageOtherThanCollisionAnyOneEventDedAvailable(optionCode : String) : boolean {
    var map = {
        "OTCEachAutoDed" -> this.BP7OTCEachAutoDedTerm.OptionValue.OptionCode
    }
    var results = SystemTableQuery.query(BP7OTCAnyOneEventDed, map)
    return results.contains(optionCode)
  }

  function apartmentsBuildingsLossOrDamageCollisionDedAvailable(optionCode : String) : boolean {
    var map = {
        "OTCEachAutoDed" -> this.BP7OTCEachAutoDedTerm.OptionValue.OptionCode,
        "OTCAnyOneEventDed" -> this.BP7OTCAnyOneEventDedTerm.OptionValue.OptionCode
    }
    var results = SystemTableQuery.query(BP7CollisionDed, map)
    return results.contains(optionCode)
  }
}
