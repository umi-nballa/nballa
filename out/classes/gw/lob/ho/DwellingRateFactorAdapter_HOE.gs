package gw.lob.ho
uses gw.api.domain.RateFactorAdapter

@Export
class DwellingRateFactorAdapter_HOE implements RateFactorAdapter
{
  var _owner : DwellingRateFactor_HOE
  
  construct(rateFactor : DwellingRateFactor_HOE) {
    _owner = rateFactor
  }

  override property get Modifier() : Modifier {
    return _owner.DwellingModifier
  }
}
