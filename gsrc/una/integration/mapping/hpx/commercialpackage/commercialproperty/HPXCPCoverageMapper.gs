package una.integration.mapping.hpx.commercialpackage.commercialproperty

uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses gw.xml.XmlElement
uses gw.api.domain.covterm.OptionCovTerm
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: HMachin
 * Date: 9/13/16
 * Time: 2:52 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXCPCoverageMapper extends HPXCoverageMapper{
  override function createScheduleList(currentCoverage : Coverage, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    switch (currentCoverage.PatternCode) {
      case "CPWindstormProtectiveDevices_EXT" :
          var cpWindstormProtectiveDevices = createCPWindstormProtectiveDevices(currentCoverage, transactions)
          for (item in cpWindstormProtectiveDevices) { limits.add(item)}
          break
      case "CPProtectiveSafeguards_EXT" :
          var cpProtectiveSafeguards = createCPProtectiveSafeguards(currentCoverage, transactions)
          for (item in cpProtectiveSafeguards) { limits.add(item)}
          break
    }
    return limits
  }

  override function createDeductibleScheduleList(currentCoverage : Coverage, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    return null
  }

  override function createCoverableInfo(currentCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    var coverable = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType()
    if (currentCoverage.OwningCoverable typeis CPBuilding) {
      var building = currentCoverage.OwningCoverable as CPBuilding
      coverable.BuildingNo = building?.Building?.BuildingNum != null ? building.Building.BuildingNum : ""
      coverable.LocationNo = building?.CPLocation?.Location?.LocationNum
    }
    else if (currentCoverage.OwningCoverable typeis CPLocation) {
      var location = currentCoverage.OwningCoverable as CPLocation
      coverable.LocationNo = location?.Location?.LocationNum != null ? location.Location.LocationNum : ""
    }
    return coverable
  }

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage

    switch(typeof cost){
      case CPCost:
          result = cost.Coverage
          break
      case CPBuildingCovCost:
          result = cost.Coverage
          break
      case CPBuildingCovGrp1Cost:
          result = cost.Coverage
          break
      case CPBuildingCovGrp2Cost:
          result = cost.Coverage
          break
    }
    return result
  }

  function createOptionDeductibleInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    if(currentCovTerm.PatternCode == "CPBldgCovHurricaneDeductible_EXT") {
      var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
      deductible.Description = currentCovTerm.Pattern.Description
      var value = currentCovTerm.OptionValue.Value
      var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
      deductible.FormatCurrencyAmt.Amt = getCovTermAmount(value, valueType)
      deductible.FormatPct = getCovTermPercentage(value, valueType)
      deductible.CoverageCd = coverage.PatternCode
      deductible.CoverageSubCd = currentCovTerm.PatternCode
      deductible.DeductibleDesc = (coverage.OwningCoverable as CPBuilding).CPBldgCov.CPBldgCovHurricaneDedType_EXTTerm.DisplayValue
      deductible.FormatText = (coverage.OwningCoverable as CPBuilding).CPBldgCov.CPBldgCovHurricaneDedType_EXTTerm.Value
      deductible.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
      return deductible
    }  else {
      return super.createOptionDeductibleInfo(coverage, currentCovTerm, transactions)
    }
  }

  private function createCPWindstormProtectiveDevices(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CoverageCd = currentCoverage.PatternCode
    limit.CoverageSubCd = ""
    limit.CurrentTermAmt.Amt = 0
    limit.NetChangeAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = "PropertyDescription:" + (currentCoverage.OwningCoverable as CPBuilding).Building.Description +
                      "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) + " |"
    limit.WrittenAmt.Amt = 0
    limits.add(limit)
    return limits
  }

  private function createCPProtectiveSafeguards(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as CPBuilding).CPProtectiveSafeguards_EXT.scheduledItem_Ext
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.CPProtectiveSafeguard_EXT
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = ""
      limit.WrittenAmt.Amt = 0
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.NetChangeAmt.Amt = trx.Cost.ActualAmount.Amount
            break
          }
        }
      }
      var allCosts = currentCoverage.PolicyLine.Costs
      for (cost in allCosts) {
        if(cost typeis ScheduleCovCost_HOE){
          if((cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.WrittenAmt.Amt = cost.ActualAmount.Amount
            break
          }
        }
      }
      limit.addChild(new XmlElement("Coverable", createCoverableInfo(currentCoverage)))
      limits.add(limit)
    }
    return limits
  }
}