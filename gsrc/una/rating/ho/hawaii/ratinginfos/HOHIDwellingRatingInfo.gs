package una.rating.ho.hawaii.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses una.rating.ho.hawaii.ratinginfos.HOHIBasePremiumRatingInfo
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

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
  var _hurricaneConstructionType: String as HurricaneConstructionType
  var _ageOfHome: int as AgeOfHome = 0
  var _yearBuilt: int as YearBuilt
  var _numberOfStories: int as NumberOfStories
  var _numberOfUnits: int as NumberOfUnits
  var _ordinanceOrLawLimit: BigDecimal as OrdinanceOrLawLimit
  var _ordinanceOrLawIncreasedLimit : boolean as OrdinanceOrLawIncreasedLimit = false
  var _floorLevel : int as FloorLevel
  var covALimit : BigDecimal as CovALimit
  var unitOwnersCovABaseLimit : int as UnitOwnersCovABaseLimit



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

    covALimit = dwelling?.HODW_Dwelling_Cov_HOE?.HODW_Dwelling_Limit_HOETerm?.Value
    unitOwnersCovABaseLimit = ConfigParamsUtil.getInt(TC_UnitOwnersCovALimit, dwelling.HOLine.BaseState, dwelling.HOPolicyType)


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
    if(dwelling?.HODW_HurricaneCov_HOE_ExtExists){
       if(dwelling?.HODW_HurricaneCov_HOE_Ext.HasHODW_HurricaneConstructionType_HOETerm){
         _hurricaneConstructionType = dwelling?.HODW_HurricaneCov_HOE_Ext.HODW_HurricaneConstructionType_HOETerm?.DisplayName
       }
       _yearBuilt = dwelling?.OverrideYearbuilt_Ext? dwelling?.YearBuiltOverridden_Ext : dwelling?.YearBuilt
       _ageOfHome = dwelling?.PolicyPeriod?.EditEffectiveDate.YearOfDate - AgeOfHome
       _numberOfStories = getNumberOfStoriesForDwelling(dwelling)
    }

    _numberOfUnits = dwelling?.NumUnitsFireDivision_Ext

    _ordinanceOrLawLimit = dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm?.Value

    if(_ordinanceOrLawLimit > .10){
      _ordinanceOrLawIncreasedLimit = true
    }

    _floorLevel = dwelling?.FloorLocation_Ext?.toInt()




  }

  private static function getNumberOfStoriesForDwelling(dwelling : Dwelling_HOE) : int{
    var noOfStories : NumberOfStories_HOE
    if(dwelling?.OverrideStoriesNumber_Ext){
       noOfStories = dwelling?.NoofStoriesOverridden_Ext
    }else{
       noOfStories = dwelling?.StoriesNumber
    }
    if(noOfStories == typekey.NumberOfStories_HOE.TC_ONESTORY_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_ONEANDHALFSTORIES_EXT){
       return 1
    } else if(noOfStories == typekey.NumberOfStories_HOE.TC_TWOSTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_TWOANDHALFSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_THREESTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_THREEANDHALFSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_FOURSTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_FOURANDHALFSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_FIVESTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_SIXSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_SEVENSTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_EIGHTSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_NINESTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_TENSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_ELEVENSTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_TWELVESTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_THIRTEENSTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_FOURTEENSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_FIFTEENSTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_SIXTEENSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_SEVENTEENSTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_EIGHTEENSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_NINETEENSTORIES_EXT or noOfStories == typekey.NumberOfStories_HOE.TC_TWENTYSTORIES_EXT or
        noOfStories == typekey.NumberOfStories_HOE.TC_MORETHANTWENTYSTORIES_EXT){
        return 2
    }
    return 0
  }

}