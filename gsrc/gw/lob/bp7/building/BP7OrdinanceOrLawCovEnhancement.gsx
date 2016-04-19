package gw.lob.bp7.building

uses gw.entity.IEntityType
uses gw.lob.common.util.BigDecimalRange
uses gw.lob.common.util.SystemTableQuery

enhancement BP7OrdinanceOrLawCovEnhancement: productmodel.BP7OrdinanceOrLawCov {
  function getLimitFieldsRange(entityToCheck: IEntityType): BigDecimalRange {
    var args = {
        "Coverage" -> this.BP7Term.OptionValue.OptionCode
    }
    return SystemTableQuery.queryRange(entityToCheck, args)
  }

  function isCov2LimitAvailable(): boolean {
    return isTermAvaliable(getLimitFieldsRange(BP7OrdinanceOrLawCov2Limi))
  }

  function isCov3LimitAvailable(): boolean {
    return isTermAvaliable(getLimitFieldsRange(BP7OrdinanceOrLawCov3Limi))
  }

  function isCov2and3CombinedLimitAvailable(): boolean {
    return isTermAvaliable(getLimitFieldsRange(BP7OrdinanceOrLawCombined))
  }

  function isTermAvaliable(range: BigDecimalRange): boolean {
    return not (range.UpperBound == range.LowerBound && range.LowerBound == 0)
  }

  function hoursWaitingPeriodTermOptionAvailable(optionCode : String) : boolean {
    var map = {
        "BusnIncomeExtraExpense" -> this.BP7BusnIncomeAndExtraExpenseOptionalTerm.Value?.toYesNoString()
    }
    var results = SystemTableQuery.query(BP7BusnIncomeExtraExpense, map)
    return results.contains(optionCode) and isNumberOfHoursWaitingPeriodTermOptionOtherThan0AndNotApplicableAvailable(optionCode)
  }

  private function isNumberOfHoursWaitingPeriodTermOptionOtherThan0AndNotApplicableAvailable(optionCode: String): boolean {
    if (optionCode == "72"){
      return not (this.PolicyLine as BP7Line).BP7BusnIncomeChangesTimePeriodExists
    }
    return true
  }
}
