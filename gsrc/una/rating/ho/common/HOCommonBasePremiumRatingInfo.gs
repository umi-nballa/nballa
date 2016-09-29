package una.rating.ho.common

uses java.math.BigDecimal
uses java.util.Date
uses una.rating.util.HOConstructionTypeMapper

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
  var _creditScore: int as CreditScore = 0
  var _priorLosses: int as PriorLosses = 0
  var _noHitOrScoreIndicator: Boolean as NoHitOrScoreIndicator = false
  var _protectionClassCode : String as ProtectionClassCode
  var _constructionType : String as ConstructionType


  construct(dwelling: Dwelling_HOE) {
    _territoryCode = (dwelling?.HOLocation?.PolicyLocation?.TerritoryCodes.first().Code)
    //remove this code once the tuna integration is in place
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

    if (policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_ATT) {
      _priorLosses = policyPeriod?.Policy?.NumPriorLosses
    } else if (policyPeriod?.Policy?.LossHistoryType == typekey.LossHistoryType.TC_MAN){
      _priorLosses = policyPeriod?.Policy?.PriorLosses.Count
    }

    if(policyPeriod?.CreditInfoExt?.CreditReport?.CreditScore != null){
      _creditScore = policyPeriod?.CreditInfoExt?.CreditReport?.CreditScore as int
    } else if(policyPeriod?.CreditInfoExt?.CreditLevel != null){
      _creditScore = policyPeriod.CreditInfoExt.CreditLevel.Description.toInt()
    }

    if (policyPeriod?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_HIT or
        policyPeriod?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_SCORE){
      _noHitOrScoreIndicator = true
    }
    _protectionClassCode = dwelling?.HOLocation?.DwellingProtectionClassCode
    _constructionType = ConstructionType_HOE.TC_FRAME_EXT.Description
    if(dwelling.HOLine.BaseState == typekey.Jurisdiction.TC_NV){
      _constructionType= HOConstructionTypeMapper.constructionTypeMapperNV(dwelling.ConstructionType).Description
    }
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