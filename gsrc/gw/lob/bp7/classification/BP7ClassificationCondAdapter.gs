package gw.lob.bp7.classification
uses gw.coverage.ConditionAdapterBase

@Export
class BP7ClassificationCondAdapter extends ConditionAdapterBase
{
  var _owner : BP7ClassificationCond  
  
  construct(owner : BP7ClassificationCond)
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

  override function addToConditionArray( p0: PolicyCondition ) : void
  {
    _owner.Classification.addToConditions( p0 as BP7ClassificationCond )
  }

  override function removeFromParent() : void
  {
    _owner.Classification.removeFromConditions( _owner )
  }

}
