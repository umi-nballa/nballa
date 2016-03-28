package gw.lob.ho 
uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class HomeownersLineCoverageAdapter_HOE extends CoverageAdapterBase
{ var _owner:entity.HomeownersLineCov_HOE
  construct(owner:entity.HomeownersLineCov_HOE) {
    super(owner)
    _owner = owner
  }
  override property get CoverageState() : Jurisdiction {
    return _owner.HOLine.BaseState
  }
  override property get PolicyLine() : PolicyLine {
    return _owner.HOLine
  }

  override property get OwningCoverable() : Coverable {
    return _owner.HOLine
  }

  override function addToCoverageArray( p0: Coverage ) : void  {
    _owner.HOLine.addToHOLineCoverages( p0 as HomeownersLineCov_HOE )
  }

  override function removeFromParent() : void  {
    _owner.HOLine.removeFromHOLineCoverages( _owner )
  }

  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return typeSafeReinsurableCoverable(_owner.BranchValue)
  }
}
