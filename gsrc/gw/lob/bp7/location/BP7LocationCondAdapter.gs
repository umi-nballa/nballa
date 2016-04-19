package gw.lob.bp7.location
uses gw.coverage.ConditionAdapterBase
uses gw.api.util.JurisdictionMappingUtil

@Export
class BP7LocationCondAdapter extends ConditionAdapterBase
{
  var _owner : BP7LocationCond  
  
  construct(owner : BP7LocationCond)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return(JurisdictionMappingUtil.getJurisdiction(_owner.Location.PolicyLocation))
  }

  override property get PolicyLine() : PolicyLine
  {
    return(_owner.Location.Line)
  }

  override property get OwningCoverable() : Coverable
  {
    return(_owner.Location)
  }

  override function addToConditionArray( p0: PolicyCondition ) : void
  {
    _owner.Location.addToConditions( p0 as BP7LocationCond )
  }

  override function removeFromParent() : void
  {
    _owner.Location.removeFromConditions( _owner )
  }

}
