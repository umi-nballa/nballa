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

  construct(lineVersion: HomeownersLine_HOE) {
    super(lineVersion)
  }

  construct(dwellingCov: DwellingCov_HOE){
    super(dwellingCov)
    var baseState = dwellingCov.Dwelling?.PolicyLine.BaseState

    if(dwellingCov typeis HODW_FungiCov_HOE){
      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwellingCov.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
    }
    if(dwellingCov.Dwelling.HODW_BuildingAdditions_HOE_ExtExists){
      _buildingAdditionsAndAlterationsIncreasedLimit = dwellingCov.Dwelling.HODW_BuildingAdditions_HOE_Ext.HODW_BuildAddInc_HOETerm?.Value
    }

    if (dwellingCov typeis HODW_PermittedIncOcp_HOE_Ext){
      _isPermittedIncidentalOccupancyInDwelling = dwellingCov.HODWDwelling_HOETerm?.Value
      _isPermittedIncidentalOccupancyInOtherStructures = dwellingCov.HODW_OtherStructure_HOETerm?.Value
      _isPermittedIncidentalOccupancyExtendSectionIICoverage = dwellingCov.HODW_ExtendSectionCov_HOETerm?.Value
      _permittedIncidentalOccupancyOtherStructuresLimit = dwellingCov.HODW_Limit_HOETerm?.Value
    }

    if(dwellingCov typeis HODW_LossAssessmentCov_HOE_Ext){
      _lossAssessmentLimit = dwellingCov.HOPL_LossAssCovLimit_HOETerm.Value
      if(dwellingCov.Dwelling.HODW_UnitOwnersCovASpecialLimits_HOE_ExtExists){
        _unitOwnersCoverageASpecialLimitsExists = true
      }
    }

  }

}