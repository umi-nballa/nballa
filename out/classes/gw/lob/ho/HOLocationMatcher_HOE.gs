package gw.lob.ho

uses gw.api.logicalmatch.AbstractEffDatedPropertiesMatcher
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo

uses java.lang.Iterable

/**
 * Matches {@link HOLocation_HOE}s based on the FK to the {@link PolicyLocation}.
 */
@Export
class HOLocationMatcher_HOE extends AbstractEffDatedPropertiesMatcher<HOLocation_HOE> {

  construct(loc : HOLocation_HOE) {
    super(loc)
  }

  override property get IdentityColumns() : Iterable<IEntityPropertyInfo> {
    return {}
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {HOLocation_HOE.Type.TypeInfo.getProperty("PolicyLocation") as ILinkPropertyInfo}
  }
}