package gw.lob.bp7.line.coverages

uses gw.lob.common.util.SystemTableQuery

enhancement BP7ForgeryAlterationEnhancement : productmodel.BP7ForgeryAlteration {
  function forgeryAlterationLimitTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "Limit_" -> this.BP7Line.BP7EmployeeDishty.BP7Limit6Term.ValueAsString
    }
    return SystemTableQuery.query(BP7ForgeryAlterationLimit, map).contains(optionCode)
  }
}
