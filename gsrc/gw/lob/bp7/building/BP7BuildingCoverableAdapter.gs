package gw.lob.bp7.building

uses gw.api.domain.CoverableAdapter
uses java.util.Date
uses gw.policy.PolicyLineConfiguration

@Export
class BP7BuildingCoverableAdapter implements CoverableAdapter {
  var _owner : BP7Building
  
  construct(owner : BP7Building) {
    _owner = owner
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.Location.Line
  }

  override property get PolicyLocations() : PolicyLocation[] {
    return {_owner.Building.PolicyLocation}
  }

  override property get State() : Jurisdiction{
    return (_owner.Location.CoverableState)
  }

  override property get AllCoverages() : Coverage[] {
    return _owner.Coverages
  }

  override function addCoverage( p0: Coverage ) : void {
    _owner.addToCoverages( p0 as BP7BuildingCov )
  }

  override function removeCoverage( p0: Coverage ) : void {
    _owner.removeFromCoverages( p0 as BP7BuildingCov )
  }

  override property get AllExclusions() : Exclusion[] {
    return _owner.Exclusions
  }

  override function addExclusion( p0: Exclusion ) : void {
    _owner.addToExclusions( p0 as BP7BuildingExcl )
  }

  override function removeExclusion( p0: Exclusion ) : void {
    _owner.removeFromExclusions( p0 as BP7BuildingExcl )
  }
  override property get AllConditions() : PolicyCondition[] {
    return _owner.Conditions
  }

  override function addCondition( p0: PolicyCondition ) : void {
    _owner.addToConditions( p0 as BP7BuildingCond )
  }

  override function removeCondition( p0: PolicyCondition ) : void {
    _owner.removeFromConditions( p0 as BP7BuildingCond )
  }

  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }
  
  override property set ReferenceDateInternal( date : Date )  {
    _owner.ReferenceDateInternal = date
  }

  override property get DefaultCurrency() : Currency {
    return _owner.Location.PreferredCoverageCurrency
  }

  override property get AllowedCurrencies() : List<Currency> {
    return PolicyLineConfiguration.getByLine(InstalledPolicyLine.TC_BP7).AllowedCurrencies
  }
}
