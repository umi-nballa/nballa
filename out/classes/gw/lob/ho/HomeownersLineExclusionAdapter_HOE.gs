package gw.lob.ho
uses gw.coverage.ExclusionAdapterBase

class HomeownersLineExclusionAdapter_HOE extends ExclusionAdapterBase {
  
  var _owner :entity.HomeownersLineExcl_HOE
  
  construct(owner :entity.HomeownersLineExcl_HOE) {
      super(owner)
      _owner = owner
  }

  override property get CoverageState() : Jurisdiction {
    return (_owner.HOLine.BaseState)
  }

  override property get OwningCoverable() : Coverable {
    return (_owner.HOLine)
  }

  override property get PolicyLine() : PolicyLine {
    return (_owner.HOLine)
  }

  override function removeFromParent() : void {
    _owner.HOLine.removeExclusionFromCoverable( _owner )
  }

  override function addToExclusionArray( p0: Exclusion ) : void {
   _owner.HOLine.addToHOLineExclusions( p0 as HomeownersLineExcl_HOE ) 
  }

}
