package gw.lob.bp7.schedules

uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class BP7BldgSchedCovItemCovAdapter extends CoverageAdapterBase
{
  var _owner : BP7BldgSchedCovItemCov  
  
  construct(owner : BP7BldgSchedCovItemCov)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.BldgSchedCovItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.BldgSchedCovItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.BldgSchedCovItem
  }

  
  override function addToCoverageArray( clause: Coverage )
  {
    _owner.BldgSchedCovItem.addToCoverages(clause as BP7BldgSchedCovItemCov)
  }

  override function removeFromParent()
  {
    _owner.BldgSchedCovItem.removeCoverageFromCoverable(_owner)
  }


  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return _owner.BranchValue
  }
}
