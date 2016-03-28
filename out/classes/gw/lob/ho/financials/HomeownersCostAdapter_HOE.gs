package gw.lob.ho.financials

uses gw.api.domain.financials.CostAdapter
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class HomeownersCostAdapter_HOE implements CostAdapter
{ var _owner : entity.HomeownersCost_HOE
  construct(owner : entity.HomeownersCost_HOE)
  {
    _owner = owner
  }

  override function createTransaction(branch: PolicyPeriod) : Transaction
  {
    var transaction = new HOTransaction_HOE ( branch, branch.PeriodStart, branch.PeriodEnd )
    transaction.HomeownersCost = _owner.Unsliced
    return transaction

  }

  override property get Reinsurable() : Reinsurable {
    if (_owner.Coverage == null or not _owner.SubjectToRICeding) {
      return null
    }
    
    var rCov : ReinsurableCoverable = _owner.Coverage.ReinsurableCoverable
    var candidates = rCov.Reinsurables.where(\ r -> r.CoverageGroup == _owner.Coverage.RICoverageGroupType)
    return candidates.HasElements ? candidates.single() : null
  }
  
  override property get Coverable() : Coverable {
    if (_owner typeis HomeownersCovCost_HOE) {
      return _owner.HomeownersLine
    } else if (_owner typeis DwellingCovCost_HOE) {
      return _owner.Dwelling
    } else {
      return null
    }
  }

  override property get NameOfCoverable() : String {
    return _owner.DisplayName
  }

  override function isMatchingBean(bean : KeyableBean) : boolean {
    return false
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.HomeownersLine
  }
  
}
