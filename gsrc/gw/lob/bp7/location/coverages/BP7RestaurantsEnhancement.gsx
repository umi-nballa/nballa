package gw.lob.bp7.location.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7RestaurantsEnhancement : productmodel.BP7Restaurants {
  function isMaintananceAgreementOptionAvaliable(optionCode : String) : boolean {
    var map = {
        "CoverageType" -> this.BP7CovType1Term.OptionValue.OptionCode

    }
    var results = SystemTableQuery.query(BP7SpoilageMaintenanceAgr, map)
    return results.contains(optionCode)
  }
}
