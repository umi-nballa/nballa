package gw.lob.ho.rating
uses java.util.ArrayList
uses java.math.BigDecimal
uses gw.lob.ho.CoverageSummaryUtil_HOE

/**
 * Utility class used from the quote page
 */
abstract class QuotePageUtil_HOE {

  /**
   * Gets the default option of a cov term
   */
  static function getDefaultLimit(covTermPattern: gw.api.productmodel.OptionCovTermPattern): String{
    var defaultValue = ""
    var defaultCode = covTermPattern.getDefaultValue(null)
    if (defaultCode != null) {
       defaultValue = covTermPattern.getCovTermOpt(defaultCode).Description
    }
  
    return defaultValue

  }
  
  /**
   * Creates a structure that is used to display the costs in the Quote Page
   * Some costs are at the coverage level, some at a lower level
   */
  static function getStructuredData(allCosts: List<HomeownersCost_HOE>): List<CoverageCostData_HOE>{
    var structuredData:  List<CoverageCostData_HOE> = new ArrayList<CoverageCostData_HOE>()
    var currentCov: Coverage
    var prevCov: Coverage
    var currentGroup: CoverageCostData_HOE
    for(cost in allCosts){
      currentCov = getCoverageForCost(cost)
      // decide if new group
      var isLow = CoverageSummaryUtil_HOE.isLowLevelCost(currentCov) 
      if(not (currentCov == prevCov and isLow)){
        // create new group
        var groupCost: HomeownersCost_HOE
        if(not isLow) groupCost = cost
        currentGroup = new CoverageCostData_HOE(currentCov, groupCost)
        currentGroup.SpecialCoverage = CoverageSummaryUtil_HOE.isSpecialCoverage(currentCov)
        currentGroup.LowLevelCost = isLow
        structuredData.add(currentGroup)
      }
      
      // for special coverages there are some details to show
      if(currentGroup.SpecialCoverage){
        var lineData = getDetailedLines(currentCov, cost)
        currentGroup.Details.addAll(lineData)
      }
      
      
      prevCov = currentCov
    }
    return structuredData
  }

  /**
   * Returns the coverage the cost is for
   * If the Coverage reference is null, looks for a Coverage that contains this cost
   */
  private static function getCoverageForCost(cost: HomeownersCost_HOE): Coverage{
    var cov = cost.Coverage
    
    if(cov == null){
      if(cost typeis DwellingCovCost_HOE){
        cov = cost.Branch.HomeownersLine_HOE.Dwelling.VersionList.Coverages.flatMap(
          \ h -> h.AllVersions).where(\ c -> c.Costs.hasMatch(
            \ d -> d.FixedId == cost.FixedId and d.EffDate == cost.EffDate)).first()
      }
      else if(cost typeis HomeownersCovCost_HOE){
        cov = cost.Branch.HomeownersLine_HOE.VersionList.HOLineCoverages.flatMap(
          \ h -> h.AllVersions).where(\ c -> c.Costs.hasMatch(
            \ d -> d.FixedId == cost.FixedId and d.EffDate == cost.EffDate)).first()
      }
    }
    
    return cov
  }
  
  /**
   * Returns the rows to be displayed in the additional coverages table
   *  for a special coverage - used for the quote page
   */
  private static function getDetailedLines(coverage: Coverage, cost: HomeownersCost_HOE): List<NameValueCostData_HOE>{
    var result = new ArrayList<NameValueCostData_HOE>()
    if(coverage.PatternCode == "HOLI_OtherInsuredResidence_HOE"){
      // Other Insured Locations Occupied By Named Insured Coverage
      var locationCost = cost as HOLocationCovCost_HOE
      var lineCov = coverage as HomeownersLineCov_HOE
      var loc = lineCov.VersionList.CoveredLocations.flatMap(\ h -> h.AllVersions).firstWhere(
        \ cl -> locationCost.Location.FixedId == cl.PolicyLocation.FixedId).VersionList.AsOf(locationCost.ExpDate.addDays(-1))
      var description = displaykey.Web.Homeowners.Quote.LocationPrefix + loc.PolicyLocation.DisplayName
      var value = loc.LocationLimit.Description
      result.add(new NameValueCostData_HOE(description, value, cost))
    }else if(coverage.PatternCode == "HOSL_OutboardMotorsWatercraft_HOE_Ext" || coverage.PatternCode == "HOSL_WatercraftLiabilityCov_HOE_Ext"){
      // Outboard Motors and Watercraft Coverage
      var lineCov = coverage as HomeownersLineCov_HOE
      var scheduledItem = (cost as ScheduleLineCovCost_HOE_Ext).LineScheduledItem
      var key = scheduledItem.FixedId
      var items = lineCov.VersionList.scheduledItem_Ext.flatMap(
          \ h -> h.AllVersions).where(\ s -> s.FixedId == key
          and s.EffectiveDateRange.includes(cost.ExpDate.addDays(-1)))
      var total: BigDecimal = 0
      //items.each(\ s -> {total += s.ExposureValue})
      result.add(new NameValueCostData_HOE(scheduledItem.DisplayName, "", cost))
    }else if(coverage.PatternCode == "HOLI_AddResidenceRentedtoOthers_HOE"){
      var lineCov = coverage as HomeownersLineCov_HOE
      var coveredLocationItem = (cost as ScheduleLineCovCost_HOE_Ext).CoveredLocationItem
      var key = coveredLocationItem.FixedId
      var items = lineCov.VersionList.CoveredLocations.flatMap(
          \ h -> h.AllVersions).where(\ s -> s.FixedId == key
          and s.EffectiveDateRange.includes(cost.ExpDate.addDays(-1)))
      result.add(new NameValueCostData_HOE(coveredLocationItem?.PolicyLocation?.DisplayName, "", cost))
    }else if(coverage.PatternCode == "HODW_OtherStructuresOffPremise_HOE"){
      // Other Structures Off The Residence Premises Coverage
    }else if(coverage.PatternCode == "HODW_PersonalPropertyOffResidence_HOE"){
      // Personal Property At Other Residences Coverage
      var dwellingCov = coverage as DwellingCov_HOE
      var items = dwellingCov.VersionList.ScheduledItems.flatMap(\ h -> h.AllVersions).where(
        \ s -> s.EffectiveDateRange.includes(cost.ExpDate.addDays(-1)))
      for(schedItem in items){
        var description = displaykey.Web.Homeowners.Quote.LocationPrefix + schedItem.PolicyLocation.DisplayName
        var value = schedItem.AdditionalLimit.Description
        result.add(new NameValueCostData_HOE(description, value, null));
      }
    }else if(coverage.PatternCode == "HODW_SpecificStructuresOffPremise_HOE"){
      // Specific Structures Away From The Residence Premises Coverage
      var locationCost = cost as ScheduleByLocCovCost_HOE
      var dwellingCov = coverage as DwellingCov_HOE
      var itemsPerLocation = dwellingCov.VersionList.ScheduledItems.flatMap(
        \ h -> h.AllVersions).where(\ s -> s.EffectiveDateRange.includes(locationCost.ExpDate.addDays(-1))
        and s.PolicyLocation.FixedId == locationCost.SchedulePolicyLocation.FixedId)
      var description = displaykey.Web.Homeowners.Quote.LocationPrefix + locationCost.SchedulePolicyLocation
      var costLine = new NameValueCostData_HOE(description, null, locationCost)
      result.add(costLine);
      for(schedItem in itemsPerLocation){
        var itemDescription = displaykey.Web.Homeowners.Quote.StructurePrefix
          + schedItem.Description
        var value = schedItem.AdditionalLimit.Description
        costLine.subDetails.add(new NameValueCostData_HOE(itemDescription, value, null));
      }
    }else if(coverage.PatternCode == "HODW_ScheduledProperty_HOE"){
      // Scheduled Personal Property Coverage
      var dwellingCov = coverage as DwellingCov_HOE
      var scheduledItem = (cost as ScheduleCovCost_HOE).ScheduledItem
      var key = scheduledItem.FixedId
      var type = scheduledItem.ScheduleType
      var itemsPerType = dwellingCov.VersionList.ScheduledItems.flatMap(
        \ h -> h.AllVersions).where(\ s -> s.FixedId == key and s.ScheduleType == type
        and s.EffectiveDateRange.includes(cost.ExpDate.addDays(-1)))
      var total: BigDecimal = 0
      itemsPerType.each(\ s -> {total += s.ExposureValue})
      result.add(new NameValueCostData_HOE(type.DisplayName + " - " + scheduledItem.Description, total.asString(), cost))
    }else if(coverage.PatternCode == "HODW_SpecialLimitsCovC_HOE"){
      // Special Limits Personal Property Coverage
      var schedCost = cost  as ScheduleCovCost_HOE
      var dwellingCov = coverage as DwellingCov_HOE
      var schedItem = dwellingCov.VersionList.ScheduledItems.flatMap(\ h -> h.AllVersions).firstWhere(
        \ s -> schedCost.ScheduledItem.FixedId == s.FixedId).VersionList.getVersionAsOf(schedCost.ExpDate.addDays(-1)) as ScheduledItem_HOE
      var description = schedItem.ScheduleType.DisplayName + ": "
      if(schedItem.Description != null){
        description += schedItem.Description
      }else{
        description += displaykey.Web.Homeowners.Quote.NoDescription
      }
      result.add(new NameValueCostData_HOE(description, schedItem.ExposureValue.toString(),  cost))
    }else if(coverage.PatternCode == "HODW_OtherStructuresOnPremise_HOE"){
      // Other Structures On The Residence Premises Coverage
      var dwellingCov = coverage as DwellingCov_HOE
      for(schedItem in dwellingCov.VersionList.ScheduledItems.flatMap(\ h -> h.AllVersions).where(
        \ s -> s.EffectiveDateRange.includes(cost.ExpDate.addDays(-1)))){
        var description = displaykey.Web.Homeowners.Quote.StructurePrefix
        if(schedItem.Description != null){
          description += schedItem.Description
        }else{
          description += displaykey.Web.Homeowners.Quote.NoDescription
        }
        var value = schedItem.AdditionalLimit.Description
        result.add(new NameValueCostData_HOE(description, value, null))
      }
    }else{
      // unexpected coverage code
      // add corresponding processing code if we add another special coverage
    }
    return result
  }

  /**
   * Function which returns the coverage name for additional coverages
  */
  static function getCoverageNameForAdditionalCov(pattern : String) : String{
    if(pattern.endsWith("Coverage")){
      return pattern
    } else {
      return displaykey.Web.PolicyLine.Coverage(pattern)
    }
  }

  /**
   * Function which returns the cov terms of the coverage
   */
  static function getCovTerms(coverage : Coverage) : gw.api.domain.covterm.CovTerm[]{
    if(!(coverage typeis HODW_EquipBreakdown_HOE_Ext)){
      return coverage.CovTerms
    }
    return null
  }
}
