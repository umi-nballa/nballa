package gw.lob.bp7.financials
uses java.util.Date
uses java.math.BigDecimal

class BP7TxDisplayableImpl extends BP7CostDisplayableImpl {

  var _transaction : BP7Transaction

  construct(transaction : BP7Transaction) {
    super(transaction.Cost as BP7Cost)
    _transaction = transaction
  }

  override property get DisplayEffectiveDate() : Date {
    return _transaction.EffDate
  }

  override property get DisplayExpirationDate() : Date {
    return _transaction.ExpDate
  }

  override property get DisplayActualAmount() : BigDecimal {
    return _transaction.Amount
  }
  
  override property get DisplayProration() : double {
    return _transaction.Proration
  }
}
