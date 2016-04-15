package gw.lob.ho

uses gw.api.domain.CoverableAdapter
uses java.util.Date
uses java.lang.UnsupportedOperationException
uses gw.api.util.JurisdictionMappingUtil
uses java.util.ArrayList
uses gw.policy.PolicyLineConfiguration

@Export
class DwellingCoverableAdapter_HOE implements CoverableAdapter
{ var _owner : entity.Dwelling_HOE
  construct(owner : entity.Dwelling_HOE) {
   _owner = owner
  }
  override property get AllConditions() : PolicyCondition[] {
    return new PolicyCondition[0]
  }

  override property get AllCoverages() : Coverage[] {
    return _owner.Coverages
  }

  override property get AllExclusions() : Exclusion[] {
   return new Exclusion[0]
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.HOLine
  }

  override property get PolicyLocations() : PolicyLocation[] {
    var locs = new ArrayList<PolicyLocation>()
    locs.add(_owner.HOLocation.PolicyLocation)
    return locs.toTypedArray()
  }
  
  override property get State() : Jurisdiction  {
    return JurisdictionMappingUtil.getJurisdiction(_owner.HOLocation.PolicyLocation)
  }

  override function addCoverage( p0: Coverage ) : void {
    var cov = p0 as DwellingCov_HOE
    _owner.addToCoverages(cov)
    cov.initializeScheduledItemAutoNumberSequence(_owner.Bundle)
  }

  override function removeCoverage( p0: Coverage ) : void {
    _owner.removeFromCoverages( p0 as DwellingCov_HOE )
  }

  override function removeExclusion( p0: Exclusion ) : void {
    throw new UnsupportedOperationException(displaykey.CoverableAdapter.Error.ConditionsNotImplemented)
  }

  override function removeCondition( p0: PolicyCondition ) : void {
    throw new UnsupportedOperationException(displaykey.CoverableAdapter.Error.ConditionsNotImplemented)
  }

  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }

  override property set ReferenceDateInternal( value : Date ) {
     _owner.ReferenceDateInternal = value
  }

  override function addCondition( p0 : PolicyCondition ) {
    throw new UnsupportedOperationException(displaykey.CoverableAdapter.Error.ConditionsNotImplemented)
  }

  override function addExclusion( p0 : Exclusion ) {
    throw new UnsupportedOperationException(displaykey.CoverableAdapter.Error.ConditionsNotImplemented)
  }

  override property get DefaultCurrency() : Currency {
    return _owner.PreferredCoverageCurrency
  }

  override property get AllowedCurrencies() : List<Currency> {
    return PolicyLineConfiguration.getByLine(InstalledPolicyLine.TC_HO).AllowedCurrencies
  }
}
