package gw.lob.ho
uses gw.api.domain.ModifierAdapter

@Export
class HomeownersModifierAdapter_HOE implements ModifierAdapter
{
  var _owner : HomeownersModifier_HOE

  construct(modifier : HomeownersModifier_HOE) {
    _owner = modifier
  }

  override property get OwningModifiable() : Modifiable {
    return _owner.HOLine
  }

  override property get RateFactors() : RateFactor[] {
    return _owner.HomeownersRateFactors
  }

  override function addToRateFactors(element : RateFactor) {
    _owner.addToHomeownersRateFactors(element as HomeownersRateFactor_HOE)
  }

  override function removeFromRateFactors(element : RateFactor) {
    _owner.removeFromHomeownersRateFactors(element as HomeownersRateFactor_HOE)
  }

  override function createRawRateFactor() : RateFactor {
    return new HomeownersRateFactor_HOE(_owner.HOLine.Branch)
  }
}
