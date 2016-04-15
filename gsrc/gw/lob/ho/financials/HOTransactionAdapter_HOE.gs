package gw.lob.ho.financials
uses gw.api.domain.financials.TransactionAdapter

@Export
class HOTransactionAdapter_HOE implements TransactionAdapter
{ var _owner : entity.HOTransaction_HOE
  construct(owner : HOTransaction_HOE)
  {
    _owner = owner
  }

  override property get Cost() : Cost
  {
    return _owner.HomeownersCost
  }

}
