package una.rating.ho.group1.ratinginfos

uses java.math.BigDecimal
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/10/16
 * Time: 10:52 AM
 */
class HOBasePremiumRatingInfo {

  var _territoryCode : String as TerritoryCode
  var _protectionClassCode : String as ProtectionClassCode
  var _policyType : String as PolicyType
  var _dwellingLimit : BigDecimal as DwellingLimit

  var _consecutiveYrsWithUniversal : int as ConsecutiveYrsWithUniversal
  var _creditScore : int as CreditScore
  var _priorLosses : int as PriorLosses
  var _noHitOrScoreIndicator : Boolean as NoHitOrScoreIndicator

  var _constructionType : String as ConstructionType

  construct(dwelling : Dwelling_HOE){
    _territoryCode = (dwelling?.HOLocation?.PolicyLocation?.TerritoryCodes.first().Code)
    if(dwelling.Branch.BaseState == typekey.Jurisdiction.TC_AZ)
      _territoryCode = 40
    else if(dwelling.Branch.BaseState == typekey.Jurisdiction.TC_CA)
      _territoryCode = 7
    else if(dwelling.Branch.BaseState == typekey.Jurisdiction.TC_NV)
      _territoryCode = 30

    _protectionClassCode = dwelling?.HOLocation?.DwellingProtectionClassCode
    _policyType = dwelling?.HOPolicyType.Code
    if(dwelling.HODW_Dwelling_Cov_HOEExists){
      _dwellingLimit = dwelling?.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm?.Value
    }
    var policyPeriod = dwelling?.PolicyPeriod
    var originalEffectiveDate = policyPeriod?.Policy.OriginalEffectiveDate
    var editEffectiveDate = policyPeriod?.EditEffectiveDate
    _consecutiveYrsWithUniversal = getDiffYears(originalEffectiveDate, editEffectiveDate)

    _priorLosses = 0
    if(policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_ATT){
      _priorLosses = policyPeriod?.Policy?.NumPriorLosses
    } else if(policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_MAN){
      _priorLosses = policyPeriod?.Policy?.PriorLosses.Count
    }

    //should update the credit score once the integration is done
    _creditScore = 722
    _noHitOrScoreIndicator = false
    _constructionType = dwelling?.ConstructionType.DisplayName
  }

  private function getDiffYears(originalEffectiveDate: Date, editEffectiveDate : Date) : int{
    if(originalEffectiveDate == null || editEffectiveDate == null){
      return 0
    }
    var time = (editEffectiveDate.Time - originalEffectiveDate.Time)
    if(time <= 0)
      return 0
    else{
      var diffInDays =  (time/(1000*60*60*24))
      return (diffInDays/365) as int
    }
  }
}