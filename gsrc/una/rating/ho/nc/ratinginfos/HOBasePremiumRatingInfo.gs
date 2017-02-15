package una.rating.ho.nc.ratinginfos

uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HOBasePremiumRatingInfo extends HOCommonBasePremiumRatingInfo{
  var _windHailExclusion: boolean as WindHailExclusion = false
  var _secondaryOccupancyCredit : boolean as SecondaryOccupancyCredit = false
  var _ordinanceOrLawValue : BigDecimal as OrdinanceOrLaw = 0.0
  var _deductibleFactor : boolean as DeductibleFactor = false
  var _acvSettlement : boolean as ACVSettlement = false
  var _acvLossSettlementWindstormHail : boolean as ACVLossSettlementWindstormHail = false
  var _increasedPersonalProperty : boolean as IncreasedPersonalProperty = false
  var _townHouseOrRowHouse : boolean as TownHouseOrRowHouse = false
  var _personalPropertyReplacementCost : boolean as PersonalPropertyReplacementCost
  var _protectiveDevices : boolean as ProtectiveDevices = false
  var _specifiedAdditionalAmountCovA : boolean as SpecifiedAdditionalAmountCovA = false
  var _increasedLiability : BigDecimal as IncreasedLiability
  var _increasedMedicalPayments : BigDecimal as IncreasedMedicalPayments
  var _superiorConstruction : boolean as SuperiorConstruction = false
  var _dwelling : Dwelling_HOE as Dwelling
  var _yearOfConstruction : int as YearOfConstruction
  var _specifiedAdditionalAmount : String as SpecifiedAdditionalAmount
  var _increasedPersonalPropertyValue : BigDecimal as IncreasedPersonalPropertyValue = 0
  var _affinityDiscount : boolean as AffinityDiscount
  var _insuranceScore : int as InsuranceScore
  var _consentToRate: boolean as ConsentToRate
  var _maxAgeOfHomeLimit : int as MaxAgeOfHomeLimit
  construct(dwelling: Dwelling_HOE) {
    super(dwelling)
    _dwelling = dwelling
    _windHailExclusion = dwelling.HOLine.HODW_AbsoluteWindHailExc_HOE_ExtExists
    _yearOfConstruction = dwelling.OverrideYearbuilt_Ext? dwelling.YearBuiltOverridden_Ext : dwelling.YearBuilt

    _increasedLiability = (dwelling.HOLine.HOLI_Personal_Liability_HOEExists)? dwelling.HOLine.HOLI_Personal_Liability_HOE.HOLI_Liability_Limit_HOETerm?.Value : 0
    _increasedMedicalPayments = (dwelling.HOLine.HOLI_Med_Pay_HOEExists) ? dwelling.HOLine.HOLI_Med_Pay_HOE.HOLI_MedPay_Limit_HOETerm?.Value : 0
    _personalPropertyReplacementCost = dwelling?.HODW_Personal_Property_HOE?.HODW_PropertyValuation_HOE_ExtTerm.Value == TC_PersProp_ReplCost
    var constructionType = dwelling.OverrideConstructionType_Ext? dwelling.ConstTypeOverridden_Ext : dwelling.ConstructionType
    _superiorConstruction =   constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT
    _specifiedAdditionalAmountCovA = dwelling?.HODW_SpecificAddAmt_HOE_ExtExists

    if(dwelling?.HODW_SpecificAddAmt_HOE_ExtExists){
      if(dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HasHODW_AdditionalAmtInsurance_HOETerm){
        _specifiedAdditionalAmount = dwelling?.HODW_SpecificAddAmt_HOE_Ext?.HODW_AdditionalAmtInsurance_HOETerm?.DisplayValue
      }
    }

    _acvSettlement = dwelling?.HODW_LossSettlementWindstorm_HOE_ExtExists
    if(dwelling.HODW_Personal_Property_HOEExists){
      _increasedPersonalProperty = dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference > 0
      if(_increasedPersonalProperty){
        _increasedPersonalPropertyValue = dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference
      }
    }

    _ordinanceOrLawValue = dwelling?.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm?.Value
    _affinityDiscount = dwelling.HOLine.Branch.QualifiesAffinityDisc_Ext

    if (dwelling.HOLine.Branch?.CreditInfoExt?.CreditReport?.CreditScore != null) {
      _insuranceScore = dwelling.HOLine.Branch?.CreditInfoExt?.CreditReport?.CreditScore as int
    } else if (dwelling.HOLine.Branch?.CreditInfoExt?.CreditLevel != null){
      _insuranceScore = dwelling.HOLine.Branch.CreditInfoExt.CreditLevel.Description.toInt()
    }

    _consentToRate = Dwelling.Branch.ConsentToRate_Ext
    _maxAgeOfHomeLimit = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, _dwelling.HOLine.BaseState)

  }

  property get AgeOfHome() : int {
    return  this.Dwelling.PolicyPeriod?.EditEffectiveDate.YearOfDate - _yearOfConstruction
  }
}