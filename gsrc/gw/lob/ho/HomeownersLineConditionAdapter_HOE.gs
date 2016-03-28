package gw.lob.ho
uses gw.coverage.ConditionAdapterBase

class HomeownersLineConditionAdapter_HOE extends ConditionAdapterBase   {
  
  var _owner :entity.HomeownersLineCond_HOE
  
  construct(owner:entity.HomeownersLineCond_HOE ) {
      super(owner)
      _owner = owner
  }

  override property get CoverageState() : Jurisdiction  {
    return _owner.HOLine.BaseState
  }

  override property get OwningCoverable() : Coverable  {
    return _owner.HOLine
  }

  override property get PolicyLine() : PolicyLine  {
    return _owner.HOLine
  }

  override function removeFromParent(): void {
    _owner.HOLine.removeConditionFromCoverable( _owner )
  }

  override function addToConditionArray( p0 : PolicyCondition ):void {
    _owner.HOLine.addToHOLineConditions( p0 as HomeownersLineCond_HOE ) 
  }

}
