package edge.capabilities.quote.quoting

uses edge.capabilities.quote.draft.dto.DraftDataDTO
uses edge.capabilities.quote.quoting.util.QuoteUtil
uses edge.di.annotations.ForAllGwNodes

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/30/17
 * Time: 8:03 AM
 * To change this template use File | Settings | File Templates.
 */
class DefaultUNAMultiVersionPlugin implements UNAMultiVersionPlugin {
  @ForAllGwNodes
   construct(){}

  override function createMultiVersion(period: PolicyPeriod, update: DraftDataDTO) {
    if(update.Lobs.Homeowners != null){
      addFloodVersion(period, update)
    }
  }

  private function addFloodVersion(period : PolicyPeriod, update : DraftDataDTO){
    var hoDraftData = update.Lobs.Homeowners

    if(hoDraftData.FloodDefaults!= null){
      var floodVersion = period.Submission.Periods.atMostOneWhere( \ branch -> branch.BranchName == QuoteUtil.HO_FLOOD_BRANCH_NAME)

      if(floodVersion == null){
        floodVersion = period.createDraftMultiVersionJobBranch()
        floodVersion.BranchName = QuoteUtil.HO_FLOOD_BRANCH_NAME
        floodVersion.HomeownersLine_HOE.Dwelling.FloodCoverage_Ext = true
      }

      if(floodVersion.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext == null){
        floodVersion.HomeownersLine_HOE.Dwelling.createCoverage("HODW_FloodCoverage_HOE_Ext")
      }

      floodVersion.HomeownersLine_HOE.Dwelling.HODW_FloodCoverage_HOE_Ext.CovTerms?.each( \ covTerm -> {
        var dtoValue = hoDraftData.FloodDefaults.CoverageTerms?.atMostOneWhere( \ dtoTerm -> dtoTerm.Code == covTerm.PatternCode).Value
        covTerm.setValueFromString(dtoValue)
      })
    }

    period.Submission.SelectedVersion = period.Submission.Periods.atMostOneWhere( \ version -> version.BranchName == QuoteUtil.CUSTOM_BRANCH_NAME) //should be the CUSTOM version
  }
}