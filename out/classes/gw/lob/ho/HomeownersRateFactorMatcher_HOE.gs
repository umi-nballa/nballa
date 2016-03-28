package gw.lob.ho
uses gw.lob.common.AbstractRateFactorMatcher
uses gw.entity.ILinkPropertyInfo
uses java.lang.Iterable

@Export
class HomeownersRateFactorMatcher_HOE extends AbstractRateFactorMatcher<HomeownersRateFactor_HOE> {
  construct(owner : HomeownersRateFactor_HOE) {
    super(owner)
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {HomeownersRateFactor_HOE.Type.TypeInfo.getProperty("HomeownersModifier_HOE") as ILinkPropertyInfo}
  }
}
