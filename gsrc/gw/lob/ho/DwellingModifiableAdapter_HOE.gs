package gw.lob.ho

uses gw.api.domain.ModifiableAdapter
uses java.util.Date
uses gw.api.util.JurisdictionMappingUtil

@Export
class DwellingModifiableAdapter_HOE implements ModifiableAdapter { 
  
  var _owner : entity.Dwelling_HOE
  construct(owner : entity.Dwelling_HOE) {
    _owner = owner
  }

  override property get AllModifiers() : Modifier[] {
    return _owner.DwellingModifiers
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.HOLine
  }

  override property get State() : Jurisdiction {
    return JurisdictionMappingUtil.getJurisdiction(_owner.HOLocation.PolicyLocation)
  }

  override function addToModifiers( p0: Modifier ) : void {
    _owner.addToDwellingModifiers( p0 as DwellingModifier_HOE )
  }

  override function removeFromModifiers( p0: Modifier ) : void  {
    _owner.removeFromDwellingModifiers( p0 as DwellingModifier_HOE )
  }

  override function createRawModifier() : Modifier {
    return new DwellingModifier_HOE( _owner.HOLine.Branch)
  }

  override function postUpdateModifiers() : void {
    //## todo: Implement me
  }

  override property get PolicyPeriod() : PolicyPeriod {
    return PolicyLine.Branch
  }

  override property get ReferenceDateInternal() : Date  {
    return _owner.ReferenceDateInternal
  }

  override property set ReferenceDateInternal( date : Date ): void  {
    _owner.ReferenceDateInternal = date
  }

}
