package gw.lob.bp7.location
uses gw.api.domain.CoverableAdapter
uses java.util.Date
uses gw.api.util.JurisdictionMappingUtil
uses gw.policy.PolicyLineConfiguration

@Export
class BP7LocationCoverableAdapter implements CoverableAdapter {
  var _owner : BP7Location
  
  construct(owner : BP7Location) {
    _owner = owner
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.Line
  }

  override property get PolicyLocations() : PolicyLocation[] {
    return (new PolicyLocation[] {_owner.PolicyLocation})
  }

  override property get State() : Jurisdiction{
    return (JurisdictionMappingUtil.getJurisdiction(_owner.PolicyLocation))
  }

  override property get AllCoverages() : Coverage[] {
    return _owner.Coverages
  }

  override function addCoverage( p0: Coverage ) : void {
    _owner.addToCoverages( p0 as BP7LocationCov )
  }

  override function removeCoverage( p0: Coverage ) : void {
    _owner.removeFromCoverages( p0 as BP7LocationCov )
  }

  override property get AllExclusions() : Exclusion[] {
    return _owner.Exclusions
  }

  override function addExclusion( p0: Exclusion ) : void {
    _owner.addToExclusions( p0 as BP7LocationExcl )
  }

  override function removeExclusion( p0: Exclusion ) : void {
    _owner.removeFromExclusions( p0 as BP7LocationExcl )
  }
  override property get AllConditions() : PolicyCondition[] {
    return _owner.Conditions
  }

  override function addCondition( p0: PolicyCondition ) : void {
    _owner.addToConditions( p0 as BP7LocationCond )
  }

  override function removeCondition( p0: PolicyCondition ) : void {
    _owner.removeFromConditions( p0 as BP7LocationCond )
  }

  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }
  
  override property set ReferenceDateInternal( date : Date )  {
    _owner.ReferenceDateInternal = date
  }

  override property get DefaultCurrency() : Currency {
    return _owner.Branch.PreferredCoverageCurrency
  }

  override property get AllowedCurrencies() : List<Currency> {
    return PolicyLineConfiguration.getByLine(InstalledPolicyLine.TC_BP7).AllowedCurrencies
  }
}
