package una.integration.mapping.hpx.homeowners

uses una.integration.mapping.hpx.common.HPXCoverageMapper
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/22/16
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingCoverageMapper extends HPXCoverageMapper{
  function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)
                                                : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Limit>()

    switch (currentCoverage.PatternCode) {
      case "HODW_OtherStructuresOnPremise_HOE" :
        var otherStructuresOnPremises = createOtherStructuresOnPremisesSchedule(currentCoverage, previousCoverage)
        for (item in otherStructuresOnPremises) { limits.add(item)}
        break
      case "HODW_ScheduledProperty_HOE" :
        var scheduledProperties = createScheduledPropertySchedule(currentCoverage, previousCoverage, transactions)
        for (item in scheduledProperties) { limits.add(item)}
        break
      case "HODW_PersonalPropertyOffResidence_HOE" :
          var scheduledProperties = createPersonalPropertyOnOtherResidences(currentCoverage, previousCoverage)
          for (item in scheduledProperties) { limits.add(item)}
          break
      /*
      case "HODW_ResidentialGlass_HOE_Ext" :
          var glassCov = createResidentialGlassCoverage(currentCoverage, previousCoverage)
          limits.add(glassCov)
          break
          */
    }
    return limits
  }

  function createOtherStructuresOnPremisesSchedule(currentCoverage : Coverage, previousCoverage : Coverage)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Limit>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_OtherStructuresOnPremise_HOE.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
      var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
      var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
      var rentedToOthers = new wsi.schema.una.hpx.hpx_application_request.FormatText()
      var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
      var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
      var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
      var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
      var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      if (item.Description != null) {
        limitDesc.setText(item.Description)
        limit.addChild(limitDesc)
      }
      if(item.AdditionalLimit != null) {
        formatPct.setText(item.AdditionalLimit.Code)
        limit.addChild(formatPct)
      }
      if(item.rentedtoOthers_Ext != null) {
        rentedToOthers.setText(item.rentedtoOthers_Ext)
      } else rentedToOthers.setText("")
      limit.addChild(rentedToOthers)
      coverageCd.setText(currentCoverage.PatternCode)
      limit.addChild(coverageCd)
      scheduleType.setText("")
      limit.addChild(scheduleType)
      //current term amount
      amt.setText(0.00)
      currentTermAmount.addChild(amt)
      limit.addChild(currentTermAmount)
      // net change amt
      changeAmt.setText(0.00)
      netChangeAmount.addChild(changeAmt)
      limit.addChild(netChangeAmount)
      limits.add(limit)

    }
    return limits
  }

  function createScheduledPropertySchedule(currentCoverage : Coverage, previousCoverage : Coverage,  transactions : java.util.List<Transaction>)
                                                                            : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Limit>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_ScheduledProperty_HOE.ScheduledItems
    var costs = transactions.Cost
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
      var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
      var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
      var value = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
      var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
      var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
      var formatText = new wsi.schema.una.hpx.hpx_application_request.FormatText()
      var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
      var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      if (item.ScheduleType != null) {
        scheduleType.setText(item.ScheduleType)
        limit.addChild(scheduleType)
      }
      if (item.Description != null) {
        limitDesc.setText(item.Description)
        limit.addChild(limitDesc)
      }
      if(item.ExposureValue != null) {
        amt.setText(item.ExposureValue)
        value.addChild(amt)
        limit.addChild(value)
      }
      coverageCd.setText(currentCoverage.PatternCode)
      limit.addChild(coverageCd)
      formatText.setText("")
      limit.addChild(formatText)
      amt.setText(0.00)
      //format pct
      formatPct.setText(0)
      limit.addChild(formatPct)
      // net change amt
      changeAmt.setText(0.00)
      netChangeAmount.addChild(changeAmt)
      limit.addChild(netChangeAmount)
      limits.add(limit)
    }
    return limits
  }

  function createPersonalPropertyOnOtherResidences(currentCoverage : Coverage, previousCoverage : Coverage)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit> {
      var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Limit>()
      var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_PersonalPropertyOffResidence_HOE.ScheduledItems
      for (item in scheduleItems) {
        var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
        var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
        var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
        var additionalLimit = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
        var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
        var formatText = new wsi.schema.una.hpx.hpx_application_request.FormatText()
        var currentTermAmount = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
        var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
        var netChangeAmount = new wsi.schema.una.hpx.hpx_application_request.NetChangeAmt()
        var changeAmt = new wsi.schema.una.hpx.hpx_application_request.Amt()

        scheduleType.setText("")
        limit.addChild(scheduleType)

        if (item.PolicyLocation.DisplayName != null) {
          limitDesc.setText(item.PolicyLocation.DisplayName)
          limit.addChild(limitDesc)
        }
        if(item.AdditionalLimit != null) {
          additionalLimit.setText(item.AdditionalLimit)
          limit.addChild(additionalLimit)
        }
        coverageCd.setText(currentCoverage.PatternCode)
        limit.addChild(coverageCd)
        formatText.setText("")
        limit.addChild(formatText)
        amt.setText(0.00)
        currentTermAmount.addChild(amt)
        limit.addChild(currentTermAmount)
        // net change amt
        changeAmt.setText(0.00)
        netChangeAmount.addChild(changeAmt)
        limit.addChild(netChangeAmount)
        limits.add(limit)
      }
      return limits
  }

  /*
  function createResidentialGlassCoverage(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var coverageCd = new wsi.schema.una.hpx.hpx_application_request.CoverageCd()
    var formatText = new wsi.schema.una.hpx.hpx_application_request.FormatText()
    formatText.setText(currentCoverage.getCovTerm("HODW_Unscheduled_HOE_Ext").DisplayValue)
    limit.addChild(formatText)
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    limitDesc.setText("HODW_Unscheduled_HOE_Ext")
    limit.addChild(limitDesc)
    coverageCd.setText(currentCoverage.PatternCode)
    limit.addChild(coverageCd)
    return limit
  }
  */

  override function createCoverableInfo(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.Coverable {
    return null
  }
}