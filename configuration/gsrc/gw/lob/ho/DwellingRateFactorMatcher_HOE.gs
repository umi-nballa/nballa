package gw.lob.ho
uses gw.lob.common.AbstractRateFactorMatcher
uses gw.entity.ILinkPropertyInfo
uses java.lang.Iterable

@Export
class DwellingRateFactorMatcher_HOE extends AbstractRateFactorMatcher<DwellingRateFactor_HOE> {
  construct(owner : DwellingRateFactor_HOE) {
    super(owner)
  }
  
  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {DwellingRateFactor_HOE.Type.TypeInfo.getProperty("DwellingModifier_HOE") as ILinkPropertyInfo}
  }
}
