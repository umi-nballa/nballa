package una.rating.ho.group3.ratinginfos

uses java.math.BigDecimal
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 1/27/17
 */
class HOFloodCoverageRatingInfo {

  var _elevationDifference : AbveBlwBaseFldElvtn_Ext as ElevationDifference
  var _floodDwellingLimit  : BigDecimal as FloodDwellingLimit
  var _floodPersonalPropertyLimit : BigDecimal as FloodPersonalPropertyLimit
  var _floodLossOfUseLimit : BigDecimal as FloodLossOfUseLimit
  var _floodRiskType : FloodRiskType_Ext as FloodRiskType
  var _hasBasement : boolean as HasBasement
  var _elevatedRiskCredit : boolean as ElevatedRiskCredit
  var _postFirm : boolean as PostFirm
  var _floodZone : String as FloodZone
  var _floodDeductible : int as FloodDeductible
  var _lossOfUseLimit : BigDecimal as LossOfUseLimit

  construct(floodCov : HODW_FloodCoverage_HOE_Ext){
    var dwelling = floodCov?.Dwelling
    _elevationDifference = dwelling?.AbveBlwBaseFldElvtn_Ext
    _floodRiskType = dwelling?.getFloodRiskTypeValue(dwelling)
    _hasBasement = dwelling?.BasementHome_Ext
    _elevatedRiskCredit = dwelling?.ElevatedRiskCredit_Ext
    _postFirm = dwelling?.PostFIRM_Ext
    _floodZone = dwelling?.OverridePropFloodVal_Ext? dwelling?.PropFloodValOverridden_Ext : dwelling?.PropFloodVal_Ext
    _lossOfUseLimit = dwelling?.HODW_Loss_Of_Use_HOE?.HODW_LossOfUseDwelLimit_HOETerm?.Value

    _floodDwellingLimit = floodCov?.HODW_FloodCov_Dwelling_HOETerm?.Value
    _floodPersonalPropertyLimit = floodCov?.HODW_FllodCovPP_HOETerm?.Value
    _floodLossOfUseLimit = floodCov?.HODW_Lossofuse_HOE_ExtTerm?.Value
    _floodDeductible = floodCov?.HODW_FloodCov_Ded_HOETerm?.Value.intValue()
  }

  property get isUnnumberedAZone() : boolean{
    if(_floodZone.startsWith("A"))
      if(_floodZone != "AE" && _floodZone != "AO" && _floodZone != "AH"){
        var str = _floodZone?.substring(1, _floodZone.length())
        if(!str?.Numeric)
          return true
      }
    return false
  }

}