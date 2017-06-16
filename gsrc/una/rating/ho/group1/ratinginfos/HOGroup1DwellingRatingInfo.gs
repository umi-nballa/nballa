package una.rating.ho.group1.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal
uses una.config.ConfigParamsUtil

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
  var _higherEQOrdinanceOrLaw: boolean as HigherEQOrdOrLaw = false
  var _higherEQDeductible: boolean as HigherEQDeductible = false
  var caUnitOwnersCovASpecialBaseLimit: int as CAUnitOwnersCovASpecialBaseLimit


  construct(dwelling: Dwelling_HOE) {
    super(dwelling)
    var baseState = dwelling?.PolicyLine.BaseState

    caUnitOwnersCovASpecialBaseLimit = ConfigParamsUtil.getInt(TC_CAUnitOwnersSpecialBaseLimit, dwelling.HOLine.BaseState, dwelling.HOPolicyType)

    if (dwelling?.HODW_FungiCov_HOEExists){
      _limitedFungiWetOrDryRotOrBacteriaSectionILimit = dwelling?.HODW_FungiCov_HOE?.HODW_FungiSectionILimit_HOETerm?.Value.intValue()
      if (baseState == typekey.Jurisdiction.TC_CA || baseState == typekey.Jurisdiction.TC_AZ ||
          (baseState == typekey.Jurisdiction.TC_NV and _limitedFungiWetOrDryRotOrBacteriaSectionILimit == dwelling?.HODW_FungiCov_HOE?.HODW_FungiSectionILimit_HOETerm.RuntimeDefault))
        _isLimitedFungiWetOrDryRotOrBacteriaSectionICovInBasePremium = true
    }
    if (dwelling?.HODW_SpecialPersonalProperty_HOE_ExtExists and baseState == Jurisdiction.TC_CA){
      _doesSpecialPersonalPropertyCoverageExist = true
    }
    if (dwelling?.HODW_LossAssessmentCov_HOE_ExtExists){
      _lossAssessmentPolicyForm = this.PolicyType.Code
      if (baseState == Jurisdiction.TC_CA){
        if(PolicyType == HOPolicyType_HOE.TC_HO3){
          if (dwelling?.HODW_Dwelling_Cov_HOEExists){
            if (dwelling?.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value)
              _lossAssessmentPolicyForm += "_ExecCov"
          }
        }
      }
      if(PolicyType == HOPolicyType_HOE.TC_HO6){
        if(dwelling?.HODW_UnitOwnersCovASpecialLimits_HOE_ExtExists){
          _lossAssessmentPolicyForm += "_SpecCov"
        }
      }
      _lossAssessmentLimit = dwelling?.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm.Value?.intValue()
    }
    if (dwelling?.HODW_SpecificOtherStructure_HOE_ExtExists){
      _otherStructuresRentedToOthersLimit = dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HODW_IncreasedLimit_HOETerm?.Value
    }
    if (dwelling?.HODW_OrdinanceCov_HOEExists){
      _ordinanceOrLawLimit = dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm?.Value
    }
    if (dwelling?.HODW_PermittedIncOcp_HOE_ExtExists){
      _isPermittedIncidentalOccupancyInDwelling = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODWDwelling_HOETerm?.Value
      _isPermittedIncidentalOccupancyInOtherStructures = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_OtherStructure_HOETerm?.Value
      _isPermittedIncidentalOccupancyExtendSectionIICoverage = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_ExtendSectionCov_HOETerm?.Value
      _permittedIncidentalOccupancyOtherStructuresLimit = dwelling?.HODW_PermittedIncOcp_HOE_Ext?.HODW_Limit_HOETerm?.Value
    }
    if (dwelling?.HODW_BuildingAdditions_HOE_ExtExists){
      _buildingAdditionsAndAlterationsLimit = dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value
    }
    if (dwelling?.HODW_Limited_Earthquake_CA_HOEExists){
      if(PolicyType == HOPolicyType_HOE.TC_HO4 or PolicyType == HOPolicyType_HOE.TC_HO6){
        _earthquakeLimitedLimit = dwelling?.HODW_Limited_Earthquake_CA_HOE?.HODW_EQCovCPersonalProperty_HOE_ExtTerm?.Value
      } else if(PolicyType == HOPolicyType_HOE.TC_HO3){
        _earthquakeLimitedLimit = dwelling?.HODW_Limited_Earthquake_CA_HOE?.HODW_EQDwellingLimit_HOE_ExtTerm?.Value
        _yearBuilt = dwelling?.YearBuilt


        if (dwelling?.HODW_Limited_Earthquake_CA_HOE?.HODW_Retrofitted_HOE_ExtTerm?.Value == 1.0){
          _isEQLtdCovConstructionRetrofit = false
        }
        else{
          _isEQLtdCovConstructionRetrofit = true
        }

      }
    }
    if (dwelling?.HODW_Comp_Earthquake_CA_HOE_ExtExists){
      if(PolicyType == HOPolicyType_HOE.TC_HO6){
        _earthquakeComprehensiveLimit = dwelling?.HODW_Comp_Earthquake_CA_HOE_Ext?.HODW_CompEarthquakeCovC_ExtTerm?.Value
      } else if(PolicyType == HOPolicyType_HOE.TC_HO3){
        _earthquakeComprehensiveLimit = dwelling?.HODW_Comp_Earthquake_CA_HOE_Ext?.HODW_EQCovA_HOETerm?.Value
        _yearBuilt = dwelling?.YearBuilt
        _isEQCompCovConstructionRetrofit = dwelling?.HODW_Comp_Earthquake_CA_HOE_Ext?.HasHODW_Retrofitted_HOETerm
      }
    }
    if(dwelling?.HODW_Limited_Earthquake_CA_HOEExists or dwelling?.HODW_Comp_Earthquake_CA_HOE_ExtExists){
      _earthquakeTerritoryValue = dwelling?.EarthQuakeTerritoryOrOverride
      if (ConstructionType == RateTableConstructionType_Ext.TC_FRAME){
        _earthquakeConstructionType = EarthquakeConstrn_Ext.TC_FRAME
      }
    }

    if(dwelling?.HODW_Earthquake_HOEExists){
      if(baseState == Jurisdiction.TC_AZ){
          _earthquakeConstructionType = EarthquakeConstrn_Ext.TC_FRAME
      } else{
        _earthquakeConstructionType = dwelling?.EarthquakeConstrn_Ext
      }
      _earthquakeDeductible = dwelling?.HODW_Earthquake_HOE?.HODW_EarthquakeDed_HOETerm?.Value
      _earthquakeTerritoryValueInt = dwelling?.EarthQuakeTerritoryOrOverride?.toInt()
      _earthquakeGrading = dwelling?.BCEGOrOverride?.Value
      if(dwelling?.HODW_SpecificOtherStructure_HOE_ExtExists and
          dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HasHODW_IncreasedLimit_HOETerm){
        _otherStructuresRentedToOthersLimit = dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HODW_IncreasedLimit_HOETerm?.Value
      }
      if(dwelling?.HODW_LossAssEQEndorsement_HOE_ExtExists and
          dwelling?.HODW_LossAssEQEndorsement_HOE_Ext?.HasHODW_LossAssEQLimit_HOETerm){
          _hasAssessmentCoverageForEQ = dwelling?.HODW_LossAssEQEndorsement_HOE_Ext?.HasHODW_LossAssEQLimit_HOETerm
          _lossAssessmentCoverageForEQ = dwelling?.HODW_LossAssEQEndorsement_HOE_Ext?.HODW_LossAssEQLimit_HOETerm?.Value
      }
      if(dwelling?.HODW_SpecificOtherStructure_HOE_ExtExists){
        _hasOtherStructuresRentedToOthersLimit = dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HasHODW_IncreasedLimit_HOETerm
        if(_hasOtherStructuresRentedToOthersLimit){
            _otherStructuresRentedToOthersLimit = dwelling?.HODW_SpecificOtherStructure_HOE_Ext?.HODW_IncreasedLimit_HOETerm?.Value
        }
      }
      if(dwelling?.HODW_BuildingAdditions_HOE_ExtExists and
          dwelling?.HODW_BuildingAdditions_HOE_Ext?.HasHODW_BuildAddInc_HOETerm){
          _buildingAdditionsAndAlterationsLimit = dwelling?.HODW_BuildingAdditions_HOE_Ext?.HODW_BuildAddInc_HOETerm?.Value
      }
      if(dwelling?.HODW_OrdinanceCov_HOEExists and dwelling?.HODW_OrdinanceCov_HOE?.HasHODW_OrdinanceLimit_HOETerm){
         _ordinanceOrLawLimit = dwelling?.HODW_OrdinanceCov_HOE?.HODW_OrdinanceLimit_HOETerm?.Value
      }

      if(_ordinanceOrLawLimit > .10){
        _higherEQOrdinanceOrLaw = true
      }

      if(_earthquakeDeductible > .10){
        _higherEQDeductible = true
      }




    }
  }
}