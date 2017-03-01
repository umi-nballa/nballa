package gw.lob.bp7.financials

@Export
class BP7LineCostMethods_Ext extends BP7AbstractCostMethods<BP7LineCost_Ext> {
  construct(owner: BP7LineCost_Ext) {
    super(owner)
  }

  override property get OwningCoverable(): Coverable {
    return _owner.Line
  }

  override property get CostQualifier(): BP7Qualifier {
    return new BP7Qualifier ("/line" + _owner.Line.FixedId.Value + "/" + Cost.BP7CostType.DisplayName)
  }

  override property get Coverage(): Coverage {
    return null
  }
}