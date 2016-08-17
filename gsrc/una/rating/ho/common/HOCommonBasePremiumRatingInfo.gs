package una.rating.ho.common

uses java.math.BigDecimal
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/17/16
 * Time: 2:34 PM
 */
class HOCommonBasePremiumRatingInfo {

  var _territoryCode: String as TerritoryCode
  var _dwellingLimit: int as DwellingLimit
  var _policyType: String as PolicyType
  var _consecutiveYrsWithUniversal: int as ConsecutiveYrsWithUniversal
  var _creditScore: int as CreditScore
  var _priorLosses: int as PriorLosses
  var _noHitOrScoreIndicator: Boolean as NoHitOrScoreIndicator

  construct(dwelling: Dwelling_HOE) {
    _territoryCode = (dwelling?.HOLocation?.PolicyLocation?.TerritoryCodes.first().Code)
    if (dwelling.Branch.BaseState == typekey.Jurisdiction.TC_AZ)
      _territoryCode = 40
    else if (dwelling.Branch.BaseState == typekey.Jurisdiction.TC_CA)
      _territoryCode = 7
    else if (dwelling.Branch.BaseState == typekey.Jurisdiction.TC_NV)
        _territoryCode = 30

    _policyType = dwelling?.HOLine.HOPolicyType.Code
    if (dwelling.HODW_Dwelling_Cov_HOEExists){
      _dwellingLimit = dwelling?.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value
    }
    var policyPeriod = dwelling?.PolicyPeriod
    var originalEffectiveDate = policyPeriod?.Policy.OriginalEffectiveDate
    var editEffectiveDate = policyPeriod?.EditEffectiveDate
    _consecutiveYrsWithUniversal = getDiffYears(originalEffectiveDate, editEffectiveDate)

    _priorLosses = 0
    if (policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_ATT) {
      _priorLosses = policyPeriod?.Policy?.NumPriorLosses
    } else if (policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_MAN){
      _priorLosses = policyPeriod?.Policy?.PriorLosses.Count
    }

    _creditScore = 0
    if(policyPeriod?.CreditInfoExt?.CreditReport?.CreditScore != null){
      _creditScore = policyPeriod?.CreditInfoExt?.CreditReport?.CreditScore as int
    } else if(policyPeriod?.CreditInfoExt?.CreditLevel != null){
      _creditScore = policyPeriod.CreditInfoExt.CreditLevel.Description.toInt()
    }
    _noHitOrScoreIndicator = false
    if (policyPeriod?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_HIT or
        policyPeriod?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_SCORE){
      _noHitOrScoreIndicator = true
    }
  }

  private function getDiffYears(originalEffectiveDate: Date, editEffectiveDate: Date): int {
    if (originalEffectiveDate == null || editEffectiveDate == null){
      return 0
    }
    var time = (editEffectiveDate.Time - originalEffectiveDate.Time)
    if (time <= 0)
      return 0
    else {
      var diffInDays = (time / (1000 * 60 * 60 * 24))
      return (diffInDays / 365) as int
    }
  }
}