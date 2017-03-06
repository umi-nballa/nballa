package una.rating.ho.group3.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * rating info for the dwelling level coverages for group 3 states
 */
class HOGroup3DwellingRatingInfo extends HOCommonDwellingRatingInfo{

  var _lossAssessmentLimit : int as LossAssessmentLimit
  var _territoryCodeForSinkholeLossCov : int as TerritoryCodeForSinkholeLossCov
  var _county : String as County
  var _covALimit : BigDecimal as CovALimit
  var _ordinanceOrLawLimit : String as ordinanceOrLawLimit
  var _ppIncreasedLimit : BigDecimal as PPIncreasedLimit
  var _limitedScreenCovLimit : int as LimitedScreenCovLimit
  var _hurricanePercentage : String as HurricanePercentage
  var _limitedFungiWetOrDryRotOrBacteriaSectionILimit : int as LimitedFungiWetOrDryRotOrBacteriaSectionILimit
  var _otherStructuresRentedToOthersLimit : BigDecimal as OtherStructuresRentedToOthersLimit
  var _isPermittedIncidentalOccupancyInDwelling: boolean as IsPermittedIncidentalOccupancyInDwelling = false
  var _isPermittedIncidentalOccupancyInOtherStructures: boolean as IsPermittedIncidentalOccupancyInOtherStructures = false
  var _permittedIncidentalOccupancyOtherStructuresLimit: BigDecimal as PermittedIncidentalOccupancyOtherStructuresLimit
  var _isPermittedIncidentalOccupancyExtendSectionIICoverage: boolean as IsPermittedIncidentalOccupancyExtendSectionIICoverage = false
  var _buildingAdditionsAndAlterationsLimit: BigDecimal as BuildingAdditionsAndAlterationsLimit
  var _ordinanceOrLawCovLimit : BigDecimal as ordinanceOrLawCovLimit
  var _specialComputerCoverageLimit : BigDecimal as SpecialComputerCoverageLimit
  var _increasedPersonalPropertyPremium: BigDecimal as IncreasedPersonalPropertyPremium = 0.0
  var _coverageLimitForDeductible : BigDecimal as CoverageLimitForDeductible = 0
  var _aopDeductibleLimit : BigDecimal as AOPDeductibleLimit

  construct(dwelling : Dwelling_HOE){
    super(dwelling)
    _covALimit = ((dwelling.HODW_Dwelling_Cov_HOEExists)? dwelling.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value : 0)
      _lossAssessmentLimit = dwelling?.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm.Value.intValue()

      _county = (dwelling?.HOLocation?.PolicyLocation?.County != null)? dwelling?.HOLocation?.PolicyLocation?.County : ""
     if(TerritoryCode != null and TerritoryCode.Numeric)
      _territoryCodeForSinkholeLossCov = TerritoryCode?.toInt()


      _ordinanceOrLawLimit = dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm.DisplayValue

      if(dwelling?.HODW_LimitedScreenCov_HOE_ExtExists and dwelling?.HODW_LimitedScreenCov_HOE_Ext?.HasHODW_LimitedScreenLimit_HOETerm){
        _limitedScreenCovLimit = dwelling?.HODW_LimitedScreenCov_HOE_Ext?.HODW_LimitedScreenLimit_HOETerm?.Value.intValue()
      }
      _hurricanePercentage = dwelling.HODW_SectionI_Ded_HOE?.HasHODW_Hurricane_Ded_HOETerm? dwelling.HODW_SectionI_Ded_HOE?.HODW_Hurricane_Ded_HOETerm.DisplayValue : ""

      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwelling?.HODW_FungiCov_HOE?.HODW_FungiSectionILimit_HOETerm?.Value?.intValue()

      _otherStructuresRentedToOthersLimit = dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HODW_IncreasedLimit_HOETerm?.Value

      _isPermittedIncidentalOccupancyInDwelling = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODWDwelling_HOETerm?.Value
      _isPermittedIncidentalOccupancyInOtherStructures = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_OtherStructure_HOETerm?.Value
      _isPermittedIncidentalOccupancyExtendSectionIICoverage = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_ExtendSectionCov_HOETerm?.Value
      _permittedIncidentalOccupancyOtherStructuresLimit = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_Limit_HOETerm?.Value

      _buildingAdditionsAndAlterationsLimit = dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value
      _ordinanceOrLawCovLimit = dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm?.Value
      _specialComputerCoverageLimit = dwelling?.HODW_SpecialComp_HOE_Ext?.HODW_SpecialComputerCoverageLimit_ExtTerm?.Value

    if(PolicyType == typekey.HOPolicyType_HOE.TC_HO3)
      _coverageLimitForDeductible = dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm.Value
    else if(PolicyType == typekey.HOPolicyType_HOE.TC_HO4 || PolicyType == typekey.HOPolicyType_HOE.TC_HO6)
      _coverageLimitForDeductible = dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.Value

    if(dwelling.HODW_SectionI_Ded_HOEExists){
      _aopDeductibleLimit = dwelling.HODW_SectionI_Ded_HOE.HODW_OtherPerils_Ded_HOETerm?.Value
    }
  }
}