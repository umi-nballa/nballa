package edge.capabilities.quote.quoting.util

uses java.lang.UnsupportedOperationException
uses edge.capabilities.quote.quoting.dto.QuoteDTO
uses gw.api.util.CurrencyUtil
uses edge.util.helper.CurrencyOpUtil
uses edge.capabilities.currency.dto.AmountDTO
uses gw.api.util.DateUtil
uses java.util.Date
uses java.util.GregorianCalendar
uses java.util.Calendar

/**
 * Utilities for the quoting process.
 */
class QuoteUtil {

  private construct() {
    throw new UnsupportedOperationException()
  }

  /**
   * Returns a base (non-custom) policy period for the submission.
   */
  public static function getBasePeriod(sub : Submission) : PolicyPeriod {
    var period = sub.ActivePeriods.firstWhere(\ p -> p.BranchName == "CUSTOM")
    // Submissions created from GPA have no "CUSTOM" branch, defaults to the selected branch
    return period == null ? sub.SelectedVersion : period
  }

  /**
   * Fills base properties on the quote DTO.
   */
  public static function fillBaseProperties(dto : QuoteDTO, pp : PolicyPeriod) {
    dto.BranchName = pp.BranchName
    dto.PublicID = pp.PublicID
    if(pp.Offering == null) {
      dto.BranchCode = dto.BranchName
    } else {
      dto.BranchCode = pp.Offering.Code
    }
    dto.IsCustom = pp.Offering == null
    dto.PeriodStartDate = pp.PeriodStart
    dto.PeriodEndDate = pp.PeriodEnd
    dto.QuoteID = pp.Submission.getJobNumber()
    var startToEndMonths = monthsBetweenPeriodStartAndEnd(pp.PeriodStart, pp.PeriodEnd)
    dto.TermMonths = startToEndMonths
    if(pp.TotalCostRPT != null) {
      dto.Total = AmountDTO.fromMonetaryAmount(pp.TotalCostRPT)
      dto.Taxes = AmountDTO.fromMonetaryAmount(CurrencyOpUtil.sum(pp.AllCosts.TaxSurcharges))
      dto.TotalBeforeTaxes = AmountDTO.fromMonetaryAmount(pp.TotalPremiumRPT)
      dto.MonthlyPremium =  AmountDTO.fromMonetaryAmount(pp.TotalCostRPT / dto.TermMonths)
    }
  }

  public static function fillBasePropertyTotalAmount(dto : QuoteDTO, pp : PolicyPeriod){
    if(pp.TotalCostRPT != null) {
      dto.Total = AmountDTO.fromMonetaryAmount(pp.TotalCostRPT)
    }
  }

  private static function monthsBetweenPeriodStartAndEnd(start: Date, end: Date) : int{
    var startCalendar = new GregorianCalendar();
    startCalendar.setTime(start);
    var endCalendar = new GregorianCalendar();
    endCalendar.setTime(end);

    var diffYear = endCalendar.get(Calendar.YEAR) - startCalendar.get(Calendar.YEAR)
    return diffYear * 12 + endCalendar.get(Calendar.MONTH) - startCalendar.get(Calendar.MONTH)
  }
}
