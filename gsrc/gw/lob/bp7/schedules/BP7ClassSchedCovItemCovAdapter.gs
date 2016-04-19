package gw.lob.bp7.schedules

uses gw.coverage.CoverageAdapterBase
uses gw.api.reinsurance.ReinsurableCoverable

@Export
class BP7ClassSchedCovItemCovAdapter extends CoverageAdapterBase
{
  var _owner : BP7ClassSchedCovItemCov  
  
  construct(owner : BP7ClassSchedCovItemCov)
  {
    super(owner)
    _owner = owner
  }

  override property get CoverageState() : Jurisdiction
  {
    return _owner.ClassSchedCovItem.CoverableState
  }

  override property get PolicyLine() : PolicyLine
  {
    return _owner.ClassSchedCovItem.Schedule.PolicyLine
  }

  override property get OwningCoverable() : Coverable
  {
    return _owner.ClassSchedCovItem
  }

  
  override function addToCoverageArray( clause: Coverage )
  {
    _owner.ClassSchedCovItem.addToCoverages(clause as BP7ClassSchedCovItemCov)
  }

  override function removeFromParent()
  {
    _owner.ClassSchedCovItem.removeCoverageFromCoverable(_owner)
  }


  override property get ReinsurableCoverable() : ReinsurableCoverable {
    return(_owner.BranchValue)
  }
}
