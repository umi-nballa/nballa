package una.rating.ho.tx.ratinginfos

uses una.rating.ho.common.HOCommonDwellingRatingInfo
uses java.math.BigDecimal

/**
 * User: bduraiswamy
 * Date: 6/16/16
 * Time: 10:18 AM
 * custom implementation of a gosu class which populates the parameters for the routines for the dwelling level coverages
 * for the homeowners policies.
 */
class HODwellingRatingInfo extends HOCommonDwellingRatingInfo {
  var _otherStructuresIncreasedOrDecreasedLimit: int as OtherStructuresIncreasedOrDecreasedLimit
  var _county: String as County
  var _unitOwnersOutbuildingAndOtherStructuresLimit: BigDecimal as UnitOwnersOutbuildingAndOtherStructuresLimit
  var _increasedLimitsJewelryWatchesFurs: BigDecimal as IncreasedLimitsJewelryWatchesFurs
  var _lossAssessmentLimit: int as LossAssessmentLimit
  var _moldRemediationLimit: String as MoldRemediationLimit

  construct(dwelling: Dwelling_HOE) {
    super(dwelling)


    if (dwelling?.HODW_SpecificOtherStructure_HOE_ExtExists){
      _otherStructuresIncreasedOrDecreasedLimit = (this.OtherStructuresLimit - (this.DwellingLimit * 0.1)) as int
    }

    if (dwelling?.HODW_UnitOwnersOutbuildingCov_HOE_ExtExists){
      if (dwelling.HODW_UnitOwnersOutbuildingCov_HOE_Ext?.HasHODW_UnitOwnersLimit_HOETerm) {
        _unitOwnersOutbuildingAndOtherStructuresLimit = dwelling.HODW_UnitOwnersOutbuildingCov_HOE_Ext?.HODW_UnitOwnersLimit_HOETerm?.Value
      } else {
        _unitOwnersOutbuildingAndOtherStructuresLimit = 0
      }
    }

    if (dwelling?.HODW_SpecialLimitsPP_HOE_ExtExists){
      if (dwelling?.HODW_SpecialLimitsPP_HOE_Ext?.HasHODW_JewelryWatchesFursLimit_HOETerm){
        _increasedLimitsJewelryWatchesFurs = dwelling.HODW_SpecialLimitsPP_HOE_Ext?.HODW_JewelryWatchesFursLimit_HOETerm?.Value
      }
    }

    if (dwelling?.HODW_MoldRemediationCov_HOE_ExtExists){
      _moldRemediationLimit = dwelling?.HODW_MoldRemediationCov_HOE_Ext.HODW_MoldRemedCovLimit_HOETerm.DisplayValue
    }

    _lossAssessmentLimit = (dwelling.HODW_LossAssessmentCov_HOE_ExtExists) ? dwelling.HODW_LossAssessmentCov_HOE_Ext?.HOPL_LossAssCovLimit_HOETerm?.Value.intValue() : 0

    _county = (dwelling?.HOLocation?.PolicyLocation?.County != null) ? dwelling?.HOLocation?.PolicyLocation?.County : ""
  }
}