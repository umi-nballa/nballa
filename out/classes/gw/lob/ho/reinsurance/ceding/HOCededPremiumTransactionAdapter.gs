package gw.lob.ho.reinsurance.ceding
uses gw.api.reinsurance.RICededPremiumTxnAdapter

class HOCededPremiumTransactionAdapter implements RICededPremiumTxnAdapter {

  protected var _owner : HOCededPremiumTransaction
  construct(owner : HOCededPremiumTransaction) {
    _owner = owner
  }

  override property get RICededPremium() : RICededPremium {
    return _owner.HOCededPremium
  }

  override property get RICededPremiumHistory() : RICededPremiumHistory {
    return _owner.HOCededPremiumHistory
  }
}
