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
                                                                          : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
  // Businessowners Line does not have Scheduled Items
    return null
  }

  override function createCoverableInfo(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    var coverable = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType()
    if (currentCoverage.OwningCoverable typeis BP7Building) {
      var building = currentCoverage.OwningCoverable as BP7Building
      coverable.BuildingNo = building?.Building?.BuildingNum != null ? building.Building.BuildingNum : ""
    }
    else if (currentCoverage.OwningCoverable typeis BP7Location) {
      var location = currentCoverage.OwningCoverable as BP7Location
      coverable.LocationNo = location?.Location?.LocationNum != null ? location.Location.LocationNum : ""
    }
    if (currentCoverage.OwningCoverable typeis BP7Classification) {
      var classification = currentCoverage.OwningCoverable as BP7Classification
      classification.ClassificationNumber = classification?.ClassificationNumber != null ?  classification.ClassificationNumber : ""
    }
    return coverable
  }

  override function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(currentCovTerm.PatternCode == "BP7OnPremisesLimit_EXT") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.FormatText = currentCovTerm.OptionValue.Description != null ? currentCovTerm.OptionValue.Description : ""
      limit.LimitDesc = ""
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      return limit
    } else {
      return super.createOptionLimitInfo(coverage, currentCovTerm, previousCovTerm)
    }
  }

}