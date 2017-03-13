package una.rating.ho.hawaii.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/26/16
 * rating info for the dwelling level coverages for group 2 states
 */
class HOHIDwellingRatingInfo extends HOCommonDwellingRatingInfo {

  var _otherStructuresOnPremiseIncreasedLimit: BigDecimal as OtherStructuresOnPremiseIncreasedLimit
  var _lossAssessmentLimit: int as LossAssessmentLimit
  var _hasExecutiveEndorsement: boolean as HasExecutiveEndorsement = false
  var _isPermittedIncidentalOccupancyInDwelling: boolean as IsPermittedIncidentalOccupancyInDwelling = false
  var _isPermittedIncidentalOccupancyInOtherStructures: boolean as IsPermittedIncidentalOccupancyInOtherStructures = false
  var _permittedIncidentalOccupancyOtherStructuresLimit: BigDecimal as PermittedIncidentalOccupancyOtherStructuresLimit
  var _isPermittedIncidentalOccupancyExtendSectionIICoverage: boolean as IsPermittedIncidentalOccupancyExtendSectionIICoverage = false
  var _personalLiabilityLimit : BigDecimal as PersonalLiabilityLimit
  var _medicalPaymentsLimit : BigDecimal as MedicalPaymentsLimit
  var _ccEFTAccessDeviceForgeryCounterfeitMoneyLimit : BigDecimal as CCEFTAccessDeviceForgeryCounterfeitMoney
  var _buildingAdditionsAndAlterationsLimit: BigDecimal as BuildingAdditionsAndAlterationsLimit

  construct(dwelling: Dwelling_HOE){
    super(dwelling)
    if(PolicyType == HOPolicyType_HOE.TC_DP3_EXT){
        PersonalPropertyIncreasedLimit = dwelling?.DPDW_Personal_Property_HOE?.DPDW_PersonalPropertyLimit_HOETerm?.Value
    }
    if(dwelling?.HODW_LossAssessmentCov_HOE_ExtExists and dwelling?.HODW_LossAssessmentCov_HOE_Ext?.HasHOPL_LossAssCovLimit_HOETerm){
      _lossAssessmentLimit = dwelling?.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm.Value?.intValue()
    }
    if(dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_PRIM and dwelling?.Occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER){
        _hasExecutiveEndorsement = true
    }
    if (dwelling?.HODW_PermittedIncOcp_HOE_ExtExists){
      _isPermittedIncidentalOccupancyInDwelling = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODWDwelling_HOETerm?.Value
      _isPermittedIncidentalOccupancyInOtherStructures = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_OtherStructure_HOETerm?.Value
      _isPermittedIncidentalOccupancyExtendSectionIICoverage = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_ExtendSectionCov_HOETerm?.Value
      _permittedIncidentalOccupancyOtherStructuresLimit = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_Limit_HOETerm?.Value

      if(dwelling?.HOLine?.HOLI_Personal_Liability_HOEExists and dwelling?.HOLine?.HOLI_Personal_Liability_HOE?.HasHOLI_Liability_Limit_HOETerm){
         _personalLiabilityLimit = dwelling?.HOLine?.HOLI_Personal_Liability_HOE?.HOLI_Liability_Limit_HOETerm?.Value
      }
      if(dwelling?.HOLine?.HOLI_Med_Pay_HOEExists and dwelling?.HOLine?.HOLI_Med_Pay_HOE?.HasHOLI_MedPay_Limit_HOETerm){
         _medicalPaymentsLimit = dwelling?.HOLine?.HOLI_Med_Pay_HOE?.HOLI_MedPay_Limit_HOETerm?.Value
      }
    }
    if(dwelling?.HODW_CC_EFT_HOE_ExtExists and dwelling?.HODW_CC_EFT_HOE_Ext?.HasHODW_CC_EFTLimit_HOETerm){
         _ccEFTAccessDeviceForgeryCounterfeitMoneyLimit = dwelling?.HODW_CC_EFT_HOE_Ext?.HODW_CC_EFTLimit_HOETerm?.Value
    }
    if (dwelling?.HODW_BuildingAdditions_HOE_ExtExists){
      _buildingAdditionsAndAlterationsLimit = dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value
    }
  }

}