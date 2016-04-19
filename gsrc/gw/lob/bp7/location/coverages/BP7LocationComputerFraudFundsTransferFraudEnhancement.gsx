package gw.lob.bp7.location.coverages

uses gw.lob.common.util.BigDecimalRange
uses gw.lob.common.util.SystemTableQuery

enhancement BP7LocationComputerFraudFundsTransferFraudEnhancement : productmodel.BP7LocationComputerFraudFundsTransferFraud {
  property get ComputerFraudNumEmployeesValueRange() : BigDecimalRange {
    var map = {
      "ComputerFraudApply" -> this.BP7ComputerFraudApplyTerm.OptionValue.OptionCode
    }

    return SystemTableQuery.queryRange(BP7ComputerFraudNumEmploy, map)
  }

  function computerFraudNumEmployeesCovTermAvailable() : boolean {
    return this.BP7ComputerFraudApplyTerm.OptionValue.OptionCode == "Yes"
  }

  function computerFraudLimitTermOptionAvailable(optionCode : String) : boolean {
    var deleteMe = this.Location.TerritoryCode
    var map = {
        "Limit_" -> this.Location.Line.BP7ComputerFraudFundsTransferFraud.BP7Limit4Term.OptionValue.OptionCode
    }
    var results = SystemTableQuery.query(BP7ComputerFraudApply, map)
    return results.contains(optionCode)
  }
}