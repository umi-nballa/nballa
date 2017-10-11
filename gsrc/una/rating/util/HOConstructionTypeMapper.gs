package una.rating.util

/**
 * Created with IntelliJ IDEA.
 * User: bduraiswamy
 * Date: 9/15/16
 * This is a mapper class which maps the dwelling construction type to the rate tables construction types.
 */
class HOConstructionTypeMapper {

  static function setConstructionType(dwelling : Dwelling_HOE, state: Jurisdiction): RateTableConstructionType_Ext {
    if(gw.lob.ho.HODwellingUtil_HOE.getNumStories(dwelling)==typekey.NumberOfStories_HOE.TC_ONEANDHALFSTORIES_EXT || gw.lob.ho.HODwellingUtil_HOE.getNumStories(dwelling)==typekey.NumberOfStories_HOE.TC_TWOSTORIES_EXT ){
      var dwellingConstructionTypeL1 = dwelling.OverrideConstructionType_Ext? dwelling.ConstTypeOverridden_Ext : dwelling.ConstructionType
      var exteriorWallFinishL1 = dwelling.OverrideExteriorWFvalL1_Ext? dwelling.ExteriorWFvalueOverridL1_Ext : dwelling.ExteriorWallFinishL1_Ext
      var dwellingConstructionTypeL2 = dwelling.OverrideConstructionTypeL2_Ext? dwelling.ConstTypeOverriddenL2_Ext : dwelling.ConstructionTypeL2_Ext
      var exteriorWallFinishL2 = dwelling.OverrideExteriorWFvalL2_Ext? dwelling.ExteriorWFvalueOverridL2_Ext : dwelling.ExteriorWallFinishL2_Ext
      switch (state) {
        case TC_TX:
            var returnConstructionType = setConstructionTypeForTX(dwellingConstructionTypeL1, exteriorWallFinishL1)
            if(returnConstructionType == RateTableConstructionType_Ext.TC_FRAME)
              return returnConstructionType
            else
              return setConstructionTypeForTX(dwellingConstructionTypeL2, exteriorWallFinishL2)
        case TC_AZ:
        case TC_CA:
        case TC_NV:
        case TC_FL:
        case TC_NC:
        case TC_SC:
            var returnConstructionType = setConstructionType(dwellingConstructionTypeL1)
            if(returnConstructionType == RateTableConstructionType_Ext.TC_FRAME)
              return returnConstructionType
            else
              return setConstructionType(dwellingConstructionTypeL2)
      }
    } else{
      var dwellingConstructionType = dwelling.OverrideConstructionType_Ext? dwelling.ConstTypeOverridden_Ext : dwelling.ConstructionType
      var exteriorWallFinish = dwelling.OverrideExteriorWFval_Ext? dwelling.ExteriorWFvalueOverridden_Ext : dwelling.ExteriorWallFinish_Ext
      switch (state) {
        case TC_TX:
            return setConstructionTypeForTX(dwellingConstructionType, exteriorWallFinish)
        case TC_AZ:
        case TC_CA:
        case TC_NV:
        case TC_FL:
        case TC_SC:
        case TC_NC:
            return setConstructionType(dwellingConstructionType)
      }
    }
    //we default to frame
    return RateTableConstructionType_Ext.TC_FRAME
  }

  static function setConstructionTypeForTX(constructionType: ConstructionType_HOE, exteriorWallFinish: ExteriorWallFinish_Ext): RateTableConstructionType_Ext {
    if (constructionType == typekey.ConstructionType_HOE.TC_CONCRETEBLOCK_EXT || constructionType == typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT ||
        constructionType == typekey.ConstructionType_HOE.TC_POUREDCONCRETE_EXT || constructionType == typekey.ConstructionType_HOE.TC_SOLIDBRICKSTONE_EXT ||
        constructionType == typekey.ConstructionType_HOE.TC_S || constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT) {
      return RateTableConstructionType_Ext.TC_BRICK
    } else if (constructionType == typekey.ConstructionType_HOE.TC_FRAME_EXT) {
      if (exteriorWallFinish == typekey.ExteriorWallFinish_Ext.TC_BRICKSTONEMASONRY)
        return RateTableConstructionType_Ext.TC_BRICKVENEER
      else
        return RateTableConstructionType_Ext.TC_FRAME
    } else if(constructionType == typekey.ConstructionType_HOE.TC_BRICKMASONRYVENEER){
      return RateTableConstructionType_Ext.TC_BRICKVENEER
    }
    else{
      return RateTableConstructionType_Ext.TC_NA
    }
  }

  static function setConstructionType(constructionType: ConstructionType_HOE): RateTableConstructionType_Ext {
    if (constructionType == typekey.ConstructionType_HOE.TC_CONCRETEBLOCK_EXT || constructionType == typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT ||
        constructionType == typekey.ConstructionType_HOE.TC_POUREDCONCRETE_EXT || constructionType == typekey.ConstructionType_HOE.TC_SOLIDBRICKSTONE_EXT ||
        constructionType == typekey.ConstructionType_HOE.TC_S || constructionType == typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT ||
        constructionType == typekey.ConstructionType_HOE.TC_CONCRETEANDMASONRY || constructionType == typekey.ConstructionType_HOE.TC_BRICKMASONRYVENEER) {
      return RateTableConstructionType_Ext.TC_MASONRY
    } else if (constructionType == typekey.ConstructionType_HOE.TC_FRAME_EXT || constructionType == typekey.ConstructionType_HOE.TC_OTHER) {
      return RateTableConstructionType_Ext.TC_FRAME
    } else {
      return RateTableConstructionType_Ext.TC_NA
    }
  }
}