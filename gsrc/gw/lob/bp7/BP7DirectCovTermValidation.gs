package gw.lob.bp7

uses gw.api.domain.covterm.CovTerm
uses gw.entity.IEntityType

uses java.math.BigDecimal

class BP7DirectCovTermValidation {
  public static function validate(term: CovTerm, value: BigDecimal): String {
    switch (term.Pattern) {
      case "BP7Limit22":
          return validateOrdinanceOrLawLimitTerm(BP7OrdinanceOrLawCov2Limi, term, value)
      case "BP7Limit23":
          return validateOrdinanceOrLawLimitTerm(BP7OrdinanceOrLawCov3Limi, term, value)
      case "BP7Limit24":
          return validateOrdinanceOrLawLimitTerm(BP7OrdinanceOrLawCombined, term, value)
      case "BP7SubLimitForCondominiumAssociationDeductible":
          return validateSubLimitForCondominiumAssociationDeductible(term, value)
        default:
        return null
    }
  }

  public static function validateOrdinanceOrLawLimitTerm(entity: IEntityType, term: CovTerm, value: BigDecimal): String {
    if (term.Clause typeis BP7OrdinanceOrLawCov){
      var range = term.Clause.getLimitFieldsRange(entity)
      if (!range.contains(value)){
        return displaykey.Web.Policy.BP7.Validation.CovTermValueOutOfRange(range.LowerBound, range.UpperBound)
      }
    }
    return null
  }

  public static function validateSubLimitForCondominiumAssociationDeductible(term : CovTerm, value : BigDecimal) : String {
    var limit = (term.Clause as BP7CondoCommlUnitOwnersOptionalCovs).BP7Limit26Term.OptionValue.Value

    if (limit != 0 && value >= limit) {
      return displaykey.Web.Policy.BP7.Validation.Classification.CondominiumAssociationDedMustBeLessThanLossAssignmentLimit
    }

    return null
  }
}