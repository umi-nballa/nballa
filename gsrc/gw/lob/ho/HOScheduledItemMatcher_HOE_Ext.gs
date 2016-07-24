package gw.lob.ho
uses gw.api.logicalmatch.AbstractEffDatedPropertiesMatcher
uses java.lang.Iterable
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo
/**
 * Created with IntelliJ IDEA.
 * User: adash
 * Date: 7/22/16
 * Time: 6:42 AM
 * To change this template use File | Settings | File Templates.
 */
class HOScheduledItemMatcher_HOE_Ext extends AbstractEffDatedPropertiesMatcher<HOscheduleItem_HOE_Ext>{

  construct(item : HOscheduleItem_HOE_Ext) {
    super(item)
  }

  override property get IdentityColumns() : Iterable<IEntityPropertyInfo> {
    var columns: Iterable<IEntityPropertyInfo>

    if(_entity.homeOwnersCov typeis HOSL_OutboardMotorsWatercraft_HOE_Ext){
       columns = {HOscheduleItem_HOE_Ext.Type.TypeInfo.getProperty("EffectiveDate") as IEntityPropertyInfo,
       HOscheduleItem_HOE_Ext.Type.TypeInfo.getProperty("ItemNum") as IEntityPropertyInfo}
    }

    return columns
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    var columns: Iterable<ILinkPropertyInfo>

          columns = {ScheduledItem_HOE.Type.TypeInfo.getProperty("homeOwnersCov") as ILinkPropertyInfo}


    return columns
  }
}