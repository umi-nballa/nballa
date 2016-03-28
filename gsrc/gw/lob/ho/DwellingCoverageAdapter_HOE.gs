package gw.lob.ho
uses gw.coverage.CoverageAdapterBase
uses gw.api.util.JurisdictionMappingUtil
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class DwellingCoverageAdapter_HOE extends CoverageAdapterBase
{ var _owner : entity.DwellingCov_HOE
  construct(owner : entity.DwellingCov_HOE) {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction {
    return JurisdictionMappingUtil.getJurisdiction(_owner.Dwelling.HOLocation.PolicyLocation)
  }

  override property get OwningCoverable() : Coverable {
    return _owner.Dwelling
  }

  override property get PolicyLine() : PolicyLine {
    return _owner.Dwelling.HOLine
  }

  override function removeFromParent() : void {
    _owner.Dwelling.removeCoverageFromCoverable( _owner )
  }

  override function addToCoverageArray( p0: Coverage ) : void {
    _owner.Dwelling.addToCoverages( p0 as DwellingCov_HOE )
  }

  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return typeSafeReinsurableCoverable(_owner.Dwelling.HOLocation.PolicyLocation)
  }
}
