package una.integration.mapping.hpx.homeowners

uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.domain.covterm.DirectCovTerm
uses java.math.BigDecimal
uses una.integration.mapping.hpx.helper.HPXRatingHelper
uses gw.xml.XmlElement

/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/22/16
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingCoverageMapper extends HPXCoverageMapper{
  override function createScheduleList(currentCoverage : Coverage, transactions : java.util.List<Transaction>)
                                                : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()

    switch (currentCoverage.PatternCode) {
      case "HODW_OtherStructuresOnPremise_HOE" :
        var otherStructuresOnPremises = createOtherStructuresOnPremisesSchedule(currentCoverage, transactions)
        for (item in otherStructuresOnPremises) { limits.add(item)}
        break
      case "HODW_ScheduledProperty_HOE" :
        var scheduledProperties = createScheduledPropertySchedule(currentCoverage, transactions)
        for (item in scheduledProperties) { limits.add(item)}
        break
      case "HODW_PersonalPropertyOffResidence_HOE" :
          var scheduledProperties = createPersonalPropertyOnOtherResidences(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "HOLI_AddResidenceRentedtoOthers_HOE" :
          var scheduledProperties = createAdditionalResidencesRentedToOthers(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
        //TODO addins_update
//      case "HODW_AdditionalInsuredSchedResidencePremises" :
//          var scheduledProperties = createAdditionalInsuredResidencePremises(currentCoverage, transactions)
//          for (item in scheduledProperties) { limits.add(item)}
//          break
//      case "HODW_AdditionalInsuredSchedProp" :
//          var scheduledProperties = createAdditionalInsuredScheduledProperty(currentCoverage, transactions)
//          for (item in scheduledProperties) { limits.add(item)}
//          break
//      case "HODW_AdditionalInsuredSchedDescribedLocation" :
//          var scheduledProperties = createAdditionalInsuredDescribedLocation(currentCoverage, transactions)
//          for (item in scheduledProperties) { limits.add(item)}
//          break
//      case "HOLI_AdditionalInsuredSchedPersonalLiability" :
//          var scheduledProperties = createAdditionalInsuredPersonalLiability(currentCoverage, transactions)
//          for (item in scheduledProperties) { limits.add(item)}
//          break
//      case "HOLI_AdditionalInsuredSchedPropertyManager" :
//          var scheduledProperties = createAdditionalInsuredPropertyManager(currentCoverage, transactions)
//          for (item in scheduledProperties) { limits.add(item)}
//          break
      case "HODW_ResidenceHeldTrust_NC_HOE_Ext" :
          var scheduledProperties = createResidenceHeldInTrust(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
    }
    return limits
  }

  override function createDeductibleScheduleList(currentCoverage : Coverage, transactions : java.util.List<Transaction>)
      : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType> {
    return null
  }

  override function getIncludedPremium(coverage : Coverage) : BigDecimal {
    var includedPremium : BigDecimal
    switch (coverage.PatternCode) {
      case "HODW_Dwelling_Cov_HOE" :
          if (coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO3 ||
              coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO6) {
            var baseCost = coverage.PolicyLine.AssociatedPolicyPeriod.AllCosts.whereTypeIs(HomeownersBaseCost_HOE).where( \ elt -> elt.HOCostType == typekey.HOCostType_Ext.TC_BASEPREMIUM or
                                                                                                                                   elt.HOCostType == typekey.HOCostType_Ext.TC_AOPBASEPREMIUM or
                                                                                                                                   elt.HOCostType == typekey.HOCostType_Ext.TC_WINDBASEPREMIUM)
            includedPremium = baseCost.sum( \ elt -> elt.ActualTermAmount_amt)
          }
          break
      case "HODW_Personal_Property_HOE" :
          if (coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.HOPolicyType == typekey.HOPolicyType_HOE.TC_HO4) {
            var baseCost = coverage.PolicyLine.AssociatedPolicyPeriod.AllCosts.whereTypeIs(HomeownersBaseCost_HOE).where( \ elt -> elt.HOCostType == typekey.HOCostType_Ext.TC_BASEPREMIUM or
                elt.HOCostType == typekey.HOCostType_Ext.TC_AOPBASEPREMIUM or
                elt.HOCostType == typekey.HOCostType_Ext.TC_WINDBASEPREMIUM)
            includedPremium = baseCost.sum( \ elt -> elt.ActualTermAmount_amt)
          }
          break
    }

    return includedPremium
  }

  override function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    switch (currentCovTerm.PatternCode) {
      case "HOPL_LossAssCovLimit_HOE" :
          return createLossAssessmentLimit(coverage, currentCovTerm, transactions)
      case "HODW_OrdinanceLimit_HOE" :
          return createOrdinanceLawLimit(coverage, currentCovTerm, transactions)
      case "HODW_AdditionalAmtInsurance_HOE" :
          return createAdditionalDwellingCovLimit(coverage, currentCovTerm, transactions)
      case "HODW_TreesandPlantsLimit_HOE" :
          return createTreesAndPlantsCovLimit(coverage, currentCovTerm, transactions)
      default :
        return super.createOptionLimitInfo(coverage, currentCovTerm, transactions)
    }
  }

  function createLossAssessmentLimit(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    var value = currentCovTerm.OptionValue.Value
    var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
    limit.CurrentTermAmt.Amt = getCovTermAmount(value, valueType)
    limit.NetChangeAmt.Amt = coverage.OwningCoverable.BasedOnUntyped != null ? currentCovTerm.LimitDifference : 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true)
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createOrdinanceLawLimit(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    var value = currentCovTerm.Value
    var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
    var max = currentCovTerm.AvailableOptions.max()
    limit.NetChangeAmt.Amt = coverage.OwningCoverable.BasedOnUntyped != null ? currentCovTerm.LimitDifference : 0
    limit.FormatPct = getCovTermPercentage(value, valueType)
    limit.CurrentTermAmt.Amt = coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm != null ?
        coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm.Value * limit.FormatPct /100 : 0
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true) +
        " | Max: " + max
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createAdditionalDwellingCovLimit(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    var value = currentCovTerm.Value
    var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
    var max = currentCovTerm.AvailableOptions.max()
    limit.CurrentTermAmt.Amt = 0
    limit.NetChangeAmt.Amt = coverage.OwningCoverable.BasedOnUntyped != null ? currentCovTerm.LimitDifference : 0
    limit.FormatPct = getCovTermPercentage(value, valueType)
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = "Location:" + (coverage.OwningCoverable.PolicyLocations.where( \ elt -> elt.PrimaryLoc).first()).addressString(",", true, true) +
        " | Max: " + max
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.WrittenAmt.Amt = 0
    return limit
  }

  function createTreesAndPlantsCovLimit(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.Description = currentCovTerm.Pattern.Name
    var value = currentCovTerm.Value
    var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
    limit.NetChangeAmt.Amt = coverage.OwningCoverable.BasedOnUntyped != null ? currentCovTerm.LimitDifference : 0
    limit.FormatPct = getCovTermPercentage(value, valueType)
    limit.CurrentTermAmt.Amt = coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm != null ?
        coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.DwellingLimitCovTerm.Value * limit.FormatPct /100 : 0
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = ""
    limit.CoverageCd = coverage.PatternCode
    limit.CoverageSubCd = currentCovTerm.PatternCode
    limit.WrittenAmt.Amt = 0
    return limit
  }

  override function createDirectLimitInfo(coverage : Coverage, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(currentCovTerm.PatternCode == "HODW_BuildAddInc_HOE") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.Description = currentCovTerm.Pattern.Name
      var personalPropertyLimit = coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm
      var value = currentCovTerm.Value != null ? new BigDecimal(currentCovTerm.Value as double - personalPropertyLimit.Value as double *0.10) : 0.00
      limit.CurrentTermAmt.Amt = value
      limit.NetChangeAmt.Amt = coverage.OwningCoverable.BasedOnUntyped != null ? currentCovTerm.LimitDifference - personalPropertyLimit.LimitDifference*(0.10 as BigDecimal) : 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.LimitDesc = ""
      limit.FormatText = ""
      limit.WrittenAmt.Amt = 0
      return limit
    } else {
      return super.createDirectLimitInfo(coverage, currentCovTerm, transactions)
    }
  }

  override function createOtherDirectCovTerm(coverage : Coverage, currentCovTerm : DirectCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(coverage.PatternCode == "HOLI_BusinessPursuits_HOE_Ext") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.Description = currentCovTerm.Pattern.Name
      var value = currentCovTerm.Value
      var valueType = currentCovTerm.Pattern.ValueType
      limit.CurrentTermAmt.Amt = getCovTermAmount(value, valueType)
      limit.NetChangeAmt.Amt = coverage.OwningCoverable.BasedOnUntyped != null ? currentCovTerm.LimitDifference : 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = currentCovTerm.PatternCode == "HOLI_NumClercEmp_HOE_Ext" and value > 0 ? "Clerical Employees" :
                        currentCovTerm.PatternCode == "HOLI_NumSCMIDSOP_HOE_Ext" and value > 0  ?  "Salesperson, Collector or Messenger, Installation, Demonstration or Servicing Operation" :
                        currentCovTerm.PatternCode == "HOLI_NumTeachers_HOE_Ext" and value > 0  ?  "Teachers - Laboratory, athletic, manual or physical training" :
                        currentCovTerm.PatternCode == "HOLI_NotOtherwiseclassified_HOE_Ext" and value > 0  ?  "Unclassified" : ""
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.WrittenAmt.Amt = 0
      return limit
    } else {
      return super.createOtherDirectCovTerm(coverage, currentCovTerm, transactions)
    }
  }

  override function createOptionDeductibleInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType {
    if(currentCovTerm.PatternCode == "HODW_OtherPerils_Ded_HOE") {
      var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
      deductible.Description = currentCovTerm.Pattern.Name
      var value = currentCovTerm.OptionValue.Value
      var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
      deductible.FormatCurrencyAmt.Amt = getCovTermAmount(value, valueType)
      deductible.FormatPct = getCovTermPercentage(value, valueType)
      deductible.CoverageCd = coverage.PatternCode
      deductible.CoverageSubCd = currentCovTerm.PatternCode
      deductible.DeductibleDesc = ""
      deductible.FormatText = ""
      deductible.NetChangeAmt.Amt = 0
      var amt = coverage.PolicyLine.AssociatedPolicyPeriod.AllCosts.whereTypeIs(HomeownersLineCost_EXT).firstWhere( \ elt -> elt.HOCostType == typekey.HOCostType_Ext.TC_DEDUCTIBLEFACTORAOP).ActualTermAmount.Amount
      deductible.WrittenAmt.Amt = amt != null ? amt : 0
      deductible.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
      return deductible
    } else if(currentCovTerm.PatternCode == "HODW_AllPeril_HOE_Ext") {
      var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
      deductible.Description = currentCovTerm.Pattern.Name
      var value = currentCovTerm.OptionValue.Value
      var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
      deductible.FormatCurrencyAmt.Amt = getCovTermAmount(value, valueType)
      deductible.FormatPct = getCovTermPercentage(value, valueType)
      deductible.CoverageCd = coverage.PatternCode
      deductible.CoverageSubCd = currentCovTerm.PatternCode
      deductible.DeductibleDesc = ""
      deductible.FormatText = ""
      deductible.NetChangeAmt.Amt = 0
      var amt = coverage.PolicyLine.AssociatedPolicyPeriod.AllCosts.whereTypeIs(HomeownersLineCost_EXT).firstWhere( \ elt -> elt.HOCostType == typekey.HOCostType_Ext.TC_HIGHERALLPERILDEDUCTIBLE).ActualTermAmount.Amount
      deductible.WrittenAmt.Amt = amt != null ? amt : 0
      deductible.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
      return deductible
    } else if(currentCovTerm.PatternCode == "HODW_Hurricane_Ded_HOE") {
      var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
      deductible.Description = currentCovTerm.Pattern.Name
      var value = currentCovTerm.OptionValue.Value
      var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
      var dwellingLimit = coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
      deductible.FormatCurrencyAmt.Amt = dwellingLimit != null ? getCovTermAmountFromMixed(dwellingLimit, value, valueType) : 0
      deductible.FormatPct = getCovTermPercentageFromMixed(dwellingLimit, value, valueType)
      deductible.CoverageCd = coverage.PatternCode
      deductible.CoverageSubCd = currentCovTerm.PatternCode
      deductible.DeductibleDesc = ""
      deductible.FormatText = ""
      deductible.NetChangeAmt.Amt = 0
      var amt = coverage.PolicyLine.AssociatedPolicyPeriod.AllCosts.whereTypeIs(HomeownersLineCost_EXT).firstWhere( \ elt -> elt.HOCostType == typekey.HOCostType_Ext.TC_DEDUCTIBLEFACTORWIND).ActualTermAmount.Amount
      deductible.WrittenAmt.Amt = amt != null ? amt : 0
      deductible.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
      return deductible
    } else if(currentCovTerm.PatternCode == "HODW_WindHail_Ded_HOE") {
      var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
      deductible.Description = currentCovTerm.Pattern.Name
      var value = currentCovTerm.OptionValue.Value
      var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
      var dwellingLimit = coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
      deductible.FormatCurrencyAmt.Amt = getCovTermAmountFromMixed(dwellingLimit, value, valueType)
      deductible.FormatPct = getCovTermPercentageFromMixed(dwellingLimit, value, valueType)
      deductible.CoverageCd = coverage.PatternCode
      deductible.CoverageSubCd = currentCovTerm.PatternCode
      deductible.DeductibleDesc = ""
      deductible.FormatText = ""
      deductible.NetChangeAmt.Amt = 0
      var amt = coverage.PolicyLine.AssociatedPolicyPeriod.AllCosts.whereTypeIs(HomeownersLineCost_EXT).firstWhere( \ elt -> elt.HOCostType == typekey.HOCostType_Ext.TC_DEDUCTIBLEFACTORWIND).ActualTermAmount.Amount
      deductible.WrittenAmt.Amt = amt != null ? amt : 0
      deductible.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
      return deductible
    } else if(currentCovTerm.PatternCode == "HODW_NamedStrom_Ded_HOE_Ext") {
      var deductible = new wsi.schema.una.hpx.hpx_application_request.types.complex.DeductibleType()
      deductible.Description = currentCovTerm.Pattern.Name
      var value = currentCovTerm.OptionValue.Value
      var valueType = currentCovTerm.OptionValue.CovTermPattern.ValueType
      var dwellingLimit = coverage.PolicyLine.AssociatedPolicyPeriod.HomeownersLine_HOE.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value
      deductible.FormatCurrencyAmt.Amt = getCovTermAmountFromMixed(dwellingLimit, value, valueType)
      deductible.FormatPct = getCovTermPercentageFromMixed(dwellingLimit, value, valueType)
      deductible.CoverageCd = coverage.PatternCode
      deductible.CoverageSubCd = currentCovTerm.PatternCode
      deductible.DeductibleDesc = ""
      deductible.FormatText = ""
      deductible.NetChangeAmt.Amt = 0
      var amt = coverage.PolicyLine.AssociatedPolicyPeriod.AllCosts.whereTypeIs(HomeownersLineCost_EXT).firstWhere( \ elt -> elt.HOCostType == typekey.HOCostType_Ext.TC_DEDUCTIBLEFACTORWIND).ActualTermAmount.Amount
      deductible.WrittenAmt.Amt = amt != null ? amt : 0
      deductible.addChild(new XmlElement("Coverable", createCoverableInfo(coverage)))
      return deductible
    } else {
      return super.createOptionDeductibleInfo(coverage, currentCovTerm, transactions)
    }
  }

  private function createOtherStructuresOnPremisesSchedule(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as Dwelling_HOE).HODW_OtherStructuresOnPremise_HOE.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.Description = ""
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.ScheduleType
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = item.AdditionalLimit != null ? item.AdditionalLimit.Code : 0
      limit.Rate = 0.00
      limit.FormatText = item.rentedtoOthers_Ext != null ? item.rentedtoOthers_Ext : false
      limit.LimitDesc = item.Description != null ? item.Description : ""
      limit.WrittenAmt.Amt = 0
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.NetChangeAmt.Amt = 0
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

  private function createScheduledPropertySchedule(currentCoverage : Coverage,  transactions : java.util.List<Transaction>)
                                                                            : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var ratingHelper = new HPXRatingHelper()
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as Dwelling_HOE).HODW_ScheduledProperty_HOE.ScheduledItems
    var costs = transactions.Cost
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.Description = ""
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.ScheduleType
      limit.CurrentTermAmt.Amt = item.ExposureValue != null ? item.ExposureValue : 0.00
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = item.Description != null ? item.Description : ""
      limit.WrittenAmt.Amt = 0
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.NetChangeAmt.Amt = 0
            limit.Rate = ratingHelper.getRate(currentCoverage.PolicyLine.AssociatedPolicyPeriod, trx.Cost.NameOfCoverable, "BaseRate")
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

  private function createPersonalPropertyOnOtherResidences(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as Dwelling_HOE).HODW_PersonalPropertyOffResidence_HOE.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.Description = ""
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.ScheduleType
      limit.CurrentTermAmt.Amt = item.ExposureValue != null ? item.ExposureValue : 0.00
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = item.AdditionalLimit != null ? item.AdditionalLimit : 0
      limit.Rate = 0.00
      limit.FormatText = item.rentedtoOthers_Ext != null ? item.rentedtoOthers_Ext : false
      limit.LimitDesc = item.PolicyLocation.DisplayName != null ? item.PolicyLocation.DisplayName : ""
      limit.WrittenAmt.Amt = 0
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.NetChangeAmt.Amt = 0
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

  private function createAdditionalResidencesRentedToOthers(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as HomeownersLine_HOE).HOLI_AddResidenceRentedtoOthers_HOE.CoveredLocations
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.Description = ""
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = item.NumberOfFamilies
      limit.LimitDesc = item.PolicyLocation.CompactName != null ? "Location : " + item.PolicyLocation.CompactName : ""
      limit.WrittenAmt.Amt = 0
      for (trx in transactions) {
        if(trx.Cost typeis ScheduleCovCost_HOE){
          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
            limit.NetChangeAmt.Amt = 0
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

  //TODO addins_update
//  private function createAdditionalInsuredResidencePremises(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
//    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
//    var scheduleItems = (currentCoverage.OwningCoverable as Dwelling_HOE).HODW_AdditionalInsuredSchedResidencePremises.ScheduledItems
//    for (item in scheduleItems) {
//      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
//      limit.Description = ""
//      limit.CoverageCd = currentCoverage.PatternCode
//      limit.CoverageSubCd = "AdditionalInsured"
//      limit.CurrentTermAmt.Amt = 0
//      limit.NetChangeAmt.Amt = 0
//      limit.FormatPct = 0
//      limit.Rate = 0.00
//      limit.FormatText = ""
//      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
//          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
//          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
//          "| SubLoc:" +
//          "| Interest: " + item.Interest
//      limit.WrittenAmt.Amt = 0
//      for (trx in transactions) {
//        if(trx.Cost typeis ScheduleCovCost_HOE){
//          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
//            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
//            break
//          }
//        }
//      }
//      limits.add(limit)
//    }
//    return limits
//  }

//  private function createAdditionalInsuredScheduledProperty(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
//    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
//    var scheduleItems = (currentCoverage.OwningCoverable as Dwelling_HOE).HODW_AdditionalInsuredSchedProp.ScheduledItems
//    for (item in scheduleItems) {
//      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
//      limit.Description = ""
//      limit.CoverageCd = currentCoverage.PatternCode
//      limit.CoverageSubCd = "AdditionalInsured"
//      limit.CurrentTermAmt.Amt = 0
//      limit.NetChangeAmt.Amt = 0
//      limit.FormatPct = 0
//      limit.Rate = 0.00
//      limit.FormatText = ""
//      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
//          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
//          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
//          "| Interest: " + item.Interest +
//          "| SectionI:" + item.IsSectionIPropertyCoverage +
//          "| SectionII:" + item.SectionIILiabilityOccType
//      limit.WrittenAmt.Amt = 0
//      for (trx in transactions) {
//        if(trx.Cost typeis ScheduleCovCost_HOE){
//          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
//            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
//            break
//          }
//        }
//      }
//      limits.add(limit)
//    }
//    return limits
//  }

//  private function createAdditionalInsuredDescribedLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
//    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
//    var scheduleItems = (currentCoverage.OwningCoverable as Dwelling_HOE).HODW_AdditionalInsuredSchedDescribedLocation.ScheduledItems
//    for (item in scheduleItems) {
//      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
//      limit.Description = ""
//      limit.CoverageCd = currentCoverage.PatternCode
//      limit.CoverageSubCd = "AdditionalInsured"
//      limit.CurrentTermAmt.Amt = 0
//      limit.NetChangeAmt.Amt = 0
//      limit.FormatPct = 0
//      limit.Rate = 0.00
//      limit.FormatText = ""
//      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
//          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
//          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
//          "| SubLoc:" +
//          "| Interest: " + item.Interest
//      limit.WrittenAmt.Amt = 0
//      for (trx in transactions) {
//        if(trx.Cost typeis ScheduleCovCost_HOE){
//          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
//            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
//            break
//          }
//        }
//      }
//      limits.add(limit)
//    }
//    return limits
//  }
//
//  private function createAdditionalInsuredPersonalLiability(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
//    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
//    var scheduleItems = (currentCoverage.OwningCoverable as HomeownersLine_HOE).HOLI_AdditionalInsuredSchedPersonalLiability.scheduledItem_Ext
//    for (item in scheduleItems) {
//      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
//      limit.Description = ""
//      limit.CoverageCd = currentCoverage.PatternCode
//      limit.CoverageSubCd = "AdditionalInsured"
//      limit.CurrentTermAmt.Amt = 0
//      limit.NetChangeAmt.Amt = 0
//      limit.FormatPct = 0
//      limit.Rate = 0.00
//      limit.FormatText = ""
//      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
//          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
//          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
//          "| SubLoc:" +
//          "| Interest: " + item.Interest
//      limit.WrittenAmt.Amt = 0
//      for (trx in transactions) {
//        if(trx.Cost typeis ScheduleCovCost_HOE){
//          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
//            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
//            break
//          }
//        }
//      }
//      limits.add(limit)
//    }
//    return limits
//  }
//
//  private function createAdditionalInsuredPropertyManager(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
//    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
//    var scheduleItems = (currentCoverage.OwningCoverable as HomeownersLine_HOE).HOLI_AdditionalInsuredSchedPropertyManager.scheduledItem_Ext
//    for (item in scheduleItems) {
//      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
//      limit.Description = ""
//      limit.CoverageCd = currentCoverage.PatternCode
//      limit.CoverageSubCd = "AdditionalInsured"
//      limit.CurrentTermAmt.Amt = 0
//      limit.NetChangeAmt.Amt = 0
//      limit.FormatPct = 0
//      limit.Rate = 0.00
//      limit.FormatText = ""
//      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
//          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
//          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
//          "| SubLoc:" +
//          "| Interest: " + item.Interest
//      limit.WrittenAmt.Amt = 0
//      for (trx in transactions) {
//        if(trx.Cost typeis ScheduleCovCost_HOE){
//          if((trx.Cost as ScheduleCovCost_HOE).ScheduledItem.FixedId.equals(item.FixedId)) {
//            limit.WrittenAmt.Amt = trx.Cost.ActualAmount.Amount
//            break
//          }
//        }
//      }
//      limits.add(limit)
//    }
//    return limits
//  }

  private function createResidenceHeldInTrust(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = currentCoverage.PolicyLine.AssociatedPolicyPeriod.TrustResidings
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.Description = ""
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = "ResidenceHeldInTrust" + item.ID
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = item.TrustResident == typekey.TrustResident_Ext.TC_GRANTOR ? "Name: " + item.NameOfGrantor + " (Grantor)":
                                                                                     "Name: " + item.NameOfBeneficiary + " (Beneficiary)"
      limit.WrittenAmt.Amt = 0
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

  override function createCoverableInfo(currentCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
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