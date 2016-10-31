package gw.lob.bp7

uses gw.api.domain.covterm.CovTerm
uses gw.entity.IEntityType
uses gw.web.productmodel.ProductModelSyncIssuesHandler
uses una.config.ConfigParamsUtil
uses gw.api.domain.covterm.DirectCovTerm
uses gw.api.domain.covterm.BooleanCovTerm
uses gw.api.domain.covterm.OptionCovTerm
uses una.utils.MathUtil
uses una.productmodel.CoveragesUtil
uses java.lang.Double


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

  public static function validateCalculatedLimits(covTerm: DirectCovTerm, coverable: Coverable) : String {
    var result : String
    if(coverable typeis BusinessOwnersLine){
      var min = covTerm.getMinAllowedLimitValue(coverable)
      var max = covTerm.getMaxAllowedLimitValue(coverable)

      if(ConfigParamsUtil.getList(TC_DERIVEDSPECIALLIMITSCOVTERMPATTERNS, coverable.PolicyLine.BaseState).contains(covTerm.PatternCode)){
        var incrementAmount = ConfigParamsUtil.getDouble(TC_SpecialLimitsIncrementAmount, coverable.BaseState, covTerm.PatternCode)
        var isAllowedValue = isAllowedValue(incrementAmount, covTerm, coverable)

        if(covTerm.Value != null and covTerm.Value < min or covTerm.Value > max or !isAllowedValue){
          result = displaykey.SpecialLimitErrorMessage(covTerm.Pattern.Name, new Double(min).asMoney(), new Double(max).asMoney(), incrementAmount.asMoney())
        }
      }else{
        if((max != null and min != null) and (covTerm.Value < min or covTerm.Value > max)){
          result = displaykey.una.productmodel.validation.LimitValidationMessage(new Double(covTerm.Value).asMoney(), covTerm.Pattern.Name, new Double(min as double).asMoney(), new Double(max as double).asMoney())
        }else if(min != null and covTerm.Value < min){
          result = displaykey.una.productmodel.validation.LimitMinValidationMessage(new Double(min as double).asMoney())
        }else if(max != null and covTerm.Value > max){
          result = displaykey.una.productmodel.validation.LimitMaxValidationMessage (new Double(max as double).asMoney())
        }
      }
    }
    return result
  }

  private static function isAllowedValue(incrementValue : double, covTerm : DirectCovTerm, bp7line : BusinessOwnersLine) : boolean {
    var baseState = bp7line.PolicyLine.BaseState
    var minimumAllowed = covTerm.getMinAllowedLimitValue(bp7line)
    var maximumAllowed = covTerm.getMaxAllowedLimitValue(bp7line)

    var allowedIncrement = minimumAllowed
    var allowedIncrements : List<Double> = {allowedIncrement}

    while(allowedIncrement <= maximumAllowed){
      allowedIncrement += incrementValue
      allowedIncrements.add(allowedIncrement)
    }
    if(covTerm.PatternCode=="BP7LimitatDescribedPremises_EXTTerm" || covTerm.PatternCode=="BP7LimitDescribedPremises_EXT" ||
        covTerm.PatternCode=="BP7Limit38")
          allowedIncrements.add(1000)

    return allowedIncrements.contains(covTerm.Value.doubleValue())
  }
}