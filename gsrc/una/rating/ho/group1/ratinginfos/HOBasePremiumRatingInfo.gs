package una.rating.ho.group1.ratinginfos

uses una.rating.ho.common.HOCommonBasePremiumRatingInfo

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
  }
}