package una.rating.ho.tx.ratinginfos

uses java.math.BigDecimal
uses una.rating.util.HOConstructionTypeMapper

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 */
class HODPBasePremiumRatingInfo {

  var _dwellingFireLimit : BigDecimal  as DwellingFireLimit
  var _dwellingFireOtherStructuresLimit : BigDecimal as DwellingFireOtherStructures
  var _dwellingFirePersonalProperty : BigDecimal as DwellingFirePersonalProperty
  var _ordinanceOrLawLimit : String as OrdinanceOrLawLimit
  var _increasedOrdinanceOrLawLimit : boolean as IncreasedOrdinanceOrLawLimit
  var _tenantOccupied : boolean as TenantOccupied
  var _windPool : boolean as WindPool
  var _territoryCode : String as TerritoryCode
  var _tier : String as Tier
  var _protectionClassCode: String as ProtectionClassCode
  var _aopDeductible : String as AOPDeductible
  var _constructionType: RateTableConstructionType_Ext as ConstructionType
  var _dwellingConstructionType : ConstructionType_HOE as DwellingConstructionType
  var _isHailRoofResistantCreditApplicable : boolean as IsHailRoofResistantCreditApplicable
  var _windHailExclusion : boolean as WindHailExclusion
  var _policyType : HOPolicyType_HOE as PolicyType
  var _dwellingUsage : DwellingUsage_HOE as DwellingUsage
  private var _dwelling : Dwelling_HOE

  construct(dwelling: Dwelling_HOE) {
    _dwelling = dwelling
    _dwellingFireLimit = dwelling?.DPDW_Dwelling_Cov_HOE?.DPDW_Dwelling_Limit_HOETerm?.Value
    _dwellingFireOtherStructuresLimit = dwelling?.DPDW_Other_Structures_HOE?.DPDW_OtherStructuresLimit_HOETerm?.Value
    _dwellingFirePersonalProperty = dwelling?.DPDW_Personal_Property_HOE?.DPDW_PersonalPropertyLimit_HOETerm?.Value
    _ordinanceOrLawLimit = dwelling?.DPDW_OrdinanceCovTX_HOE_Ext?.DPDW_OrdinanceCovTXLimit_HOETerm?.DisplayValue
    _increasedOrdinanceOrLawLimit = (_ordinanceOrLawLimit != "5,000")
    _tenantOccupied = (dwelling?.Occupancy == DwellingOccupancyType_HOE.TC_NONOWN)
    _territoryCode = dwelling?.HOLocation?.OverrideTerritoryCode_Ext? (dwelling?.HOLocation?.TerritoryCodeOverridden_Ext) : (dwelling?.HOLocation?.TerritoryCodeTunaReturned_Ext)
    _protectionClassCode = dwelling?.HOLocation?.OverrideDwellingPCCode_Ext? dwelling?.HOLocation?.DwellingPCCodeOverridden_Ext.Code : dwelling?.HOLocation?.DwellingProtectionClasscode?.toString()
    _aopDeductible = dwelling?.HODW_SectionI_Ded_HOE?.HODW_OtherPerils_Ded_HOETerm?.DisplayValue
    _constructionType = HOConstructionTypeMapper.setConstructionType(dwelling, dwelling.HOLine.BaseState)
    _dwellingConstructionType = dwelling.OverrideConstructionType_Ext? dwelling.ConstTypeOverridden_Ext : dwelling.ConstructionType
    _isHailRoofResistantCreditApplicable = dwelling.HailResistantRoofCredit_Ext
    _windHailExclusion = dwelling.WHurricaneHailExclusion_Ext
    _policyType = dwelling.HOLine?.HOPolicyType
    _dwellingUsage = dwelling?.DwellingUsage
    _windPool = dwelling.HOLocation.OverrideWindPool_Ext? dwelling.HOLocation.WindPoolOverridden_Ext : dwelling.HOLocation.WindPool_Ext
    //TODO : need  to update the tier for TX state
    _tier = "Select"
  }

  property get AgeOfHome() : int {
    return  _dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate -  YearForAgeOfHomeCalc
  }

  property get YearForAgeOfHomeCalc() : int{
    return _dwelling.OverrideYearbuilt_Ext? _dwelling.YearBuiltOverridden_Ext : _dwelling.YearBuilt
  }
}