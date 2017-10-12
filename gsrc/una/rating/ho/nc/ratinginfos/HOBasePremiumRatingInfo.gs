package una.rating.ho.nc.ratinginfos

uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 */
class HOBasePremiumRatingInfo extends HOCommonBasePremiumRatingInfo{
  var _windHailExclusion: boolean as WindHailExclusion = false
  var _secondaryOccupancyCredit : boolean as SecondaryOccupancyCredit = false
  var _ordinanceOrLawValue : BigDecimal as OrdinanceOrLaw = 0.0
  var _deductibleFactor : boolean as DeductibleFactor = false
  var _acvLossSettlementWindstormHail : boolean as ACVLossSettlementWindstormHail = false
  var _increasedPersonalProperty : boolean as IncreasedPersonalProperty = false
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
  var _acvLossSettlement : boolean as ACVLossSettlement
  var _dwellingRatingInfo : HONCDwellingRatingInfo as DwellingRatingInfo
  var _dwellingFireLimit : int as DwellingFireLimit
  var _dwellingFireValuationMethod : ValuationMethod as DwellingFireValuationMethod
  var _aopDeductible : int as AOPDeductible
  var _hurricanePercentage : BigDecimal as HurricanePercentage
  var _windOrHailPercentage : int as WindOrHailPercentage
  var _roofType : String as RoofType
  var _numOfTimesRenewed : int as NumOfTimesRenewed
  var _numOfLosses : int as NumOfLosses
  var _affinityDiscountAgeOfHome : int as AffinityDiscountAgeOfHome
  var _paidWeather : int as PaidWeather
  var _paidNonWeather : int as PaidNonWeather


  construct(dwelling: Dwelling_HOE) {
    super(dwelling)
    _dwelling = dwelling
    _windHailExclusion = dwelling.HOLine.HODW_AbsoluteWindHailExc_HOE_ExtExists
    _yearOfConstruction = dwelling.OverrideYearbuilt_Ext? dwelling.YearBuiltOverridden_Ext : dwelling.YearBuilt
    _affinityDiscount =  dwelling.PolicyLine.Branch.QualifiesAffinityDisc_Ext

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
    _acvLossSettlement = _dwelling.HOLine.HOLI_ActualCashValueLossSettlement_ExtExists
    _acvLossSettlementWindstormHail = dwelling?.HOLine?.HODW_CashSettlementWindOrHailRoofSurfacing_HOEExists
    if(dwelling.HODW_Personal_Property_HOEExists){
      _increasedPersonalProperty = dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference > 0
      if(_increasedPersonalProperty){
        _increasedPersonalPropertyValue = dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference
      }
    }

    if(dwelling.PaidWeatherClaims_Ext !=null){
      PaidWeather = dwelling.PaidWeatherClaims_Ext
    }

    if(dwelling.PaidNonWeatherClaims_Ext !=null){
      PaidNonWeather = dwelling.PaidNonWeatherClaims_Ext
    }

    _ordinanceOrLawValue = dwelling?.HODW_OrdinanceCov_HOE.HODW_OrdinanceLimit_HOETerm?.Value
    _affinityDiscount = dwelling.HOLine.Branch.QualifiesAffinityDisc_Ext
    _affinityDiscountAgeOfHome = ConfigParamsUtil.getInt(TC_AffinityDiscountAgeOfHome, dwelling.HOLine.BaseState, dwelling.HOPolicyType)

    if (dwelling.HOLine.Branch?.CreditInfoExt?.CreditReport?.CreditScore != null) {
      _insuranceScore = dwelling.HOLine.Branch?.CreditInfoExt?.CreditReport?.CreditScore as int
    } else if (dwelling.HOLine.Branch?.CreditInfoExt?.CreditLevel != null){
      _insuranceScore = dwelling.HOLine.Branch.CreditInfoExt.CreditLevel.Description.toInt()
    }
    if (dwelling.HOLine.Branch?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_HIT or
        dwelling.HOLine.Branch?.CreditInfoExt?.CreditReport?.CreditStatus == typekey.CreditStatusExt.TC_NO_SCORE){
      _insuranceScore = 0
    }

    if(dwelling.FirstTimeDeededHome_Ext){
      _insuranceScore = ConfigParamsUtil.getInt(TC_DEFAULTCREDITSCORE, dwelling.HOLine.BaseState)
    }

    _consentToRate = Dwelling.Branch.ConsentToRate_Ext
    _maxAgeOfHomeLimit = ConfigParamsUtil.getInt(TC_AgeOfHomeGreaterLimit, _dwelling.HOLine.BaseState)

    if(dwelling?.DPDW_Dwelling_Cov_HOEExists){
      _dwellingFireLimit = dwelling.DPDW_Dwelling_Cov_HOE?.DPDW_Dwelling_Limit_HOETerm?.Value?.intValue()
      _dwellingFireValuationMethod = dwelling?.DPDW_Dwelling_Cov_HOE?.DPDW_ValuationMethod_HOE_ExtTerm?.Value
    }

    if(dwelling?.HODW_SectionI_Ded_HOEExists){
      _aopDeductible = dwelling?.HODW_SectionI_Ded_HOE?.HODW_OtherPerils_Ded_HOETerm?.Value?.intValue()
      _hurricanePercentage = dwelling?.HODW_SectionI_Ded_HOE?.HODW_Hurricane_Ded_HOETerm?.Value
      _windOrHailPercentage = dwelling?.HODW_SectionI_Ded_HOE?.HODW_WindHail_Ded_HOETerm?.Value?.intValue()
    }
    _roofType = dwelling?.RoofTypeOrOverride?.Description

    //TODO : Need to update the num of times renewed logic
    var termNumber = dwelling?.HOLine?.Branch?.LatestPeriod.TermNumber
    if(termNumber == null || termNumber == 0)
      _numOfTimesRenewed = 0
    else
      _numOfTimesRenewed = (termNumber - 1)
    _numOfLosses = dwelling?.HOLine?.HOPriorLosses_Ext?.Count
  }

  property get AgeOfHome() : int {
    return  this.Dwelling.PolicyPeriod?.EditEffectiveDate.YearOfDate - _yearOfConstruction
  }

  property get NoPriorInsurance() : boolean {
    var priorPoliciesWithNoPriorInsurance = _dwelling?.Branch?.Policy?.PriorPolicies?.where( \ pp -> pp.CarrierType == CarrierType_Ext.TC_NOPRIORINS)
    if(priorPoliciesWithNoPriorInsurance.Count > 0){
      for(priorPolicy in priorPoliciesWithNoPriorInsurance){
        if(priorPolicy.ReasonNoPriorIns_Ext == ReasonNoPriorIns_Ext.TC_PRIORCOVERAGELAPSEDOVER45DAYS ||
            priorPolicy.ReasonNoPriorIns_Ext == ReasonNoPriorIns_Ext.TC_PRIORCOVERAGELAPSEDOVER60DAYS ||
            priorPolicy.ReasonNoPriorIns_Ext == ReasonNoPriorIns_Ext.TC_NOINSURANCEEVERCARRIEDATTHISPROPERTY)
          return true
      }
    }
    return false
  }





}