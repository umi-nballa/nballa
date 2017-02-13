package una.rating.ho.group1.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal


/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/10/16
 * Time: 10:50 AM
 */
class HOGroup1DwellingRatingInfo extends HOCommonDwellingRatingInfo {
  var _limitedFungiWetOrDryRotOrBacteriaSectionILimit: int as LimitedFungiWetOrDryRotOrBacteriaSectionILimit
  var _isLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium: boolean as IsLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium = false
  var _doesSpecialPersonalPropertyCoverageExist: boolean as SpecialPersonalPropertyCoverage = false
  var _lossAssessmentPolicyForm: String as LossAssessmentPolicyForm
  var _lossAssessmentLimit: int as LossAssessmentLimit
  var _otherStructuresRentedToOthersLimit: BigDecimal as OtherStructuresRentedToOthersLimit
  var _isPermittedIncidentalOccupancyInDwelling: boolean as IsPermittedIncidentalOccupancyInDwelling = false
  var _isPermittedIncidentalOccupancyInOtherStructures: boolean as IsPermittedIncidentalOccupancyInOtherStructures = false
  var _permittedIncidentalOccupancyOtherStructuresLimit: BigDecimal as PermittedIncidentalOccupancyOtherStructuresLimit
  var _isPermittedIncidentalOccupancyExtendSectionIICoverage: boolean as IsPermittedIncidentalOccupancyExtendSectionIICoverage = false
  var _buildingAdditionsAndAlterationsLimit: BigDecimal as BuildingAdditionsAndAlterationsLimit
  var _ordinanceOrLawLimit : BigDecimal as OrdinanceOrLawLimit
  var _earthquakeLimitedLimit : BigDecimal as EarthquakeLimitedLimit
  var _earthquakeComprehensiveLimit : BigDecimal as EarthquakeComprehensiveLimit
  var _earthquakeTerritoryValue :  String as  EarthquakeTerritoryValue
  var _earthquakeTerritoryValueInt : int as EarthquakeTerritoryValueInt
  var _earthquakeConstructionType : EarthquakeConstrn_Ext as EarthquakeConstructionType
  var _earthquakeDeductible : BigDecimal as EarthquakeDeductible
  var _earthquakeGrading : int as EarthquakeGrading
  var _lossAssessmentCoverageForEQ : BigDecimal as LossAssessmentCoverageForEQ
  var _hasAssessmentCoverageForEQ : boolean as HasAssessmentCoverageForEQ = false
  var _hasOtherStructuresRentedToOthersLimit : boolean as HasOtherStructuresRentedToOthersLimit = false
  var _yearBuilt : int as YearBuilt
  var _isEQCompCovConstructionRetrofit : boolean as IsEQCompConstructionRetrofit = false
  var _isEQLtdCovConstructionRetrofit : boolean as IsEQLtdConstructionRetrofit = false

  construct(dwellingCov: DwellingCov_HOE) {
    super(dwellingCov)
    var baseState = dwellingCov.Dwelling?.PolicyLine.BaseState

    if (dwellingCov typeis HODW_FungiCov_HOE){
      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwellingCov.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
      if (baseState == typekey.Jurisdiction.TC_CA || baseState == typekey.Jurisdiction.TC_AZ ||
          (baseState == typekey.Jurisdiction.TC_NV and _limitedFungiWetOrDryRotOrBacteriaSectionILimit == dwellingCov.HODW_FungiSectionILimit_HOETerm.RuntimeDefault))
        _isLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium = true
    }
    if (dwellingCov typeis HODW_SpecialPersonalProperty_HOE_Ext and baseState == Jurisdiction.TC_CA){
      _doesSpecialPersonalPropertyCoverageExist = true
    }
    if (dwellingCov typeis HODW_LossAssessmentCov_HOE_Ext){
      _lossAssessmentPolicyForm = this.PolicyType.Code
      if (baseState == Jurisdiction.TC_CA and PolicyType == HOPolicyType_HOE.TC_HO3){
        if (dwellingCov.Dwelling?.HODW_Dwelling_Cov_HOEExists){
          if (dwellingCov.Dwelling?.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value)
            _lossAssessmentPolicyForm += "_ExecCov"
        }
      }
      _lossAssessmentLimit = dwellingCov.HOPL_LossAssCovLimit_HOETerm.Value.intValue()
    }
    if (dwellingCov typeis HODW_SpecificOtherStructure_HOE_Ext){
      _otherStructuresRentedToOthersLimit = dwellingCov.HODW_IncreasedLimit_HOETerm?.Value
    }
    if (dwellingCov typeis HODW_OrdinanceCov_HOE){
      _ordinanceOrLawLimit = dwellingCov.HODW_OrdinanceLimit_HOETerm?.Value
    }
    if (dwellingCov typeis HODW_PermittedIncOcp_HOE_Ext){
      _isPermittedIncidentalOccupancyInDwelling = dwellingCov.HODWDwelling_HOETerm?.Value
      _isPermittedIncidentalOccupancyInOtherStructures = dwellingCov.HODW_OtherStructure_HOETerm?.Value
      _isPermittedIncidentalOccupancyExtendSectionIICoverage = dwellingCov.HODW_ExtendSectionCov_HOETerm?.Value
      _permittedIncidentalOccupancyOtherStructuresLimit = dwellingCov.HODW_Limit_HOETerm?.Value
    }
    if (dwellingCov typeis HODW_BuildingAdditions_HOE_Ext){
      _buildingAdditionsAndAlterationsLimit = dwellingCov.HODW_BuildAddInc_HOETerm?.Value
    }
    if (dwellingCov typeis HODW_Limited_Earthquake_CA_HOE){
      if(PolicyType == HOPolicyType_HOE.TC_HO4 or PolicyType == HOPolicyType_HOE.TC_HO6){
        _earthquakeLimitedLimit = dwellingCov?.HODW_EQCovCPersonalProperty_HOE_ExtTerm?.Value
      } else if(PolicyType == HOPolicyType_HOE.TC_HO3){
        _earthquakeLimitedLimit = dwellingCov?.HODW_EQDwellingLimit_HOE_ExtTerm?.Value
        _yearBuilt = dwellingCov?.Dwelling?.YearBuilt
        _isEQLtdCovConstructionRetrofit = dwellingCov?.HasHODW_Retrofitted_HOE_ExtTerm
      }
    }
    if (dwellingCov typeis HODW_Comp_Earthquake_CA_HOE_Ext){
      if(PolicyType == HOPolicyType_HOE.TC_HO6){
        _earthquakeComprehensiveLimit = dwellingCov?.HODW_CompEarthquakeCovC_ExtTerm?.Value
      } else if(PolicyType == HOPolicyType_HOE.TC_HO3){
        _earthquakeComprehensiveLimit = dwellingCov?.HODW_EQCovA_HOETerm?.Value
        _yearBuilt = dwellingCov?.Dwelling?.YearBuilt
        _isEQCompCovConstructionRetrofit = dwellingCov?.HasHODW_Retrofitted_HOETerm
      }
    }
    if(dwellingCov typeis HODW_Limited_Earthquake_CA_HOE or dwellingCov typeis HODW_Comp_Earthquake_CA_HOE_Ext){
        if(dwellingCov?.Dwelling?.OverrideEarthquakeTer_Ext){
             _earthquakeTerritoryValue = dwellingCov?.Dwelling?.EarthquakeTerOverridden_Ext
        } else {
            _earthquakeTerritoryValue = dwellingCov?.Dwelling?.EarthQuakeTer_Ext
        }
      _earthquakeConstructionType = dwellingCov?.Dwelling?.EarthquakeConstrn_Ext
    }
    if(dwellingCov typeis HODW_Earthquake_HOE and dwellingCov?.Dwelling?.HODW_Earthquake_HOEExists){
      _earthquakeConstructionType = dwellingCov?.Dwelling?.EarthquakeConstrn_Ext
      _earthquakeDeductible = dwellingCov?.Dwelling?.HODW_Earthquake_HOE?.HODW_EarthquakeDed_HOETerm?.Value
      if(dwellingCov?.Dwelling?.OverrideEarthquakeTer_Ext){
        _earthquakeTerritoryValueInt = dwellingCov?.Dwelling?.EarthquakeTerOverridden_Ext.toInt()
      } else {
        _earthquakeTerritoryValueInt = dwellingCov?.Dwelling?.EarthQuakeTer_Ext.toInt()
      }
      if(dwellingCov?.Dwelling?.HOLocation?.OverrideBCEG_Ext){
          _earthquakeGrading = dwellingCov?.Dwelling?.HOLocation?.BCEGOverridden_Ext.Value
      } else{
        _earthquakeGrading = dwellingCov?.Dwelling?.HOLocation?.BCEG_Ext.Value
      }
      if(dwellingCov?.Dwelling?.HODW_SpecificOtherStructure_HOE_ExtExists and
          dwellingCov?.Dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HasHODW_IncreasedLimit_HOETerm){
        _otherStructuresRentedToOthersLimit = dwellingCov?.Dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HODW_IncreasedLimit_HOETerm?.Value
      }
      if(dwellingCov?.Dwelling?.HODW_LossAssEQEndorsement_HOE_ExtExists and
          dwellingCov?.Dwelling?.HODW_LossAssEQEndorsement_HOE_Ext?.HasHODW_LossAssEQLimit_HOETerm){
          _hasAssessmentCoverageForEQ = dwellingCov?.Dwelling?.HODW_LossAssEQEndorsement_HOE_Ext?.HasHODW_LossAssEQLimit_HOETerm
          _lossAssessmentCoverageForEQ = dwellingCov?.Dwelling?.HODW_LossAssEQEndorsement_HOE_Ext?.HODW_LossAssEQLimit_HOETerm?.Value
      }
      if(dwellingCov?.Dwelling?.HODW_SpecificOtherStructure_HOE_ExtExists){
        _hasOtherStructuresRentedToOthersLimit = dwellingCov?.Dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HasHODW_IncreasedLimit_HOETerm
        if(_hasOtherStructuresRentedToOthersLimit){
            _otherStructuresRentedToOthersLimit = dwellingCov?.Dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HODW_IncreasedLimit_HOETerm?.Value
        }
      }
      if(dwellingCov?.Dwelling?.HODW_BuildingAdditions_HOE_ExtExists and
          dwellingCov?.Dwelling?.HODW_BuildingAdditions_HOE_Ext?.HasHODW_BuildAddInc_HOETerm){
          _buildingAdditionsAndAlterationsLimit = dwellingCov?.Dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value
      }
      if(dwellingCov?.Dwelling?.HODW_OrdinanceCov_HOEExists and dwellingCov?.Dwelling?.HODW_OrdinanceCov_HOE?.HasHODW_OrdinanceLimit_HOETerm){
         _ordinanceOrLawLimit = dwellingCov?.Dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm?.Value
      }
    }
  }
}