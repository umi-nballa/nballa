package gw.lob.ho.reinsurance.ceding
uses gw.reinsurance.ceding.AbstractCededPremiumAdapter

class HOCededPremiumAdapter extends AbstractCededPremiumAdapter<HOCededPremium,HOCededPremiumHistory> {
  construct(owner : HOCededPremium) {
    super(owner)
  }

  override property get Cedings() : RICededPremiumTransaction[] {
    return _owner.CedingTransactions
  }

  override property get History(): RICededPremiumHistory[] {
    return _owner.CedingHistory
  }

  override property get Cost() : Cost {
    return _owner.HomeownersCost
  }

  override function createRawCedingTransaction(owner : HOCededPremium, calcHistory : HOCededPremiumHistory) : RICededPremiumTransaction {
    var txn = new HOCededPremiumTransaction(owner.Bundle)
    txn.HOCededPremium = owner
    txn.HOCededPremiumHistory = calcHistory
    
    return txn
  }

  override function createRawHistoryRecord(owner : HOCededPremium) : RICededPremiumHistory {
    var calcHistory = new HOCededPremiumHistory(owner.Bundle)
    calcHistory.HOCededPremium = owner
    
    return calcHistory
  }
}
