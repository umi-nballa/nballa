package una.integration.mapping.hpx.homeowners

uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.DirectCovTerm
uses java.math.BigDecimal
uses una.integration.mapping.hpx.common.HPXRatingHelper

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/22/16
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingCoverageMapper extends HPXCoverageMapper{
  override function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)
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
      case "HODW_AdditionalInsuredSchedResidencePremises" :
          var scheduledProperties = createAdditionalInsuredResidencePremises(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "HODW_AdditionalInsuredSchedProp" :
          var scheduledProperties = createAdditionalInsuredScheduledProperty(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "HODW_AdditionalInsuredSchedDescribedLocation" :
          var scheduledProperties = createAdditionalInsuredDescribedLocation(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "HOLI_AdditionalInsuredSchedPersonalLiability" :
          var scheduledProperties = createAdditionalInsuredPersonalLiability(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "HOLI_AdditionalInsuredSchedPropertyManager" :
          var scheduledProperties = createAdditionalInsuredPropertyManager(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "HODW_ResidenceHeldTrust_NC_HOE_Ext" :
          var scheduledProperties = createResidenceHeldInTrust(currentCoverage, previousCoverage, transactions)
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
    switch (currentCovTerm.PatternCode) {
      case "HOPL_LossAssCovLimit_HOE" :
          return createLossAssessmentLimit(coverage, currentCovTerm, previousCovTerm, transactions)
      case "HODW_OrdinanceLimit_HOE" :
          return createOrdinanceLawLimit(coverage, currentCovTerm, previousCovTerm, transactions)
      case "HODW_AdditionalAmtInsurance_HOE" :
          return createAdditionalDwellingCovLimit(coverage, currentCovTerm, previousCovTerm, transactions)
      default :
        return super.createOptionLimitInfo(coverage, currentCovTerm, previousCovTerm, transactions)
    }
  }

  function createLossAssessmentLimit(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    var value = currentCovTerm.OptionValue != null ? new BigDecimal(currentCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.OptionValue.Value as double).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    limit.CurrentTermAmt.Amt = currentCovTerm.OptionValue.Value != null ? currentCovTerm.OptionValue.Value : 0.00
    limit.NetChangeAmt.Amt = value - orignalValue
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true)
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.WrittenAmt.Amt = 0.00
    return limit
  }

  function createOrdinanceLawLimit(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    var value = currentCovTerm.Value as double
    var pctValue = (value == null || value == "") ? 0 : (value <= 1) ? value*100.00 : 0
    value = (value == null || value == "") ? 0.00 : value > 1 ? new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    var max = currentCovTerm.AvailableOptions.max()
    limit.CurrentTermAmt.Amt = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.FormatPct = pctValue
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true) +
        " | Max: " + max
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.WrittenAmt.Amt = 0.00
    return limit
  }

  function createAdditionalDwellingCovLimit(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    var value = currentCovTerm.Value as double
    var pctValue = (value == null || value == "") ? 0 : (value <= 1) ? value*100.00 : 0
    value = (value == null || value == "") ? 0.00 : value > 1 ? new BigDecimal(value).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
    var max = currentCovTerm.AvailableOptions.max()
    limit.CurrentTermAmt.Amt = 0.00
    limit.NetChangeAmt.Amt = 0.00
    limit.FormatPct = pctValue
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true) +
        " | Max: " + max
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.WrittenAmt.Amt = 0.00
    return limit
  }

  override function createDirectLimitInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, previousCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(currentCovTerm.PatternCode == "HODW_BuildAddInc_HOE") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      var personalPropertyLimit = coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value as double
      var value = currentCovTerm.Value != null ? new BigDecimal(currentCovTerm.Value as double - personalPropertyLimit *0.10).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      var orignalValue = previousCovTerm != null ? new BigDecimal(previousCovTerm.Value as double - personalPropertyLimit*0.10).setScale(2, BigDecimal.ROUND_HALF_UP) : 0.00
      limit.CurrentTermAmt.Amt = !(value == null || value == "") ? value : 0.00
      limit.NetChangeAmt.Amt = previousCovTerm != null ? value - orignalValue : value
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.LimitDesc = ""
      limit.FormatText = ""
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
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = currentCovTerm.PatternCode == "HOLI_NumClercEmp_HOE_Ext" and value > 0 ? "Clerical Employees" :
                        currentCovTerm.PatternCode == "HOLI_NumSCMIDSOP_HOE_Ext" and value > 0  ?  "Salesperson, Collector or Messenger, Installation, Demonstration or Servicing Operation" :
                        currentCovTerm.PatternCode == "HOLI_NumTeachers_HOE_Ext" and value > 0  ?  "Teachers - Laboratory, athletic, manual or physical training" :
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
      limit.Rate = 0.00
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
    var ratingHelper = new HPXRatingHelper()
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
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = item.Description != null ? item.Description : ""
      limit.WrittenAmt.Amt = 0.00
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.NetChangeAmt.Amt = trx.Cost.ActualAmount.Amount
            limit.Rate = ratingHelper.getBaseRate(currentCoverage.PolicyLine.AssociatedPolicyPeriod, trx.Cost.NameOfCoverable)
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
      limit.Rate = 0.00
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
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as HomeownersLine_HOE).HOLI_AddResidenceRentedtoOthers_HOE.CoveredLocations
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = ""
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = item.NumberOfFamilies
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

  function createAdditionalInsuredResidencePremises(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_AdditionalInsuredSchedResidencePremises.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = "AdditionalInsured"
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.Interest
      limit.WrittenAmt.Amt = 0.00
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
            break
          }
        }
      }
      limits.add(limit)
    }
    return limits
  }

  function createAdditionalInsuredScheduledProperty(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_AdditionalInsuredSchedProp.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = "AdditionalInsured"
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| Interest: " + item.Interest +
          "| SectionI:" + item.IsSectionIPropertyCoverage +
          "| SectionII:" + item.SectionIILiabilityOccType
      limit.WrittenAmt.Amt = 0.00
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
            break
          }
        }
      }
      limits.add(limit)
    }
    return limits
  }

  function createAdditionalInsuredDescribedLocation(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_AdditionalInsuredSchedDescribedLocation.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = "AdditionalInsured"
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.Interest
      limit.WrittenAmt.Amt = 0.00
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
            break
          }
        }
      }
      limits.add(limit)
    }
    return limits
  }

  function createAdditionalInsuredPersonalLiability(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as HomeownersLine_HOE).HOLI_AdditionalInsuredSchedPersonalLiability.scheduledItem_Ext
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = "AdditionalInsured"
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.Interest
      limit.WrittenAmt.Amt = 0.00
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
            break
          }
        }
      }
      limits.add(limit)
    }
    return limits
  }

  function createAdditionalInsuredPropertyManager(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as HomeownersLine_HOE).HOLI_AdditionalInsuredSchedPropertyManager.scheduledItem_Ext
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = "AdditionalInsured"
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.Interest
      limit.WrittenAmt.Amt = 0.00
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
            break
          }
        }
      }
      limits.add(limit)
    }
    return limits
  }

  function createResidenceHeldInTrust(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = currentCoverage.PolicyLine.AssociatedPolicyPeriod.TrustResidings
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = "ResidenceHeldInTrust" + item.ID
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = item.TrustResident == typekey.TrustResident_Ext.TC_GRANTOR ? "Name: " + item.NameOfGrantor + " (Grantor)":
                                                                                     "Name: " + item.NameOfBeneficiary + " (Beneficiary)"
      limit.WrittenAmt.Amt = 0.00
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
            break
          }
        }
      }
      limits.add(limit)
    }
    return limits
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