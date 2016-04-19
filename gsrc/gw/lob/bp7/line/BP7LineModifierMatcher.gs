package gw.lob.bp7.line

uses java.lang.Iterable
uses gw.entity.ILinkPropertyInfo
uses gw.lob.common.AbstractModifierMatcher

@Export
class BP7LineModifierMatcher extends AbstractModifierMatcher<BP7LineMod> {

  construct(owner : BP7LineMod) {
    super(owner)
  }
  
  override property get ParentColumns() : Iterable<ILinkPropertyInfo> {
    return {
      BP7LineMod#BP7Line.PropertyInfo as ILinkPropertyInfo
    }
  }

}