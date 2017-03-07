package una.rating.ho.group2.ratinginfos

uses una.rating.ho.common.HOCommonDiscountsOrSurchargeRatingInfo
uses java.math.BigDecimal
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * Rating info for the discounts and surcharges for the group2 states
 */
class HOGroup2DiscountsOrSurchargeRatingInfo extends HOCommonDiscountsOrSurchargeRatingInfo {

  var _namedStormDeductible : BigDecimal as NamedStormDeductible
  var _personalPropertyLimit : BigDecimal as PersonalPropertyLimit
  var _increasedPersonalPropertyLimit : BigDecimal as IncreasedPersonalPropertyLimit
  var _preferredBuilderExists : boolean as PreferredBuilderExists
  var _preferredFinancialInstitutionExists : boolean as PreferredFinancialInstitutionExists
  var _consecutiveYrsWithUniversal: int as ConsecutiveYrsWithUniversal
  var _priorLosses : int as PriorLosses = 0

  //windstorm mitigation credit
  var _roofShape : String as RoofShape
  var _swr : String as SWR
  var _roofCover : String as RoofCover
  var _roofDeckAttachment : String as RoofDeckAttachment
  var _roofToWallConnection : String as RoofToWallConnection
  var _openingProtection : String as OpeningProtection
  var _doorStrength : String as DoorStrength

  construct(line: HomeownersLine_HOE, totalBasePremium: BigDecimal) {
    super(line, totalBasePremium)
    var dwelling = line?.Dwelling
    if(dwelling.HODW_SectionI_Ded_HOE.HasHODW_NamedStrom_Ded_HOE_ExtTerm){
      _namedStormDeductible = dwelling.HODW_SectionI_Ded_HOE.HODW_NamedStrom_Ded_HOE_ExtTerm.Value
    }
    _personalPropertyLimit = dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value
    _increasedPersonalPropertyLimit = dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference  > 0 ? line.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.LimitDifference : 0

    
      if(line.Branch.PreferredBuilder_Ext != null)
        _preferredBuilderExists = true
      if(line.Branch.PreferredFinInst_Ext != null)
        _preferredFinancialInstitutionExists = true

    var policyPeriod = dwelling?.PolicyPeriod
    var originalEffectiveDate = policyPeriod?.Policy.OriginalEffectiveDate
    var editEffectiveDate = policyPeriod?.EditEffectiveDate
    _consecutiveYrsWithUniversal = getDiffYears(originalEffectiveDate, editEffectiveDate)

    if(line?.HOPriorLosses_Ext != null){
      _priorLosses = line?.HOPriorLosses_Ext?.where( \ elt -> elt.ChargeableClaim == typekey.Chargeable_Ext.TC_YES).length
    }

    if(!dwelling.WHurricaneHailExclusion_Ext){
      _swr = dwelling?.SecondaryWaterResis_Ext?.DisplayName
      _roofDeckAttachment = dwelling?.RoofDeckAttachment_Ext?.DisplayName
      _roofToWallConnection = dwelling?.RoofWallConnection_Ext?.DisplayName
      _roofCover = dwelling?.RoofCover_Ext?.DisplayName
      _openingProtection = dwelling?.OpeningProtection_Ext?.DisplayName
      _doorStrength = dwelling?.DoorStrength_Ext?.DisplayName
      if(dwelling?.RoofShape_Ext != RoofShape_Ext.TC_HIP)
        _roofShape = "Other"
      else
        _roofShape = dwelling?.RoofShape_Ext?.DisplayName
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