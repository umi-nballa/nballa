package gw.lob.bp7.line.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7EmploymentRelatedPracticesLiabilityCovEnhancement : productmodel.BP7EmploymentRelatedPracticesLiabilityCov {
  function employmentRelatedSPracticesLiabilitySupplLimitTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "AggLimit" -> this.BP7AggLimit1Term.Value.toString()
    }

    return SystemTableQuery.query(BP7EmploymentRelatedSuppl, map).contains(optionCode)
  }
}
