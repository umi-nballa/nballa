package una.integration.mapping.hpx.homeowners

uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.DirectCovTerm
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/22/16
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingCoverageMapper extends HPXCoverageMapper{
  function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)
                                                : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()

    switch (currentCoverage.PatternCode) {
      case "HODW_OtherStructuresOnPremise_HOE" :
        var otherStructuresOnPremises = createOtherStructuresOnPremisesSchedule(currentCoverage, previousCoverage, transactions)
        for (item in otherStructuresOnPremises) { limits.add(item)}
        break
      case "HODW_ScheduledProperty_HOE" :
        var scheduledProperties = createScheduledPropertySchedule(currentCoverage, previousCoverage, transactions)
        for (item in scheduledProperties) { limits.add(item)}
        break
      case "HODW_PersonalPropertyOffResidence_HOE" :
          var scheduledProperties = createPersonalPropertyOnOtherResidences(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "HOLI_AddResidenceRentedtoOthers_HOE" :
          var scheduledProperties = createAdditionalResidencesRentedToOthers(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
    }
    return limits
  }

  override function createDeductibleScheduleList(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    return null
  }

  override function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(currentCovTerm.PatternCode == "HOPL_LossAssCovLimit_HOE") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      var value = currentCovTerm.OptionValue != null ? new BigDecimal(currentCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      limit.CurrentTermAmt.Amt = currentCovTerm.OptionValue.Value != null ? currentCovTerm.OptionValue.Value : 0.00
      limit.NetChangeAmt.Amt = value - orignalValue
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true)
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.WrittenAmt.Amt = 0.00
      return limit
    } else if(currentCovTerm.PatternCode == "HODW_OrdinanceLimit_HOE") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      var value = currentCovTerm.OptionValue != null ? new BigDecimal(currentCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      var period = coverage.PolicyLine.AssociatedPolicyPeriod
      var maxDwelling = period.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm.getMaxAllowedLimitValue(period.HomeownersLine_HOE.Dwelling)
      var maxOrdinance = currentCovTerm.getMaxAllowedLimitValue(period.HomeownersLine_HOE.Dwelling)
      limit.CurrentTermAmt.Amt = currentCovTerm.OptionValue.Value != null ? currentCovTerm.OptionValue.Value * getDwellingCovLimit(coverage): 0.00
      limit.NetChangeAmt.Amt = (value - orignalValue)* getDwellingCovLimit(coverage)
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true) +
                        " | Max : " + maxDwelling * 0.25
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.WrittenAmt.Amt = 0.00
      return limit
    } else {
      return super.createOptionLimitInfo(coverage, currentCovTerm, previousCovTerm, transactions)
    }
  }

  override function createDirectLimitInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(currentCovTerm.PatternCode == "HODW_BuildAddInc_HOE") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      var value = currentCovTerm.Value != null ? new BigDecimal(currentCovTerm.Value as double - getPersonalPropertyLimit(coverage)*0.10).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.Value as double - getPersonalPropertyLimit(coverage)*0.10).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      limit.CurrentTermAmt.Amt = !(value == null || value == "") ? value : 0.00
      limit.NetChangeAmt.Amt = previousCovTerm != null ? value - orignalValue : value
      limit.FormatPct = 0
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.LimitDesc = ""
      limit.FormatText = ""
      limit.WrittenAmt.Amt = 0.00
      return limit
    } else if(currentCovTerm.PatternCode == "HODW_Dwelling_Limit_HOE") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      var value = currentCovTerm.Value != null ? new BigDecimal(currentCovTerm.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      var period = coverage.PolicyLine.AssociatedPolicyPeriod
      var maxDwelling = period.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm.getMaxAllowedLimitValue(period.HomeownersLine_HOE.Dwelling)
      limit.CurrentTermAmt.Amt = currentCovTerm.Value != null ? currentCovTerm.Value : 0.00
      limit.NetChangeAmt.Amt = previousCovTerm != null ? (value - orignalValue) : value
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true) +
          " | Max : " + maxDwelling
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.WrittenAmt.Amt = 0.00
      return limit
    } else {
      return super.createDirectLimitInfo(coverage, currentCovTerm, previousCovTerm, transactions)
    }
  }

  override function createOtherDirectCovTerm(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(coverage.PatternCode == "HOLI_BusinessPursuits_HOE_Ext") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      var value = currentCovTerm.Value != null ? new BigDecimal(currentCovTerm.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      limit.CurrentTermAmt.Amt = currentCovTerm.Value != null ? currentCovTerm.Value : 0.00
      limit.NetChangeAmt.Amt = previousCovTerm != null ? (value - orignalValue) : value
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = currentCovTerm.PatternCode == "HOLI_NumClercEmp_HOE_Ext" and value > 0 ? "Clerical Employees" :
                        currentCovTerm.PatternCode == "HOLI_NumSCMIDSOP_HOE_Ext" and value > 0  ?  "Salesperson, Collector or Messenger, Installation, Demonstration or Servicing Operation" :
                        currentCovTerm.PatternCode == "HOLI_NumTeachers_HOE_Ext" and value > 0  ?  "Teachers a. Laboratory, athletic, manual or physical training" :
                        currentCovTerm.PatternCode == "HOLI_NotOtherwiseclassified_HOE_Ext" and value > 0  ?  "Unclassified" : ""
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.WrittenAmt.Amt = 0.00
      return limit
    } else {
      return super.createOtherDirectCovTerm(coverage, currentCovTerm, previousCovTerm, transactions)
    }
  }

  function createOtherStructuresOnPremisesSchedule(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_OtherStructuresOnPremise_HOE.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.ScheduleType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = item.AdditionalLimit != null ? item.AdditionalLimit.Code : 0
      limit.FormatText = item.rentedtoOthers_Ext != null ? item.rentedtoOthers_Ext : false
      limit.LimitDesc = item.Description != null ? item.Description : ""
      limit.WrittenAmt.Amt = 0.00
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
      limits.add(limit)
    }
    return limits
  }

  function createScheduledPropertySchedule(currentCoverage : Coverage, previousCoverage : Coverage,  transactions : java.util.List<Transaction>)
                                                                            : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_ScheduledProperty_HOE.ScheduledItems
    var costs = transactions.Cost
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.ScheduleType
      limit.CurrentTermAmt.Amt = item.ExposureValue != null ? item.ExposureValue : 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = item.Description != null ? item.Description : ""
      limit.WrittenAmt.Amt = 0.00
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
      limits.add(limit)
    }
    return limits
  }

  function createPersonalPropertyOnOtherResidences(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_PersonalPropertyOffResidence_HOE.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.ScheduleType
      limit.CurrentTermAmt.Amt = item.ExposureValue != null ? item.ExposureValue : 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = item.AdditionalLimit != null ? item.AdditionalLimit : 0
      limit.FormatText = item.rentedtoOthers_Ext != null ? item.rentedtoOthers_Ext : false
      limit.LimitDesc = item.PolicyLocation.DisplayName != null ? item.PolicyLocation.DisplayName : ""
      limit.WrittenAmt.Amt = 0.00
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
      limits.add(limit)
    }
    return limits
  }

  function createAdditionalResidencesRentedToOthers(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as HomeownersLine_HOE).HOLI_AddResidenceRentedtoOthers_HOE.scheduledItem_Ext  //.HOLI_AddResidenceRentedtoOthers_HOE.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = ""
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.FormatText = item.numFamilies
      limit.LimitDesc = item.PolicyLocation.CompactName != null ? "Location : " + item.PolicyLocation.CompactName : ""
      limit.WrittenAmt.Amt = 0.00
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
      limits.add(limit)
    }
    return limits
  }

  function getPersonalPropertyLimit(cov : Coverage) : double {
    var covC = cov.PolicyLine.AllCoverages.where( \ elt -> elt.PatternCode.equals("HODW_Personal_Property_HOE"))
    var limit = covC.CovTerms.where( \ elt -> elt.PatternCode.equals("HODW_PersonalPropertyLimit_HOE"))
    return (limit.first() as DirectCovTerm).Value
  }

  function getDwellingCovLimit(cov : Coverage) : double {
    var covC = cov.PolicyLine.AllCoverages.where( \ elt -> elt.PatternCode.equals("HODW_Dwelling_Cov_HOE"))
    var limit = covC.CovTerms.where( \ elt -> elt.PatternCode.equals("HODW_Dwelling_Limit_HOE"))
    return (limit.first() as DirectCovTerm).Value
  }

  override function createCoverableInfo(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    return null
  }

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage
    switch(typeof cost){
      case HomeownersLineCost_EXT:
          result = cost.Coverage
          break
      case HomeownersCovCost_HOE:
          result = cost.Coverage
          break
      case DwellingCovCost_HOE:
          result = cost.Coverage
          break
      case ScheduleCovCost_HOE:
          result = cost.Coverage
          break
    }
    return result
  }
}