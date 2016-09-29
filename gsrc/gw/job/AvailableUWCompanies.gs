package gw.job

@Export
class AvailableUWCompanies {
  var _allCoveredStates : java.util.Set<Jurisdiction> = {}
  var _periodStart : DateTime
  var _period : PolicyPeriod
  var _uwCompanies : UWCompany[]
  
  construct(period : PolicyPeriod) {
    _period = period
  }
  
  property get Value() : UWCompany[] {
    if (hasPeriodStartChanged() or hasAllCoveredStatesChanged()) {
      _periodStart = _period.PeriodStart
      _allCoveredStates = _period.AllCoveredStates
      _uwCompanies = _period.getUWCompaniesForStates(true).toTypedArray().where( \ elt -> elt.Code==typekey.UWCompanyCode.TC_02 || elt.Code==typekey.UWCompanyCode.TC_01)
    }

    if(_period.PrimaryLocation.State==typekey.State.TC_FL)
    {
      _uwCompanies = _uwCompanies.where( \ elt -> elt.Code==typekey.UWCompanyCode.TC_02)
    }
    else
    {
      _uwCompanies= _uwCompanies.where( \ elt -> elt.Code==typekey.UWCompanyCode.TC_01)
    }
    return _uwCompanies
  }

  function hasPeriodStartChanged() : boolean {
    return not (_periodStart == _period.PeriodStart)
  }

  function hasAllCoveredStatesChanged() : boolean {
    var allCoveredStates = _period.AllCoveredStates
    return not (_allCoveredStates.containsAll(allCoveredStates) and allCoveredStates.containsAll(_allCoveredStates))
  }
}
