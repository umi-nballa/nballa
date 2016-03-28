package gw.lob.ho
uses gw.api.domain.RateFactorAdapter

@Export
class HomeownersRateFactorAdapter_HOE implements RateFactorAdapter
{
  var _owner : HomeownersRateFactor_HOE
  
  construct(rateFactor : HomeownersRateFactor_HOE) {
    _owner = rateFactor
  }

  override property get Modifier() : Modifier {
    return _owner.HomeownersModifier
  }
}
