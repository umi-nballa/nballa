package gw.lob.ho

uses gw.api.logicalmatch.AbstractEffDatedPropertiesMatcher
uses java.lang.Iterable
uses gw.entity.IEntityPropertyInfo
uses gw.entity.ILinkPropertyInfo

@Export
class CoveredLocationMatcher_HOE extends AbstractEffDatedPropertiesMatcher<CoveredLocation_HOE>{

  construct(loc : CoveredLocation_HOE) {
    super(loc)
  }

  override property get IdentityColumns() : Iterable<IEntityPropertyInfo> {
    return {}
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {CoveredLocation_HOE.Type.TypeInfo.getProperty("HOLineCov") as ILinkPropertyInfo,
      CoveredLocation_HOE.Type.TypeInfo.getProperty("PolicyLocation") as ILinkPropertyInfo}
  }
}
