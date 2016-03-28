package gw.lob.ho

uses gw.api.logicalmatch.AbstractEffDatedPropertiesMatcher
uses java.lang.Iterable
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo

@Export
class DwellingMatcher_HOE extends AbstractEffDatedPropertiesMatcher<Dwelling_HOE>{

  construct(loc : Dwelling_HOE) {
    super(loc)
  }

  override property get IdentityColumns() : Iterable<IEntityPropertyInfo> {
    return {}
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {Dwelling_HOE.Type.TypeInfo.getProperty("HOLocation") as ILinkPropertyInfo,
        Dwelling_HOE.Type.TypeInfo.getProperty("HOLine") as ILinkPropertyInfo}
  }
}