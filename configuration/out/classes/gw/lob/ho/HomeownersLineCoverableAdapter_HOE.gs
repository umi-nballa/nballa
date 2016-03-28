package gw.lob.ho

uses gw.api.domain.CoverableAdapter
uses entity.HomeownersLine_HOE
uses java.util.Date
uses gw.policy.PolicyLineConfiguration

@Export
class HomeownersLineCoverableAdapter_HOE implements CoverableAdapter {
  
  var _owner : entity.HomeownersLine_HOE
  construct(owner : entity.HomeownersLine_HOE) {
    _owner = owner
  }

  override property get AllConditions() : PolicyCondition[] {
    return _owner.HOLineConditions
  }

  override property get AllCoverages() : Coverage[]  {
    return _owner.HOLineCoverages
  }

  override property get AllExclusions() : Exclusion[] {
    return _owner.HOLineExclusions
  }

  override property get PolicyLine() : PolicyLine {
    return _owner
  }

  override property get ReferenceDateInternal() : Date {
    return _owner.ReferenceDateInternal
  }

  override property set ReferenceDateInternal( date : Date ) : void{
    _owner.ReferenceDateInternal = date
  }

  override property get PolicyLocations() : PolicyLocation[] {
    return _owner.Branch.PolicyLocations
  }

  override property get State() : Jurisdiction  {
    return _owner.BaseState
  }

  override function addCondition( p0 : PolicyCondition ): void {
    _owner.addToHOLineConditions( p0 as HomeownersLineCond_HOE )
  }

  override function addCoverage( p0 : Coverage ) : void{
    var cov = p0 as HomeownersLineCov_HOE
    _owner.addToHOLineCoverages(cov)
    cov.initializeCoveredLocationAutoNumberSequence(_owner.Bundle)
  }

  override function removeCoverage( p0 : Coverage ): void {
    _owner.removeFromHOLineCoverages( p0 as HomeownersLineCov_HOE)
  }

  override function addExclusion( p0 : Exclusion ): void {
    _owner.addToHOLineExclusions( p0 as HomeownersLineExcl_HOE )
  }

  override function removeExclusion( p0 : Exclusion ) : void {
    _owner.removeFromHOLineExclusions( p0 as HomeownersLineExcl_HOE )
  }

  override function removeCondition( p0 : PolicyCondition ) {
     _owner.removeFromHOLineConditions( p0 as HomeownersLineCond_HOE )
  }

  override property get DefaultCurrency() : Currency {
    return _owner.Branch.PreferredCoverageCurrency
  }

  override property get AllowedCurrencies() : List<Currency> {
    return PolicyLineConfiguration.getByLine(InstalledPolicyLine.TC_HO).AllowedCurrencies
  }

}
