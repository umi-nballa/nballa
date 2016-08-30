package una.integration.mapping.hpx.businessowners

uses una.integration.mapping.hpx.common.HPXCoverageMapper
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
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Limit>()

    switch (currentCoverage.PatternCode) {
      case "HODW_OtherStructuresOnPremise_HOE" :
        var otherStructuresOnPremises = createOtherStructuresOnPremisesSchedule(currentCoverage, previousCoverage)
        for (item in otherStructuresOnPremises) { limits.add(item)}
        break
      case "HODW_ScheduledProperty_HOE" :
        var scheduledProperties = createScheduledPropertySchedule(currentCoverage, previousCoverage)
        for (item in scheduledProperties) { limits.add(item)}
        break
      case "HODW_PersonalPropertyOffResidence_HOE" :
          var scheduledProperties = createPersonalPropertyOnOtherResidences(currentCoverage, previousCoverage)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "HODW_ResidentialGlass_HOE_Ext" :
          var glassCov = createResidentialGlassCoverage(currentCoverage, previousCoverage)
          limits.add(glassCov)
          break
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
      var rentedToOthers = new wsi.schema.una.hpx.hpx_application_request.RentedYesNoCd()
      var coverageCd = new wsi.schema.una.hpx.hpx_application_request.FormatText()
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
        limit.addChild(rentedToOthers)
      }
      coverageCd.setText(currentCoverage.PatternCode)
      limit.addChild(coverageCd)
      limits.add(limit)
    }
    return limits
  }

  function createScheduledPropertySchedule(currentCoverage : Coverage, previousCoverage : Coverage)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Limit>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_ScheduledProperty_HOE.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
      var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
      var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
      var value = new wsi.schema.una.hpx.hpx_application_request.CurrentTermAmt()
      var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
      var coverageCd = new wsi.schema.una.hpx.hpx_application_request.FormatText()
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
        var locationName = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
        var additionalLimit = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
        var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
        var coverageCd = new wsi.schema.una.hpx.hpx_application_request.FormatText()
        if (item.ScheduleType != null) {
          locationName.setText(item.ScheduleType)
          limit.addChild(locationName)
        }
        if (item.Description != null) {
          limitDesc.setText(item.Description)
          limit.addChild(limitDesc)
        }
        if(item.AdditionalLimit != null) {
          amt.setText(item.AdditionalLimit)
          additionalLimit.addChild(amt)
          limit.addChild(additionalLimit)
        }
        coverageCd.setText(currentCoverage.PatternCode)
        limit.addChild(coverageCd)
        limits.add(limit)
      }
      return limits
  }

  function createResidentialGlassCoverage(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.Limit {
    var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
    var formatText = new wsi.schema.una.hpx.hpx_application_request.FormatText()
    formatText.setText(currentCoverage.getCovTerm("HODW_Unscheduled_HOE_Ext").DisplayValue)
    limit.addChild(formatText)
    var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
    limitDesc.setText("HODW_Unscheduled_HOE_Ext")
    limit.addChild(limitDesc)
    return limit
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
}