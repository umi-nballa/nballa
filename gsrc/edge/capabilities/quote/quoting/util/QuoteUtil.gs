package edge.capabilities.quote.quoting.util

uses java.lang.UnsupportedOperationException
uses edge.capabilities.quote.quoting.dto.QuoteDTO
uses edge.util.helper.CurrencyOpUtil
uses edge.capabilities.currency.dto.AmountDTO
uses java.util.Date
uses java.util.GregorianCalendar
uses java.util.Calendar
uses edge.capabilities.quote.lob.homeowners.quoting.dto.HOPremiumCostsDTO

/**
 * Utilities for the quoting process.
 */
class QuoteUtil {
  public static final var HO_FLOOD_BRANCH_NAME : String = "FloodVersion"
  public static final var CUSTOM_BRANCH_NAME: String = "CUSTOM"

  private construct() {
    throw new UnsupportedOperationException()
  }

  /**
   * Returns a base (non-custom) policy period for the submission.
   */
  public static function getBasePeriod(sub : Submission) : PolicyPeriod {
    var period = sub.ActivePeriods.firstWhere(\ p -> p.BranchName == CUSTOM_BRANCH_NAME)
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
      dto.Lobs.Homeowners = new HOPremiumCostsDTO (){:FloodPremium = pp.Submission.Periods.atMostOneWhere( \ floodVersion ->
                                                                                                             floodVersion.BranchName ==  QuoteUtil.HO_FLOOD_BRANCH_NAME)
                                                                                          .HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.Cost.ActualAmount.Amount}
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
