package gw.lob.bp7.line

uses gw.coverage.ConditionAdapterBase

@Export
class BP7LineCondConditionAdapter extends ConditionAdapterBase {

  var _owner : BP7LineCond  
  
  construct(owner : BP7LineCond) {
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

  override function addToConditionArray(cond : PolicyCondition) {
    _owner.BP7Line.addToBP7LineConditions(cond as BP7LineCond)
  }

  override function removeFromParent() {
    _owner.BP7Line.removeFromBP7LineConditions(_owner)
  }

}