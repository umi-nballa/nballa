package gw.lob.bp7.building.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7FunctlBldgValtnEnhancement : productmodel.BP7FunctlBldgValtn {
  function functionBuildingValuationHoursWaitingTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "BusnIncomeExtraExpense" -> this.BP7BusinessIncomeExtraExpenseTerm.Value?.toYesNoString()
    }
    var results = SystemTableQuery.query(BP7BusnIncomeExtraExpense, map)
    return results.contains(optionCode)
  }
}
