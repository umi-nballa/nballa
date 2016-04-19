package gw.lob.bp7.classification
uses gw.api.domain.CoverableAdapter
uses java.util.Date
uses gw.policy.PolicyLineConfiguration

@Export
class BP7ClassificationCoverableAdapter implements CoverableAdapter {
  var _owner : BP7Classification
  
  construct(owner : BP7Classification) {
    _owner = owner
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.Building.Location.Line
  }

  override property get PolicyLocations() : PolicyLocation[] {
    return (null)
  }

  override property get State() : Jurisdiction{
    return (_owner.Building.CoverableState)
  }

  override property get AllCoverages() : Coverage[] {
    return _owner.Coverages
  }

  override function addCoverage( p0: Coverage ) : void {
    _owner.addToCoverages( p0 as BP7ClassificationCov )
  }

  override function removeCoverage( p0: Coverage ) : void {
    _owner.removeFromCoverages( p0 as BP7ClassificationCov )
  }

  override property get AllExclusions() : Exclusion[] {
    return _owner.Exclusions
  }

  override function addExclusion( p0: Exclusion ) : void {
    _owner.addToExclusions( p0 as BP7ClassificationExcl )
  }

  override function removeExclusion( p0: Exclusion ) : void {
    _owner.removeFromExclusions( p0 as BP7ClassificationExcl )
  }
  override property get AllConditions() : PolicyCondition[] {
    return _owner.Conditions
  }

  override function addCondition( p0: PolicyCondition ) : void {
    _owner.addToConditions( p0 as BP7ClassificationCond )
  }

  override function removeCondition( p0: PolicyCondition ) : void {
    _owner.removeFromConditions( p0 as BP7ClassificationCond )
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
