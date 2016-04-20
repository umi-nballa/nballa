package gw.lob.bp7.classification
uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class BP7ClassificationCovAdapter extends CoverageAdapterBase
{
  var _owner : BP7ClassificationCov  
  
  construct(owner : BP7ClassificationCov)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return(_owner.Classification.Building.CoverableState)
  }

  override property get PolicyLine() : PolicyLine
  {
    return(_owner.Classification.Building.Location.Line)
  }

  override property get OwningCoverable() : Coverable
  {
    return(_owner.Classification)
  }

  override function addToCoverageArray( p0: Coverage ) : void
  {
    _owner.Classification.addToCoverages( p0 as BP7ClassificationCov )
  }

  override function removeFromParent() : void
  {
    _owner.Classification.removeFromCoverages( _owner )
  }

  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return(_owner.BranchValue)
  }
}
