package gw.lob.bp7.financials

uses gw.api.domain.financials.CostAdapter

@Export
class BP7CostAdapter implements CostAdapter {

  var _owner : BP7Cost

  construct(owner : BP7Cost) {
    _owner = owner
  }

  override function createTransaction(branch : PolicyPeriod) : Transaction {
    var transaction = new BP7Transaction(branch, branch.PeriodStart, branch.PeriodEnd)
    transaction.BP7Cost = _owner.Unsliced
    return transaction
  }

  override property get Reinsurable() : Reinsurable {
    if (_owner.Coverage == null) {
      return null
    }
    var rCov = _owner.Coverage.ReinsurableCoverable
    var candidates = rCov.Reinsurables.where(\ r -> r.CoverageGroup == _owner.Coverage.RICoverageGroupType)
    return candidates.HasElements ? candidates.single() : null
  }

  override property get NameOfCoverable() : String {
    return _owner.Coverable.DisplayName
  }

  override function isMatchingBean(bean : KeyableBean) : boolean {
    return false
  }

  override property get Coverable() : Coverable {
    return _owner.OwningCoverable
  }

  override property get PolicyLine(): gw.pc.policy.lines.entity.PolicyLine {
    return _owner.Line
  }
}