package una.rating.util
/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/15/16
 * This is a mapper class which maps the construction type of dwelling construction screen to the
 */
class HOConstructionTypeMapper {

  static function constructionTypeMapperTX(constructionType : ConstructionType_HOE, exteriorWallFinish : ExteriorWallFinish_Ext) : RateTableConstructionType_Ext{
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

  static function constructionTypeMapperNV(constructionType : ConstructionType_HOE) : RateTableConstructionType_Ext{
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