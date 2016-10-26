package una.rating.ho.common

uses una.config.ConfigParamsUtil
uses una.rating.util.HOConstructionTypeMapper

uses java.math.BigDecimal
uses java.util.Date
uses gw.api.util.DateUtil

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/17/16
 * Time: 2:34 PM
 */
class HOCommonBasePremiumRatingInfo {
  var _territoryCode: String as TerritoryCode
  var _dwellingLimit: int as DwellingLimit
  var _personalPropertyLimit: int as PersonalPropertyLimit
  var _policyType: String as PolicyType
  var _consecutiveYrsWithUniversal: int as ConsecutiveYrsWithUniversal
  var _creditScore: int as CreditScore = 0
  var _priorLosses: int as PriorLosses = 0
  var _noHitOrScoreIndicator: Boolean as NoHitOrScoreIndicator = false
  var _protectionClassCode: String as ProtectionClassCode
  var _constructionType: RateTableConstructionType_Ext as ConstructionType
  var _keyFactorGreaterLimit: int as KeyFactorGreaterLimit
  var _keyFactorLowerBound: BigDecimal as KeyFactorLowerBound
  var _keyFactorUpperBound: BigDecimal as KeyFactorUpperBound
  construct(dwelling: Dwelling_HOE) {
    _territoryCode = (dwelling?.HOLocation?.PolicyLocation?.TerritoryCodes.first().Code)
    //TODO: remove this code once the tuna integration is in place
    if (dwelling.Branch.BaseState == typekey.Jurisdiction.TC_AZ)
      _territoryCode = 40
    else if (dwelling.Branch.BaseState == typekey.Jurisdiction.TC_CA)
      _territoryCode = 7
    else if (dwelling.Branch.BaseState == typekey.Jurisdiction.TC_NV or dwelling.Branch.BaseState == TC_SC)
        _territoryCode = 30

    _policyType = dwelling?.HOLine.HOPolicyType.Code
    if (dwelling.HODW_Dwelling_Cov_HOEExists){
      _dwellingLimit = dwelling?.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value as int
    }

    if (dwelling.HODW_Personal_Property_HOEExists){
      _personalPropertyLimit = dwelling?.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm?.Value as int
    }

    var policyPeriod = dwelling?.PolicyPeriod
    var originalEffectiveDate = policyPeriod?.Policy.OriginalEffectiveDate
    var editEffectiveDate = policyPeriod?.EditEffectiveDate
    _consecutiveYrsWithUniversal = getDiffYears(originalEffectiveDate, editEffectiveDate)

    if (policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_ATT) {
      _priorLosses = policyPeriod?.Policy?.NumPriorLosses
    } else if (policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_MAN){
      _priorLosses = policyPeriod?.Policy?.PriorLosses.Count
    }

    if (policyPeriod?.CreditInfoExt?.CreditReport?.CreditScore != null) {
      _creditScore = policyPeriod?.CreditInfoExt?.CreditReport?.CreditScore as int
    } else if (policyPeriod?.CreditInfoExt?.CreditLevel != null){
      _creditScore = policyPeriod.CreditInfoExt.CreditLevel.Description.toInt()
    }

    if (policyPeriod?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_HIT or
        policyPeriod?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_SCORE){
      _noHitOrScoreIndicator = true
    }
    _protectionClassCode = dwelling?.HOLocation?.DwellingProtectionClassCode

    _constructionType = HOConstructionTypeMapper.setConstructionType(dwelling.ConstructionType, dwelling.ExteriorWallFinish_Ext, dwelling.HOLine.BaseState)

    _keyFactorGreaterLimit = ConfigParamsUtil.getInt(TC_KEYFACTORGREATERLIMIT, dwelling.CoverableState, dwelling.HOLine.HOPolicyType.Code)
    var keyFactorRange = ConfigParamsUtil.getRange(TC_KEYFACTORRANGE, dwelling.CoverableState, dwelling.HOLine.HOPolicyType.Code)
    _keyFactorLowerBound = keyFactorRange.LowerBound
    _keyFactorUpperBound = keyFactorRange.UpperBound
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