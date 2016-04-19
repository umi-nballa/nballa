package gw.lob.bp7.line

uses gw.api.domain.ModifierAdapter

@Export
class BP7LineModifierAdapter implements ModifierAdapter {

  var _owner : BP7LineMod

  construct(owner : BP7LineMod) {
    _owner = owner
  }

  override property get OwningModifiable() : Modifiable {
    return _owner.BP7Line
  }

  override property get RateFactors() : RateFactor[] {
    return _owner.LineRateFactors
  }

  override function addToRateFactors(rf : RateFactor) {
    _owner.addToLineRateFactors(rf as BP7LineRF)
  }

  override function createRawRateFactor() : RateFactor {
    return new BP7LineRF(_owner.Branch)
  }

  override function removeFromRateFactors(rf : RateFactor) {
    _owner.removeFromLineRateFactors(rf as BP7LineRF)
  }

}