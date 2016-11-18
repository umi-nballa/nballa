package gw.lob.cp

uses gw.api.logicalmatch.AbstractEffDatedPropertiesMatcher

uses java.lang.Iterable
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 7/22/16
 * Time: 6:42 AM
 * To change this template use File | Settings | File Templates.
 */
class CPScheduledItemMatcher_CP_Ext  extends AbstractEffDatedPropertiesMatcher<CPscheduleItem_CP_Ext>{

  construct(item : CPscheduleItem_CP_Ext) {
    super(item)
  }

  override property get IdentityColumns() : Iterable<IEntityPropertyInfo> {
    var columns: Iterable<IEntityPropertyInfo>

    if(_entity.cpbuildingcov typeis CPOptionalOutdoorProperty_EXT){
       columns = {CPscheduleItem_CP_Ext.Type.TypeInfo.getProperty("CPOptionalOutdoorPropertyLimit_Ext") as IEntityPropertyInfo,
       CPscheduleItem_CP_Ext.Type.TypeInfo.getProperty("CPOptionalOutdoorPropertyDesc_Ext") as IEntityPropertyInfo}
    }

    if(_entity.cpbuildingcov typeis CPWindstormProtectiveDevices_EXT){
      columns = {CPscheduleItem_CP_Ext.Type.TypeInfo.getProperty("WindstormDesc_EXT") as IEntityPropertyInfo}
    }

    if(_entity.cpbuildingcov typeis CPProtectiveSafeguards_EXT){
      columns = {CPscheduleItem_CP_Ext.Type.TypeInfo.getProperty("CPProtectiveSafeguard_EXT") as IEntityPropertyInfo}
    }

    return columns
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    var columns: Iterable<ILinkPropertyInfo>

          columns = {CPscheduleItem_CP_Ext.Type.TypeInfo.getProperty("commerciallinecov") as ILinkPropertyInfo}


    return columns
  }
}