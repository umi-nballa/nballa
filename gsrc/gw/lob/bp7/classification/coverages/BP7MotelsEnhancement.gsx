package gw.lob.bp7.classification.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7MotelsEnhancement : productmodel.BP7Motels {
  function perGuestLimitTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "GuestsPropLimit" -> this.BP7GuestsPropLimitTerm.ValueAsString
    }
    var results = SystemTableQuery.query(BP7PerGuestLimit, map)
    return results.contains(optionCode)
  }
}
