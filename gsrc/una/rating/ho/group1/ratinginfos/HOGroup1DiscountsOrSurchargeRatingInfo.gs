package una.rating.ho.group1.ratinginfos

uses gw.api.util.DateUtil
uses una.config.ConfigParamsUtil
uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.util.Date
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 9/1/16
 * Rating info for discounts and surcharges of group1 states for HO policies
 */
class HOGroup1DiscountsOrSurchargeRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo {

  var _isPrivateFireCompanyDiscountApplicable: boolean as IsPrivateFireCompanyDiscountApplicable
  var _bcegFactor : int as BCEGFactor
  var _preferredBuilderExists : boolean as PreferredBuilderExists
  var _preferredFinancialInstitutionExists : boolean as PreferredFinancialInstitutionExists
  var _consecutiveYrsWithUniversal: int as ConsecutiveYrsWithUniversal
  var _priorLosses : int as PriorLosses = 0

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    super(line, totalBasePremium)
    this.CoverageALimit = line.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
    this.AllPerilDeductible = line.Dwelling.AllPerilsOrAllOtherPerilsCovTerm.Value
    _isPrivateFireCompanyDiscountApplicable = isPrivateFireCompanyDiscountApplicable(line)

    _bcegFactor = line.Dwelling?.HOLocation?.OverrideBCEG_Ext? line.Dwelling?.HOLocation?.BCEGOverridden_Ext?.Code?.toInt() : line.Dwelling.HOLocation?.BCEG_Ext?.Code?.toInt()

    if(line.BaseState == Jurisdiction.TC_CA){
      if(line.Branch.PreferredBuilder_Ext != null)
        _preferredBuilderExists = true
      if(line.Branch.PreferredFinInst_Ext != null)
        _preferredFinancialInstitutionExists = true
    }

    var policyPeriod = line?.Dwelling?.PolicyPeriod
    var originalEffectiveDate = policyPeriod?.Policy.OriginalEffectiveDate
    var editEffectiveDate = policyPeriod?.EditEffectiveDate
    _consecutiveYrsWithUniversal = getDiffYears(originalEffectiveDate, editEffectiveDate)

    if(line?.HOPriorLosses_Ext != null){
      _priorLosses = line?.HOPriorLosses_Ext?.where( \ elt -> elt.ChargeableClaim == typekey.Chargeable_Ext.TC_YES).length
    }
  }

  override property get YearForAgeOfHomeCalc() : int{
    var yearForCalc: int
    if (this.Line.BaseState != Jurisdiction.TC_NV and Line.Dwelling?.HasAllRenovations) {
      yearForCalc = Line.Dwelling.MostRecentRenovationYear
    } else {
      yearForCalc = Line.Dwelling.OverrideYearbuilt_Ext? Line.Dwelling.YearBuiltOverridden_Ext : Line.Dwelling.YearBuilt
    }
    return yearForCalc
  }

  private function isPrivateFireCompanyDiscountApplicable(line: HomeownersLine_HOE): boolean {
    var territoryCode = line.Dwelling.HOLocation?.PolicyLocation?.TerritoryCodes?.single().Code
    var zipCode = line.Dwelling.HOLocation?.PolicyLocation?.PostalCode
    if ((territoryCode == "50" and (zipCode == "85268" || zipCode == "85269")) ||
        (territoryCode == "47" and zipCode == "85377")){
      return true
    }
    return false
  }

  private function getDiffYears(originalEffectiveDate: Date, editEffectiveDate: Date): int {
    if (originalEffectiveDate == null || editEffectiveDate == null){
      return 0
    }
    var time = (editEffectiveDate.YearOfDate - originalEffectiveDate.YearOfDate)
    if (time <= 0)
      return 0
    else {
      return time
    }
  }
}