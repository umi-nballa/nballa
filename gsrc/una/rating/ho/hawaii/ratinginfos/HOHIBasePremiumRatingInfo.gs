package una.rating.ho.hawaii.ratinginfos

uses una.rating.ho.common.HOCommonBasePremiumRatingInfo



/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HOHIBasePremiumRatingInfo extends HOCommonBasePremiumRatingInfo{
  var _dwelling : Dwelling_HOE as Dwelling
  var _townhouseOrRowhouse : boolean as TownHouseOrRowHouse
  var _numberOfFamilies: int as NumberOfFamilies
  var _townhouseUsage : RatingDwellingUsage_Ext as TownHouseOrRowhouseUsage
  construct(dwelling: Dwelling_HOE) {
    super(dwelling)
    _dwelling = dwelling

    if(_dwelling?.ResidenceType == ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT){
      if(_dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_PRIM){
        if(_dwelling?.Occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER){
          _townhouseUsage = TC_OwnerPrimary
        } else if(_dwelling?.Occupancy == typekey.DwellingOccupancyType_HOE.TC_NONOWN){
          _townhouseUsage = TC_TenantPrimary
        }
      } else if( _dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC and _dwelling?.Occupancy == typekey.DwellingOccupancyType_HOE.TC_NONOWN){
        _townhouseUsage = TC_TenantSeasonal
      }
      _numberOfFamilies = dwelling.NumUnitsFireDivision_Ext.toInt()
      if(_townhouseUsage != null){
        _townhouseOrRowhouse = true
      }
    }

    ProtectionClassCode = dwelling?.HOLocation?.OverrideDwellingPCCode_Ext? dwelling?.HOLocation?.DwellingPCCodeOverridden_Ext.Code.toInt() : dwelling?.HOLocation?.DwellingProtectionClassCode.Code.toInt()

  }


}