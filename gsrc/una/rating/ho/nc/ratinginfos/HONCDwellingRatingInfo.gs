package una.rating.ho.nc.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:16 PM
 * To change this template use File | Settings | File Templates.
 */
class HONCDwellingRatingInfo extends HOCommonDwellingRatingInfo {
  var _ccEFTAccessDeviceForgeryCounterfeitMoneyLimit : BigDecimal as CCEFTAccessDeviceForgeryCounterfeitMoney
  var _waterBackupSumpOverflowCovLimit : BigDecimal as WaterBackUpSumpOverFlowCoverageLimit
  var _personalPropertyOffResidence: BigDecimal as PersonalPropertyOffResidenceLimit
  var _increasedLimitsJewelryWatchesFurs: BigDecimal as IncreasedLimitsJewelryWatchesFurs
  var _isPermittedIncidentalOccupancyInDwelling: boolean as IsPermittedIncidentalOccupancyInDwelling = false
  var _isPermittedIncidentalOccupancyInOtherStructures: boolean as IsPermittedIncidentalOccupancyInOtherStructures = false
  var _permittedIncidentalOccupancyOtherStructuresLimit: BigDecimal as PermittedIncidentalOccupancyOtherStructuresLimit
  var _isPermittedIncidentalOccupancyExtendSectionIICoverage: boolean as IsPermittedIncidentalOccupancyExtendSectionIICoverage = false
  var _lossAssessmentLimit: BigDecimal as LossAssessmentLimit
  var _unitOwnersCoverageASpecialLimitsExists : boolean as UnitOwnersCoverageASpecialLimitsExists = false
  construct(dwellingCov: DwellingCov_HOE){
      super(dwellingCov)

      _ccEFTAccessDeviceForgeryCounterfeitMoneyLimit = dwellingCov.Dwelling.HODW_CC_EFT_HOE_Ext.HODW_CC_EFTLimit_HOETerm.Value
      _waterBackupSumpOverflowCovLimit = dwellingCov.Dwelling.HODW_LimWaterBckSumpDiscOverFlow_NC_HOE_Ext.HODW_LimWaterbackup_Limit_HOETerm.Value
      _personalPropertyOffResidence = dwellingCov.Dwelling?.HODW_PersonalPropertyOffResidence_HOE?.HOLI_PPOtherResidence_Limit_HOETerm?.Value
    if (dwellingCov.Dwelling?.HODW_SpecialLimitsPP_HOE_ExtExists){
      if (dwellingCov.Dwelling?.HODW_SpecialLimitsPP_HOE_Ext?.HasHODW_JewelryWatchesFursLimit_HOETerm){
        _increasedLimitsJewelryWatchesFurs = dwellingCov.Dwelling?.HODW_SpecialLimitsPP_HOE_Ext?.HODW_JewelryWatchesFursLimit_HOETerm?.Value
      }
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