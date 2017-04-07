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
  var _higherEQDeductible : boolean as HigherEQDeductible = false
  var _eqZone : String as EQZone
  var _eqConstruction : typekey.EarthquakeConstrn_Ext as EQConstruction
  var _eqDeductible : BigDecimal as EQDeductible
  var _ordinanceOrLawLimit : BigDecimal as OrdinanceOrLawLimit
  var _otherStructuresRentedToOthersLimit : BigDecimal as OtherStructuresRentedToOthersLimit
  var _firePersonalPropertyLimit : BigDecimal as FirePersonalPropertyLimit
  var _fireDepartmentServiceChargeLimit : BigDecimal as FireDepartmentServiceChargeLimit
  var _dwellingFireOrdinanceOrLawLimit : BigDecimal as DwellingFireOrdinanceOrLawLimit
  var _dwellingFireOtherStructuredIncreasedLimit : BigDecimal as DwellingFireOtherStructuredIncreasedLimit
  var _protectionClassCode : String as ProtectionClassCode
  var _vacancyPeriod : int as VacancyPeriod
  var _lossAssessmentEQLimit : int as LossAssessmentEQLimit
  var _keyPremium: BigDecimal as KeyPremium = 0.0
  var _buildingAdditionsAndAlterationsIncreasedLimit : BigDecimal as BuildingAdditionsAndAlterationsLimit



  construct(dwelling : Dwelling_HOE){
      super(dwelling)

      _ccEFTAccessDeviceForgeryCounterfeitMoneyLimit = dwelling?.HODW_CC_EFT_HOE_Ext?.HODW_CC_EFTLimit_HOETerm?.Value
      _waterBackupSumpOverflowCovLimit = dwelling?.HODW_LimWaterBckSumpDiscOverFlow_NC_HOE_Ext?.HODW_LimWaterbackup_Limit_HOETerm?.Value
      _personalPropertyOffResidence = dwelling?.HODW_PersonalPropertyOffResidence_HOE?.HOLI_PPOtherResidence_Limit_HOETerm?.Value
    if (dwelling?.HODW_SpecialLimitsPP_HOE_ExtExists){
      if (dwelling?.HODW_SpecialLimitsPP_HOE_Ext?.HasHODW_JewelryWatchesFursLimit_HOETerm){
        _increasedLimitsJewelryWatchesFurs = dwelling?.HODW_SpecialLimitsPP_HOE_Ext?.HODW_JewelryWatchesFursLimit_HOETerm?.Value
      }
    }
      _isPermittedIncidentalOccupancyInDwelling = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODWDwelling_HOETerm?.Value
      _isPermittedIncidentalOccupancyInOtherStructures = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_OtherStructure_HOETerm?.Value
      _isPermittedIncidentalOccupancyExtendSectionIICoverage = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_ExtendSectionCov_HOETerm?.Value
      _permittedIncidentalOccupancyOtherStructuresLimit = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_Limit_HOETerm?.Value

      _buildingAdditionsAndAlterationsIncreasedLimit = dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value

      _lossAssessmentLimit = dwelling?.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm.Value

      if(dwelling?.HODW_UnitOwnersCovASpecialLimits_HOE_ExtExists){
        _unitOwnersCoverageASpecialLimitsExists = true
      }

    if(dwelling.HODW_Earthquake_HOEExists){
      _eqDeductible = dwelling.HODW_Earthquake_HOE.HODW_EarthquakeDed_HOETerm.Value
      if( _eqDeductible> 0.05){
        _higherEQDeductible = true
      }
      _eqZone = dwelling.EarthQuakeTerritoryOrOverride
      _eqConstruction = dwelling.EarthquakeConstrn_Ext
      if(_eqConstruction != typekey.EarthquakeConstrn_Ext.TC_SUPERIOR and dwelling?.HODW_Earthquake_HOE?.HODW_EarthquakeMason_HOETerm?.Value){
        _eqConstruction = typekey.EarthquakeConstrn_Ext.TC_MASONRY
      }
    }

    if(PolicyType == typekey.HOPolicyType_HOE.TC_HO3){
      _ordinanceOrLawLimit = dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm?.Value  * dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value
    }
    if(PolicyType == typekey.HOPolicyType_HOE.TC_HO4){
      _ordinanceOrLawLimit = dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm?.Value  * dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value
    }

    _otherStructuresRentedToOthersLimit = dwelling?.HODW_Other_Structures_HOE?.HODW_OtherStructures_Limit_HOETerm?.Value

    if(dwelling?.DPDW_Personal_Property_HOEExists)
      _firePersonalPropertyLimit = dwelling.DPDW_Personal_Property_HOE?.DPDW_PersonalPropertyLimit_HOETerm?.Value

    if(dwelling?.HODW_FireDepartServiceCharge_HOE_ExtExists)
      _fireDepartmentServiceChargeLimit = dwelling?.HODW_FireDepartServiceCharge_HOE_Ext?.HODW_FireDepartmentSC_Limit_HOE_ExtTerm?.Value

    if(dwelling?.DPDW_OrdinanceCov_HOEExists)
      _dwellingFireOrdinanceOrLawLimit = dwelling.DPDW_OrdinanceCov_HOE?.DPDW_OrdinanceLimit_HOETerm?.Value

    if(dwelling?.DPDW_Other_Structures_HOEExists){
      _dwellingFireOtherStructuredIncreasedLimit = dwelling.DPDW_Other_Structures_HOE?.DPDW_OtherStructuresLimit_HOETerm?.LimitDifference
      _protectionClassCode = dwelling?.HOLocation?.OverrideDwellingPCCode_Ext? dwelling?.HOLocation?.DwellingPCCodeOverridden_Ext : dwelling?.HOLocation?.DwellingProtectionClassCode
    }

    if(dwelling?.HODW_VacancyClause_ExtExists){
      _vacancyPeriod = dwelling.HODW_VacancyClause_Ext?.HODW_VacancyFromDateTerm.Value.differenceInDays(dwelling.HODW_VacancyClause_Ext?.HODW_VacancyToDateTerm.Value)
    }

    if(dwelling?.HODW_LossAssEQEndorsement_HOE_ExtExists){
      _lossAssessmentEQLimit = dwelling?.HODW_LossAssEQEndorsement_HOE_Ext?.HODW_LossAssEQLimit_HOETerm?.Value?.intValue()
    }


   }
}
