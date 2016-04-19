package gw.lob.bp7.building

uses gw.coverage.ExclusionAdapterBase

@Export
class BP7BuildingExclAdapter extends ExclusionAdapterBase
{
  var _owner : BP7BuildingExcl  
  
  construct(owner : BP7BuildingExcl)
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

  override function addToExclusionArray( p0: Exclusion ) : void
  {
    _owner.Building.addToExclusions( p0 as BP7BuildingExcl )
  }

  override function removeFromParent() : void
  {
    _owner.Building.removeFromExclusions( _owner )
  }

}
