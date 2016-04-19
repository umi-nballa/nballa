package gw.lob.bp7.building

uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class BP7BuildingCovAdapter extends CoverageAdapterBase
{
  var _owner : BP7BuildingCov  
  
  construct(owner : BP7BuildingCov)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return(_owner.Building.Location.CoverableState)
  }

  override property get PolicyLine() : PolicyLine
  {
    return(_owner.Building.Location.Line)
  }

  override property get OwningCoverable() : Coverable
  {
    return(_owner.Building)
  }

  override function addToCoverageArray( p0: Coverage ) : void
  {
    _owner.Building.addToCoverages( p0 as BP7BuildingCov )
  }

  override function removeFromParent() : void
  {
    _owner.Building.removeFromCoverages( _owner )
  }

  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return(_owner.BranchValue)
  }
}
