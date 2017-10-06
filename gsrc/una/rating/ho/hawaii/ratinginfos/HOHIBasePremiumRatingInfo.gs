package una.rating.ho.hawaii.ratinginfos

uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses una.rating.util.HONumberOfFamiliesMapper

/**
 * Created with IntelliJ IDEA.
 * User: ssok
 * Date: 12/9/16
 * Time: 1:15 PM
 * To change this template use File | Settings | File Templates.
 */
class HOHIBasePremiumRatingInfo extends HOCommonBasePremiumRatingInfo{

  var _protectionClass: int as ProtectionClass
  var _protectiveDevices : boolean as ProtectiveDevices = false


  construct(dwelling: Dwelling_HOE) {
    super(dwelling)

    if(dwelling?.ResidenceType == ResidenceType_HOE.TC_TOWNHOUSEROWHOUSE_EXT){
      if(dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_PRIM){
        if(dwelling?.Occupancy == typekey.DwellingOccupancyType_HOE.TC_OWNER){
          TownHouseOrRowhouseUsage = TC_OwnerPrimary
        } else if(dwelling?.Occupancy == typekey.DwellingOccupancyType_HOE.TC_NONOWN){
          TownHouseOrRowhouseUsage = TC_TenantPrimary
        }
      } else if(dwelling?.DwellingUsage == typekey.DwellingUsage_HOE.TC_SEC and dwelling?.Occupancy == typekey.DwellingOccupancyType_HOE.TC_NONOWN){
        TownHouseOrRowhouseUsage = TC_TenantSeasonal
      }
      NumberOfFamilies = HONumberOfFamiliesMapper.getNumberOfFamilies(dwelling.ResidenceType)
      if(TownHouseOrRowhouseUsage != null){
        TownHouseOrRowHouse = true
      }
    }

    _protectionClass = dwelling?.HOLocation?.OverrideDwellingPCCode_Ext? dwelling?.HOLocation?.DwellingPCCodeOverridden_Ext.Code.toInt() : dwelling?.HOLocation?.DwellingProtectionClassCode.toInt()

  }


}