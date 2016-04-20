package gw.lob.bp7.line

uses java.lang.Iterable
uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractRateFactorMatcher

@Export
class BP7LineRateFactorMatcher extends AbstractRateFactorMatcher<BP7LineRF> {

  construct(owner : BP7LineRF) {
    super(owner)
  }

  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {
      BP7LineRF#BP7LineModifier.PropertyInfo as ILinkPropertyInfo
    }
  }

}