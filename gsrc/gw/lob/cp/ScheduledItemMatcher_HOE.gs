package gw.lob.cp

uses gw.api.logicalmatch.AbstractEffDatedPropertiesMatcher
uses java.lang.Iterable
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo

uses java.lang.Iterable

@Export
class ScheduledItemMatcher_HOE extends AbstractEffDatedPropertiesMatcher<ScheduledItem_HOE>{

  construct(item : ScheduledItem_HOE) {
    super(item)
  }

  override property get IdentityColumns() : Iterable<IEntityPropertyInfo> { 
    var columns: Iterable<IEntityPropertyInfo>
    
    if(_entity.DwellingCov typeis HODW_PersonalPropertyOffResidence_HOE){
      columns = {}
    }else if(_entity.Description != null){
      columns = {ScheduledItem_HOE.Type.TypeInfo.getProperty("Description") as IEntityPropertyInfo}
    }else{
      // don't match
      columns = {ScheduledItem_HOE.Type.TypeInfo.getProperty("EffectiveDate") as IEntityPropertyInfo, 
        ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber") as IEntityPropertyInfo}
    }
    
    return columns
  }
  
  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    var columns: Iterable<ILinkPropertyInfo>
    
    if(_entity.DwellingCov typeis HODW_PersonalPropertyOffResidence_HOE){
      columns = {ScheduledItem_HOE.Type.TypeInfo.getProperty("DwellingCov") as ILinkPropertyInfo, 
        ScheduledItem_HOE.Type.TypeInfo.getProperty("PolicyLocation") as ILinkPropertyInfo}
    }else{
      columns = {ScheduledItem_HOE.Type.TypeInfo.getProperty("DwellingCov") as ILinkPropertyInfo}
    }
    
    return columns
  }
}
