package gw.lob.bp7.line

uses java.util.Date
uses gw.api.domain.ModifiableAdapter

@Export
class BP7LineModifiableAdapter implements ModifiableAdapter {

  var _owner : BP7BusinessOwnersLine

  construct(owner : BP7BusinessOwnersLine) {
    _owner = owner
  }

  override property get AllModifiers() : Modifier[] {
    return _owner.BP7LineModifiers
  }

  override property get PolicyLine() : PolicyLine {
    return _owner
  }

  override property get PolicyPeriod() : PolicyPeriod {
    return _owner.Branch
  }

  override property get State() : Jurisdiction {
    return _owner.BaseState
  }

  override function addToModifiers(mod : Modifier) {
    _owner.addToBP7LineModifiers(mod as BP7LineMod)
  }

  override function removeFromModifiers(mod : Modifier) {
    _owner.removeFromBP7LineModifiers(mod as BP7LineMod)
  }

  override function createRawModifier() : Modifier {
    return new BP7LineMod(_owner.Branch)
  }

  override function postUpdateModifiers() {
  }

  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }

  override property set ReferenceDateInternal(date : Date) {
    _owner.ReferenceDateInternal = date
  }

}