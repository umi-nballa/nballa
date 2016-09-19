package una.rating.ho.group1.ratinginfos

uses una.rating.ho.common.HOCommonBasePremiumRatingInfo
uses una.rating.util.HOConstructionTypeMapper

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 8/10/16
 * Time: 10:52 AM
 */
class HOBasePremiumRatingInfo extends HOCommonBasePremiumRatingInfo{


  var _protectionClassCode : String as ProtectionClassCode
  var _constructionType : String as ConstructionType

  construct(dwelling : Dwelling_HOE){
    super(dwelling)
    _protectionClassCode = dwelling?.HOLocation?.DwellingProtectionClassCode
    _constructionType = dwelling?.ConstructionType.DisplayName
    //temp fix to get the base premium for now
    _constructionType = ConstructionType_HOE.TC_FRAME_EXT.Description
    if(dwelling.HOLine.BaseState == typekey.Jurisdiction.TC_NV){
      _constructionType = HOConstructionTypeMapper.constructionTypeMapperNV(dwelling.ConstructionType).Description
    }
  }
}