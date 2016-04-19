package gw.lob.bp7

uses gw.api.domain.covterm.CovTerm
uses gw.lob.common.util.BigDecimalRange

uses java.lang.Integer

class BP7PositiveIntegerCovTermValidation {

  public static function validate(term : CovTerm, value : Integer) : String {
    var positiveIntValidationErrorMessage = validatePositiveIntegerValue(value)
    if (positiveIntValidationErrorMessage != null) {
      return positiveIntValidationErrorMessage
    }

    switch (term.Pattern) {
      case "BP7YearA2":
      case "BP7YearB2":
      case "BP7YearA1":
      case "BP7YearB1":
      case "BP7YearA":
      case "BP7YearB":
          return validateYearFieldValue(term, value)
      case "BP7ComputerFraudNumEmployees":
      case "BP7NumEmployees1":
          return validateMaximumNumberOfEmployeesFieldValue(term, value)
        default:
        return null
    }
  }

  private static function validatePositiveIntegerValue(value : Integer) : String {
    if (value < 1) {
      return displaykey.Web.Policy.Validation.PositiveInteger
    }

    return null
  }

  private static function validateYearFieldValue(covTerm : CovTerm, value : Integer) : String {
    if (value > 2099 or value < 2000) {
      return displaykey.Web.Policy.BP7.Validation.Line.DisclosureYearFieldRange
    }

    return null
  }

  private static function validateMaximumNumberOfEmployeesFieldValue(covTerm : CovTerm, value : Integer) : String {
    var valueRange : BigDecimalRange
    if (covTerm.Clause typeis BP7LocationComputerFraudFundsTransferFraud) {
      valueRange = covTerm.Clause.ComputerFraudNumEmployeesValueRange
    } else if (covTerm.Clause typeis BP7LocationEmployeeDishty) {
      valueRange = covTerm.Clause.NumEmployeesValueRange
    }

    if (!valueRange.contains(value as String)) {
      return displaykey.Web.Policy.BP7.Validation.CovTermValueOutOfRange(valueRange.LowerBound, valueRange.UpperBound)
    }

    return null
  }
}