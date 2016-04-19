package gw.lob.bp7.line.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7BusinessLiabilityEnhancement : productmodel.BP7BusinessLiability {
  function aggregateLimitCovTermAvailable(optionCode : String) : boolean {
    var map = {
        "EachOccLimit" -> this.BP7EachOccLimitTerm.ValueAsString
    }
    return SystemTableQuery.query(BP7AggLimit, map).contains(optionCode)
  }

  function prodCompldOpsAggregateLimitAvailable(optionCode : String) : boolean {
    var map = {
        "EachOccLimit" -> this.BP7EachOccLimitTerm.ValueAsString
    }
    return SystemTableQuery.query(BP7ProdsCompldOpsAggLimit, map).contains(optionCode)
  }

  function propDamageLiabDedTypeAvailable(optionCode : String) : boolean {
    var map = {
        "PropDamageLiabDed" -> this.BP7PropDamageLiabDedTerm.ValueAsString
    }
    return SystemTableQuery.query(BP7PropDamageLiabDedType, map).contains(optionCode)
  }
}
