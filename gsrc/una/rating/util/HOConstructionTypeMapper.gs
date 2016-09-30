package una.rating.util
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/15/16
 * This is a mapper class which maps the dwelling construction type to the rate tables construction types.
 */
class HOConstructionTypeMapper {

  static function setConstructionType(constructionType : ConstructionType_HOE, exteriorWallFinish : ExteriorWallFinish_Ext, state : Jurisdiction) : RateTableConstructionType_Ext{
    switch(state){
      case TC_TX:
        return setConstructionTypeForTX(constructionType, exteriorWallFinish)
      case TC_AZ:
      case TC_CA:
      case TC_NV:
        return setConstructionTypeForGroup1(constructionType)
    }
    //we dafault to frame now
    return RateTableConstructionType_Ext.TC_FRAME
  }

  static function setConstructionTypeForTX(constructionType : ConstructionType_HOE, exteriorWallFinish : ExteriorWallFinish_Ext) : RateTableConstructionType_Ext{
    if(constructionType == typekey.ConstructionType_HOE.TC_CONCRETEBLOCK_EXT || constructionType == typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT ||
       constructionType == typekey.ConstructionType_HOE.TC_POUREDCONCRETE_EXT || constructionType == typekey.ConstructionType_HOE.TC_SOLIDBRICKSTONE_EXT ||
       constructionType == typekey.ConstructionType_HOE.TC_S || constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT){
      return RateTableConstructionType_Ext.TC_BRICK
    } else if(constructionType == typekey.ConstructionType_HOE.TC_FRAME_EXT){
      if(exteriorWallFinish == typekey.ExteriorWallFinish_Ext.TC_BRICKSTONEMASONRY)
        return RateTableConstructionType_Ext.TC_BRICKVENEER
      else
        return RateTableConstructionType_Ext.TC_FRAME
    } else{
      return RateTableConstructionType_Ext.TC_NA
    }
  }

  static function setConstructionTypeForGroup1(constructionType : ConstructionType_HOE) : RateTableConstructionType_Ext{
    if(constructionType == typekey.ConstructionType_HOE.TC_CONCRETEBLOCK_EXT || constructionType == typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT ||
       constructionType == typekey.ConstructionType_HOE.TC_POUREDCONCRETE_EXT || constructionType == typekey.ConstructionType_HOE.TC_SOLIDBRICKSTONE_EXT ||
       constructionType == typekey.ConstructionType_HOE.TC_S || constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT){
      return RateTableConstructionType_Ext.TC_MASONRY
    } else if(constructionType == typekey.ConstructionType_HOE.TC_FRAME_EXT){
      return RateTableConstructionType_Ext.TC_FRAME
    } else{
      return RateTableConstructionType_Ext.TC_NA
    }
  }
}