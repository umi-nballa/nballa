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

  override property get Coverage() : Coverage{
    var result : Coverage

    if(HOCostType_Ext.TF_SECTIONIDEDCOSTS.TypeKeys.contains(this.Cost.HOCostType)){
      result = super._owner.Branch.HomeownersLine_HOE.AllCoverages.singleWhere( \ cov -> cov.PatternCode == "HODW_SectionI_Ded_HOE")
    }

    return result
  }
  
}
