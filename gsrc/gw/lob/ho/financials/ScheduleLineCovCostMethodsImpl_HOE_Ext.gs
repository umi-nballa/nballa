package gw.lob.ho.financials

@Export

class ScheduleLineCovCostMethodsImpl_HOE_Ext extends GenericHOCostMethodsImpl_HOE<ScheduleLineCovCost_HOE_Ext>{

  construct( owner : ScheduleLineCovCost_HOE_Ext )
  {
    super( owner )
  }

  override property get Coverage() : Coverage
  {
    return Cost.HomeownersLineCov
  }

  override property get State() : Jurisdiction {
    return Cost.HomeownersLine.BaseState
  }

}
