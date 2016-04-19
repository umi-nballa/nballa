package gw.lob.bp7.line.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7ContrctrsInstalltnTypesEnahncement : productmodel.BP7ContrctrsInstalltnTypes {
  function allCoveredJobSitesLimitAvailable(optionCode : String) : boolean {
    var map = {
        "EachCoveredJobSiteLimi" -> this.BP7EachCoveredJobSiteLimitTerm.ValueAsString
    }
    return SystemTableQuery.query(BP7ContrctrsAllCoveredJob, map).contains(optionCode)
  }
}
