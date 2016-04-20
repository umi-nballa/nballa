package gw.lob.bp7.location
uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable
uses gw.api.util.JurisdictionMappingUtil

@Export
class BP7LocationCovAdapter extends CoverageAdapterBase
{
  var _owner : BP7LocationCov  
  
  construct(owner : BP7LocationCov)
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

  override function addToCoverageArray( p0: Coverage ) : void
  {
    _owner.Location.addToCoverages( p0 as BP7LocationCov )
  }

  override function removeFromParent() : void
  {
    _owner.Location.removeFromCoverages( _owner )
  }

  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return(_owner.Location.PolicyLocation)
  }
}
