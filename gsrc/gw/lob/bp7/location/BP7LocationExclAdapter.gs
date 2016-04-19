package gw.lob.bp7.location
uses gw.coverage.ExclusionAdapterBase
uses gw.api.util.JurisdictionMappingUtil

@Export
class BP7LocationExclAdapter extends ExclusionAdapterBase
{
  var _owner : BP7LocationExcl  
  
  construct(owner : BP7LocationExcl)
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

  override function addToExclusionArray( p0: Exclusion ) : void
  {
    _owner.Location.addToExclusions( p0 as BP7LocationExcl )
  }

  override function removeFromParent() : void
  {
    _owner.Location.removeFromExclusions( _owner )
  }

}
