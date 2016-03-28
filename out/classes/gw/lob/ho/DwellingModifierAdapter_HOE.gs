package gw.lob.ho
uses gw.api.domain.ModifierAdapter

@Export
class DwellingModifierAdapter_HOE implements ModifierAdapter
{
  var _owner : DwellingModifier_HOE

  construct(modifier : DwellingModifier_HOE) {
    _owner = modifier
  }

  override property get OwningModifiable() : Modifiable {
    return _owner.Dwelling
  }

  override property get RateFactors() : RateFactor[] {
    return _owner.DwellingRateFactors
  }

  override function addToRateFactors(element : RateFactor) {
    _owner.addToDwellingRateFactors(element as DwellingRateFactor_HOE)
  }

  override function removeFromRateFactors(element : RateFactor) {
    _owner.removeFromDwellingRateFactors(element as DwellingRateFactor_HOE)
  }

  override function createRawRateFactor() : RateFactor {
    return new DwellingRateFactor_HOE(_owner.Dwelling.Branch)
  }
}
