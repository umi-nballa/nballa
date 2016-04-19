package gw.lob.bp7.financials

@Export
abstract class BP7AbstractCostMethods<T extends BP7Cost> implements BP7CostMethods {

  protected var _owner : T as readonly Cost

  construct(owner : T) {
    _owner = owner
  }
}