package una.rating.ho.group2.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * rating info for the dwelling level coverages for group 2 states
 */
class HOGroup2DwellingRatingInfo extends HOCommonDwellingRatingInfo {
  var _limitedFungiWetOrDryRotOrBacteriaSectionILimit : int as LimitedFungiWetOrDryRotOrBacteriaSectionILimit
  var _buildingAdditionsAndAlterationsIncreasedLimit : BigDecimal as BuildingAdditionsAndAlterationsLimit
  var _isPermittedIncidentalOccupancyInDwelling: boolean as IsPermittedIncidentalOccupancyInDwelling = false
  var _isPermittedIncidentalOccupancyInOtherStructures: boolean as IsPermittedIncidentalOccupancyInOtherStructures = false
  var _permittedIncidentalOccupancyOtherStructuresLimit: BigDecimal as PermittedIncidentalOccupancyOtherStructuresLimit
  var _isPermittedIncidentalOccupancyExtendSectionIICoverage: boolean as IsPermittedIncidentalOccupancyExtendSectionIICoverage = false
  var _lossAssessmentPolicyForm: String as LossAssessmentPolicyForm
  var _lossAssessmentLimit: int as LossAssessmentLimit
  var _unitOwnersCoverageASpecialLimitsExists : boolean as UnitOwnersCoverageASpecialLimitsExists = false
  var _eqZone: String as EQZone
  var _eqDeductible: BigDecimal as EQDeductible
  var _eqConstruction: typekey.EarthquakeConstrn_Ext as EQConstruction
  var _ordinanceOrLawLimit: BigDecimal as OrdinanceOrLawLimit
  var _otherStructuresRentedToOthersLimit: BigDecimal as OtherStructuresRentedToOthersLimit
  var _higherEQDeductible: boolean as HigherEQDeductible = false
  var _increasedPersonalPropertyExists : boolean as IncreasedPersonalPropertyExists = false
  var _ho3HigherEQDeductible: boolean as HO3HigherEQDeductibleExists = false






  construct(dwelling: Dwelling_HOE){
    super(dwelling)

      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwelling?.HODW_FungiCov_HOE?.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
      _buildingAdditionsAndAlterationsIncreasedLimit = dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value

    _isPermittedIncidentalOccupancyInDwelling = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODWDwelling_HOETerm?.Value
    _isPermittedIncidentalOccupancyInOtherStructures = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_OtherStructure_HOETerm?.Value
    _isPermittedIncidentalOccupancyExtendSectionIICoverage = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_ExtendSectionCov_HOETerm?.Value
    _permittedIncidentalOccupancyOtherStructuresLimit = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_Limit_HOETerm?.Value



    if(dwelling.HODW_LossAssessmentCov_HOE_ExtExists){
      _lossAssessmentLimit = dwelling?.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm.Value
      if(dwelling?.HODW_UnitOwnersCovASpecialLimits_HOE_ExtExists){
        _unitOwnersCoverageASpecialLimitsExists = true
      }
    }

    if(dwelling?.HODW_Personal_Property_HOE?.HODW_PersonalPropertyLimit_HOETerm?.LimitDifference > 0){
      _increasedPersonalPropertyExists = true
    }


   if(dwelling.HODW_Earthquake_HOEExists){
     _eqDeductible = dwelling?.HODW_Earthquake_HOE?.HODW_EarthquakeDed_HOETerm?.Value
     if(_eqDeductible > .10){
       _higherEQDeductible = true
     }

    _ordinanceOrLawLimit = dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm?.Value

     _eqZone = dwelling.EarthQuakeTerritoryOrOverride
     _eqConstruction = dwelling.EarthquakeConstrn_Ext
   }



  }

}