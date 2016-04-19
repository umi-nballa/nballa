package gw.lob.bp7.classification.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7SpoilgCovEnhancement : productmodel.BP7SpoilgCov {
  function isMaintananceAgreementOptionAvaliable(optionCode : String) : boolean {
    var map = {
        "CoverageType" -> this.BP7CovType2Term.OptionValue.OptionCode

    }
    var results = SystemTableQuery.query(BP7SpoilageMaintenanceAgr, map)
    return results.contains(optionCode)
  }
}
