package gw.lob.bp7.line

uses gw.coverage.ExclusionAdapterBase

@Export
class BP7LineExclExclusionAdapter extends ExclusionAdapterBase {

  var _owner : BP7LineExcl

  construct(owner : BP7LineExcl) {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction {
    return _owner.BP7Line.BaseState
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.BP7Line
  }

  override property get OwningCoverable() : Coverable {
    return _owner.BP7Line
  }

  override function addToExclusionArray(excl : Exclusion) {
    _owner.BP7Line.addToBP7LineExclusions(excl as BP7LineExcl)
  }

  override function removeFromParent() {
    _owner.BP7Line.removeFromBP7LineExclusions(_owner)
  }

}