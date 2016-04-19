package gw.lob.bp7.line

uses java.util.Date
uses java.util.HashSet
uses gw.api.domain.CoverableAdapter
uses gw.policy.PolicyLineConfiguration

@Export
class BP7LineCoverableAdapter implements CoverableAdapter {

  var _owner : BP7BusinessOwnersLine

  construct(owner : BP7BusinessOwnersLine) {
    _owner = owner
  }

  override property get PolicyLine() : PolicyLine {
    return _owner
  }

  override property get State() : Jurisdiction {
    return _owner.BaseState
  }

  override property get PolicyLocations() : PolicyLocation[] {
    var locs = new HashSet<PolicyLocation>()
    locs.addAll((_owner.BP7Locations*.PolicyLocation).toSet())

    return locs.toTypedArray()
  }

  override property get AllCoverages() : Coverage[] {
    return _owner.BP7LineCoverages
  }

  override function addCoverage(cov : Coverage) {
    _owner.addToBP7LineCoverages(cov as BP7LineCov)
  }

  override function removeCoverage(cov : Coverage) {
    _owner.removeFromBP7LineCoverages(cov as BP7LineCov)
  }

  override property get AllExclusions() : Exclusion[] {
    return _owner.BP7LineExclusions
  }

  override function addExclusion(excl : Exclusion) {
    _owner.addToBP7LineExclusions(excl as BP7LineExcl)
  }

  override function removeExclusion(excl : Exclusion) {
    _owner.removeFromBP7LineExclusions(excl as BP7LineExcl)
  }

  override property get AllConditions() : PolicyCondition[] {
    return _owner.BP7LineConditions
  }

  override function addCondition(cond : PolicyCondition) {
    _owner.addToBP7LineConditions(cond as BP7LineCond)
  }

  override function removeCondition(cond : PolicyCondition) {
    _owner.removeFromBP7LineConditions(cond as BP7LineCond)
  }

  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }

  override property set ReferenceDateInternal(date : Date) {
    _owner.ReferenceDateInternal = date
  }

  override property get DefaultCurrency() : Currency {
    return _owner.Branch.PreferredCoverageCurrency
  }

  override property get AllowedCurrencies() : List<Currency> {
    return PolicyLineConfiguration.getByLine(InstalledPolicyLine.TC_BP7).AllowedCurrencies
  }

}
