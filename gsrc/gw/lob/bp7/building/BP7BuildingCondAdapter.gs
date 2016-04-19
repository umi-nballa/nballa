package gw.lob.bp7.building

uses gw.coverage.ConditionAdapterBase

@Export
class BP7BuildingCondAdapter extends ConditionAdapterBase
{
  var _owner : BP7BuildingCond  
  
  construct(owner : BP7BuildingCond)
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

  override function addToConditionArray( p0: PolicyCondition ) : void
  {
    _owner.Building.addToConditions( p0 as BP7BuildingCond )
  }

  override function removeFromParent() : void
  {
    _owner.Building.removeFromConditions( _owner )
  }

}
