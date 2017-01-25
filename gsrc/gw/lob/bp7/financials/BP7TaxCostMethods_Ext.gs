package gw.lob.bp7.financials

@Export
class BP7TaxCostMethods_Ext extends BP7AbstractCostMethods<BP7TaxCost_Ext> {
  construct(owner: BP7TaxCost_Ext) {
    super(owner)
  }

  override property get Coverage(): Coverage {
    return null
  }

  override property get OwningCoverable(): Coverable {
    return _owner.Line
  }

  override property get CostQualifier(): BP7Qualifier {
    return new BP7Qualifier ("/line" + _owner.Line.FixedId.Value +
                             "/" + Coverage.PatternCode)
  }
}