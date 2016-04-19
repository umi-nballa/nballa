package gw.lob.bp7.location.coverages

uses gw.lob.common.util.BigDecimalRange
uses gw.lob.common.util.SystemTableQuery

enhancement BP7LocationEmployeeDishtyEnhancement : productmodel.BP7LocationEmployeeDishty {
  property get NumEmployeesValueRange() : BigDecimalRange {
    var map = {
        "EmployeeDishtyApply" -> this.BP7EmployeeDishtyApplyTerm.OptionValue.OptionCode
    }

    return SystemTableQuery.queryRange(BP7EmployeeDishtyNumEmplo, map)
  }

  function employeeDishonestyIncludedTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "Limit_" -> this.Location.Line.BP7EmployeeDishty.BP7Limit6Term.OptionValue.OptionCode
    }
    var results = SystemTableQuery.query(BP7EmployeeDishtyApply, map)
    return results.contains(optionCode)
  }

  function employeeDishonestyNumEmployeesCovTermAvailable() : boolean {
    return this.BP7EmployeeDishtyApplyTerm.OptionValue.OptionCode == "Yes"
  }
}