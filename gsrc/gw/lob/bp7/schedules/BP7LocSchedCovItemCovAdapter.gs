package gw.lob.bp7.schedules

uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class BP7LocSchedCovItemCovAdapter extends CoverageAdapterBase
{
  var _owner : BP7LocSchedCovItemCov  
  
  construct(owner : BP7LocSchedCovItemCov)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.LocSchedCovItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.LocSchedCovItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.LocSchedCovItem
  }
  
  override function addToCoverageArray( clause: Coverage )
  {
    _owner.LocSchedCovItem.addToCoverages(clause as BP7LocSchedCovItemCov)
  }

  override function removeFromParent()
  {
    _owner.LocSchedCovItem.removeCoverageFromCoverable(_owner)
  }


  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return(_owner.BranchValue)
  }
}
