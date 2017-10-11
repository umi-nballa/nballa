package una.rating.ho.common

uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses una.rating.util.HOProtectionDetailsMapper
uses java.util.Date


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
  var _consecutiveYrsWithUniversal: int as ConsecutiveYrsWithUniversal
  var _priorLosses : int as PriorLosses = 0
  var _state : String as State


  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    _line = line
    _totalBasePremium = totalBasePremium
    _coverageALimit = line.Dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value
    _personalPropertyLimit = line.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value
    _allPerilDeductible = line.Dwelling?.AllPerilsOrAllOtherPerilsCovTerm?.Value
    _policyType = line.HOPolicyType
    _state = line.BaseState
    _protectionClassCode = line.Dwelling?.ProtectionClassCodeOrOverride
    _territoryCode = line.Dwelling?.TerritoryCodeOrOverride
    if((_territoryCode != null or _territoryCode != "") and _territoryCode?.Numeric){
      _territoryCodeInt = _territoryCode?.toInt()
    }
    _bcegGrade = line.Dwelling?.HOLocation?.OverrideBCEG_Ext? line?.Dwelling?.HOLocation?.BCEGOverridden_Ext?.Code?.toInt() : line?.Dwelling?.HOLocation?.BCEG_Ext?.Code?.toInt()
    var dwelling = line?.Dwelling
    var state = line?.BaseState
    _protectionDetails = HOProtectionDetailsMapper.getProtectionDetails(dwelling, state)


    if(dwelling.PolicyPeriod.BaseState == TC_FL || dwelling.PolicyPeriod.BaseState == TC_SC
      || dwelling.PolicyPeriod.BaseState == TC_TX )
      if(dwelling?.PaidNonWeatherClaims_Ext !=null) {
         _priorLosses = dwelling?.PaidNonWeatherClaims_Ext?.toInt()
      }



    var policyPeriod = line?.Dwelling?.PolicyPeriod
    var originalEffectiveDate = policyPeriod?.Policy.OriginalEffectiveDate
    var editEffectiveDate = policyPeriod?.EditEffectiveDate
    _consecutiveYrsWithUniversal = getDiffYears(originalEffectiveDate, editEffectiveDate)

    if(_policyType == typekey.HOPolicyType_HOE.TC_DP3_EXT){
      _maxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState, _policyType)
    } else{
      _maxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState)

    }



  }

  property get AgeOfHome() : int {
    return  this.Line.Dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate -  YearForAgeOfHomeCalc
  }

   property get YearForAgeOfHomeCalc() : int{
    return Line.Dwelling.OverrideYearbuilt_Ext? Line.Dwelling.YearBuiltOverridden_Ext : Line.Dwelling.YearBuilt
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