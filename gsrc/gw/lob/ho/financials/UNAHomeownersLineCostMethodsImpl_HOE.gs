package gw.lob.ho.financials
@Export
class UNAHomeownersLineCostMethodsImpl_HOE extends GenericHOCostMethodsImpl_HOE<HomeownersLineCost_EXT> {

  construct( owner : HomeownersLineCost_EXT )
  {
    super( owner )
  }

  override property get State() : Jurisdiction {
    return Cost.HomeownersLine.BaseState
  }
  
}
