package gw.lob.bp7.location.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7LocationPropertyDeductiblesEnhancement : productmodel.BP7LocationPropertyDeductibles {
  function windHailDeductibleTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "OptionalDeductible" -> this.BP7OptionalDeductibleTerm.OptionValue.OptionCode
    }
    var results = SystemTableQuery.query(BP7WindHailDeductible, map)
    return results.contains(optionCode)
  }
}
