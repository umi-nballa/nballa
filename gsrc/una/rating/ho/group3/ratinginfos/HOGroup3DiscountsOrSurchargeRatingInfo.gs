package una.rating.ho.group3.ratinginfos

uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil
uses una.rating.util.HOProtectionDetailsMapper
uses una.rating.util.HOConstructionTypeMapper

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Rating info for the discounts and surcharges for the group3 states
 */
class HOGroup3DiscountsOrSurchargeRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo {

  var _yearOfConstructionMaxLimit : int as YearOfConstructionMaxLimit
  var _yearOfConstructionMinLimit : int as YearOfConstructionMinLimit
  var _yearOfConstruction : int as YearOfConstruction
  var _windOrHailExcluded : boolean as WindOrHailExcluded
  var _coverageLimitForDeductible : BigDecimal as CoverageLimitForDeductible = 0
  var _aopDeductibleLimit : BigDecimal as AOPDeductibleLimit
  var _hurricanePercentage : String as HurricanePercentage
  var _bcegGrade : int as BCEGGrade
  var _constructionType: RateTableConstructionType_Ext as ConstructionType
  var _dwellingConstructionType : ConstructionType_HOE as DwellingConstructionType
  var _windMitigation : Boolean as WindMitigation
  var _consecutiveYrsWithUniversal: int as ConsecutiveYrsWithUniversal
  var _creditScore: int as CreditScore = 0
  var _priorLosses: int as PriorLosses = 0
  var _noHitOrScoreIndicator: Boolean as NoHitOrScoreIndicator = false
  var _sectionbECDwellingAdjustmentFactor : BigDecimal as SectionbECDwellingAdjustmentFactor = 0.00
  var _sectionbECPersonalPropertyAdjustmentFactor : BigDecimal as SectionbECPersonalPropertyAdjustmentFactor = 0.00

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    super(line, totalBasePremium)
    MaxAgeOfHome = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, line.BaseState, line.HOPolicyType.Code)

    _bcegGrade = line.Dwelling?.HOLocation?.OverrideBCEG_Ext? line.Dwelling?.HOLocation?.BCEGOverridden_Ext?.Code?.toInt() : line.Dwelling.HOLocation?.BCEG_Ext?.Code?.toInt()

    _yearOfConstructionMaxLimit = ConfigParamsUtil.getInt(TC_YearOfConstructionMaxLimit, line.BaseState, line.HOPolicyType.Code)
    _yearOfConstructionMinLimit = ConfigParamsUtil.getInt(TC_YearOfConstructionMinLimit, line.BaseState, line.HOPolicyType.Code)
    _yearOfConstruction = Line.Dwelling.OverrideYearbuilt_Ext? Line.Dwelling.YearBuiltOverridden_Ext : Line.Dwelling.YearBuilt
    _windOrHailExcluded = line.Dwelling.HOLine.HODW_WindstromHailExc_HOE_ExtExists

    if(PolicyType == typekey.HOPolicyType_HOE.TC_HO3)
      _coverageLimitForDeductible = line.Dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value
    else if(PolicyType == typekey.HOPolicyType_HOE.TC_HO4 || PolicyType == typekey.HOPolicyType_HOE.TC_HO6)
      _coverageLimitForDeductible = line.Dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value

    if(line.Dwelling.HODW_SectionI_Ded_HOEExists){
      _aopDeductibleLimit = line.Dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm?.Value
      _hurricanePercentage = line.Dwelling.HODW_SectionI_Ded_HOE.HODW_Hurricane_Ded_HOETerm?.Value as String
    }

    _constructionType = HOConstructionTypeMapper.setConstructionType(line.Dwelling, line.Dwelling.HOLine.BaseState)
    _dwellingConstructionType = line.Dwelling.ConstructionType
    _windMitigation = line.Dwelling.WindMitigation_Ext

    if (line.Branch?.CreditInfoExt?.CreditReport?.CreditScore != null) {
      _creditScore = line.Branch?.CreditInfoExt?.CreditReport?.CreditScore as int
    } else if (line.Branch?.CreditInfoExt?.CreditLevel != null){
      _creditScore = line.Branch?.CreditInfoExt.CreditLevel.Description.toInt()
    }

    if (line.Branch?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_HIT or
        line.Branch?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_SCORE){
      _noHitOrScoreIndicator = true
    }

    _consecutiveYrsWithUniversal = line?.Branch?.Policy?.OriginalEffectiveDate?.differenceInYears(line.Branch.EditEffectiveDate)
    _priorLosses = line.HOPriorLosses_Ext?.Count


  }


}