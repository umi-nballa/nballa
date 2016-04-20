package gw.lob.bp7.classification
uses gw.coverage.ExclusionAdapterBase

@Export
class BP7ClassificationExclAdapter extends ExclusionAdapterBase
{
  var _owner : BP7ClassificationExcl  
  
  construct(owner : BP7ClassificationExcl)
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

  override function addToExclusionArray( p0: Exclusion ) : void
  {
    _owner.Classification.addToExclusions( p0 as BP7ClassificationExcl )
  }

  override function removeFromParent() : void
  {
    _owner.Classification.removeFromExclusions( _owner )
  }

}
