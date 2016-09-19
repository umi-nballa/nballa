package una.integration.mapping.hpx.businessowners

uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses gw.api.domain.covterm.OptionCovTerm

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/22/16
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXBP7CoverageMapper extends HPXCoverageMapper{
  function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage,  transactions : java.util.List<Transaction>)
                                                                          : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit> {
  // Businessowners Line does not have Scheduled Items
    return null
  }

  override function createCoverableInfo(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.Coverable {
    var coverable = new wsi.schema.una.hpx.hpx_application_request.Coverable()
    var buildingNo = new wsi.schema.una.hpx.hpx_application_request.BuildingNo()
    if (currentCoverage.OwningCoverable typeis BP7Building) {
      var building = currentCoverage.OwningCoverable as BP7Building
      if (building?.Building?.BuildingNum != null) {
        buildingNo.setText(building.Building.BuildingNum)
        coverable.addChild(buildingNo)
      }
    }
    var locationNo = new wsi.schema.una.hpx.hpx_application_request.LocationNo()
    if (currentCoverage.OwningCoverable typeis BP7Location) {
      var location = currentCoverage.OwningCoverable as BP7Location
      if (location?.Location?.LocationNum != null) {
        locationNo.setText(location.Location.LocationNum)
        coverable.addChild(locationNo)
      }
    }
    var classificationNo = new wsi.schema.una.hpx.hpx_application_request.ClassificationNo()
    if (currentCoverage.OwningCoverable typeis BP7Classification) {
      var classification = currentCoverage.OwningCoverable as BP7Classification
      if (classification?.ClassificationNumber != null) {
        classificationNo.setText(classification?.ClassificationNumber)
        coverable.addChild(classificationNo)
      }
    }
    return coverable
  }

  override function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm) : wsi.schema.una.hpx.hpx_application_request.Limit {
    if(currentCovTerm.PatternCode == "BP7OnPremisesLimit_EXT") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
      var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
      var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
      var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
      var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
      var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
      var coverageSubCd = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
      var formatText = new wsi.schema.una.hpx.hpx_application_request.FormatText()
      amt.setText(0)
      currentTermAmount.addChild(amt)
      limit.addChild(currentTermAmount)
      coverageSubCd.setText(currentCovTerm.PatternCode)
      limit.addChild(coverageSubCd)
      changeAmt.setText(0)
      netChangeAmount.addChild(changeAmt)
      limit.addChild(netChangeAmount)
      formatPct.setText(0)
      limit.addChild(formatPct)
      coverageCd.setText(coverage.PatternCode)
      limit.addChild(coverageCd)
      limitDesc.setText("")
      limit.addChild(limitDesc)
      formatText.setText(currentCovTerm.OptionValue.Description)
      limit.addChild(formatText)
      return limit
    } else {
      return super.createOptionLimitInfo(coverage, currentCovTerm, previousCovTerm)
    }
  }

}