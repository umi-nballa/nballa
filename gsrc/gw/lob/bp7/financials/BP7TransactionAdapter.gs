package gw.lob.bp7.financials

uses gw.api.domain.financials.TransactionAdapter

@Export
class BP7TransactionAdapter implements TransactionAdapter {

  var _owner : BP7Transaction
  
  construct(owner : BP7Transaction) {
    _owner = owner
  }

  override property get Cost() : Cost {
    return _owner.BP7Cost
  }

}