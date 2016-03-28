package gw.lob.ho
uses gw.api.domain.ModifiableAdapter
uses entity.HomeownersLine_HOE
uses java.util.Date

class HomeownersModifiableAdapter_HOE implements ModifiableAdapter{
  var _owner : HomeownersLine_HOE
  construct(owner : HomeownersLine_HOE){
    _owner = owner
  }

  override property get AllModifiers() : Modifier[] {
    return _owner.HomeownersModifiers
  }

  override property get PolicyLine() : PolicyLine {
    return _owner
  }
  
  override property get PolicyPeriod() : PolicyPeriod {
    return PolicyLine.Branch
  }

  override property get State() : Jurisdiction {
    return _owner.BaseState
  }

  override function addToModifiers( p0: Modifier ) : void {
    _owner.addToHomeownersModifiers( p0 as HomeownersModifier_HOE )
  }

  override function removeFromModifiers( p0: Modifier ) : void {
    _owner.removeFromHomeownersModifiers( p0 as HomeownersModifier_HOE )
  }

  override function createRawModifier() : Modifier {
    return new HomeownersModifier_HOE(_owner.Branch)
  }

  override function postUpdateModifiers() : void {
    //## todo: Implement me
  }
 
  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }
  
  override property set ReferenceDateInternal( date : Date ) {
    _owner.ReferenceDateInternal = date
  }

}
