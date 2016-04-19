package gw.lob.bp7.line

uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class BP7LineCovCoverageAdapter extends CoverageAdapterBase {

  var _owner : BP7LineCov

  construct(owner : BP7LineCov) {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction {
    return _owner.BP7Line.BaseState
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.BP7Line
  }

  override property get OwningCoverable() : Coverable {
    return _owner.BP7Line
  }

  override function addToCoverageArray(cov : Coverage) {
    _owner.BP7Line.addToBP7LineCoverages(cov as BP7LineCov)
  }

  override function removeFromParent() {
    _owner.BP7Line.removeFromBP7LineCoverages(_owner)
  }

  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return _owner.BranchValue
  }

}