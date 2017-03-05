package una.rating.ho.common

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses una.rating.util.HOProtectionDetailsMapper


/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 10/12/16
 * Time: 9:56 AM
 */
class HOCommonDiscountsOrSurchargeRatingInfo {
  var _totalBasePremium: BigDecimal as TotalBasePremium
  var _coverageALimit: BigDecimal as CoverageALimit
  var _personalPropertyLimit: BigDecimal as PersonalPropertyLimit
  var _allPerilDeductible: BigDecimal as AllPerilDeductible
  var _maxAgeOfHome: int as MaxAgeOfHome
  var _line : HomeownersLine_HOE as Line
  var _policyType : HOPolicyType_HOE as PolicyType
  var _typeOfPolicyForMultiLine : TypeofPolicy_Ext as TypeOfPolicyForMultiLine
  var _territoryCode : String as TerritoryCode
  var _territoryCodeInt : int as TerritoryCodeInt
  var _numOfUnitsWithinFireDivision : int as NumOfUnitsWithinFireDivision
  var _protectionClassCode: String as ProtectionClassCode
  var _bcegGrade : int as BCEGGrade
  var _protectionDetails : String as ProtectionDetails

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    _line = line
    _totalBasePremium = totalBasePremium
    _coverageALimit = line.Dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value
    _personalPropertyLimit = line.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
    _allPerilDeductible = line.Dwelling?.AllPerilsOrAllOtherPerilsCovTerm?.Value
    _maxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState)
    _policyType = line.HOPolicyType
    _protectionClassCode = line.Dwelling?.HOLocation?.OverrideDwellingPCCode_Ext? line.Dwelling?.HOLocation?.DwellingPCCodeOverridden_Ext : line.Dwelling?.HOLocation?.DwellingProtectionClassCode
    _territoryCode = line.Dwelling?.HOLocation?.OverrideTerritoryCode_Ext?  line.Dwelling?.HOLocation?.TerritoryCodeOverridden_Ext : line.Dwelling?.HOLocation?.TerritoryCodeTunaReturned_Ext
    if((_territoryCode != null or _territoryCode != "") and _territoryCode?.Numeric){
      _territoryCodeInt = _territoryCode?.toInt()
    }
    _bcegGrade = line.Dwelling?.HOLocation?.OverrideBCEG_Ext? line?.Dwelling?.HOLocation?.BCEGOverridden_Ext?.Code?.toInt() : line?.Dwelling?.HOLocation?.BCEG_Ext?.Code?.toInt()
    var dwelling = line?.Dwelling
    var state = line?.BaseState
    _protectionDetails = HOProtectionDetailsMapper.getProtectionDetails(dwelling, state)
  }

  property get AgeOfHome() : int {
    return  this.Line.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate -  YearForAgeOfHomeCalc
  }

   property get YearForAgeOfHomeCalc() : int{
    return Line.Dwelling.OverrideYearbuilt_Ext? Line.Dwelling.YearBuiltOverridden_Ext : Line.Dwelling.YearBuilt
  }

}