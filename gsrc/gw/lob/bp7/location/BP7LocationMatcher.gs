package gw.lob.bp7.location

uses gw.api.logicalmatch.AbstractEffDatedPropertiesMatcher
uses gw.entity.IEntityPropertyInfo
uses java.lang.Iterable
uses gw.entity.ILinkPropertyInfo

class BP7LocationMatcher extends AbstractEffDatedPropertiesMatcher<BP7Location> {
  construct(owner : BP7Location) {
    super(owner)
  }

  override property get IdentityColumns() : Iterable<IEntityPropertyInfo> {
    return {}
  }
  
  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {BP7Location#Location.PropertyInfo as ILinkPropertyInfo}
  }  

}