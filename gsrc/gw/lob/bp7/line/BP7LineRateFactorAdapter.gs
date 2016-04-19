package gw.lob.bp7.line

uses gw.api.domain.RateFactorAdapter

@Export
class BP7LineRateFactorAdapter implements RateFactorAdapter {

  var _owner : BP7LineRF
  
  construct(rateFactor : BP7LineRF) {
    _owner = rateFactor
  }

  override property get Modifier() : Modifier {
    return _owner.BP7LineModifier
  }

}