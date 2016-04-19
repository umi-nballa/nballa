package gw.lob.bp7.schedules

uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class BP7LineSchedCovItemCovAdapter extends CoverageAdapterBase
{
  var _owner : BP7LineSchedCovItemCov  
  
  construct(owner : BP7LineSchedCovItemCov)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.LineSchedCovItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.LineSchedCovItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.LineSchedCovItem
  }

  
  override function addToCoverageArray( clause: Coverage )
  {
    _owner.LineSchedCovItem.addToCoverages(clause as BP7LineSchedCovItemCov)
  }

  override function removeFromParent()
  {
    _owner.LineSchedCovItem.removeCoverageFromCoverable(_owner)
  }


  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return(_owner.BranchValue)
  }
}
