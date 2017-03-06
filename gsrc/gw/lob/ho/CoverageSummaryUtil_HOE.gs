package gw.lob.ho

uses java.util.Map
uses java.util.ArrayList
uses gw.api.web.HtmlUtil
uses java.math.BigDecimal

/**
 * Utility class used for summary coverage data in the policy review page
 * and the quote page
 */
class CoverageSummaryUtil_HOE {
  
  /**
   * Returns the rows to be displayed in the additional coverages table 
   * for a special coverage - used in the policy review page
   */
  static function getSpecialCovTermNameValueCost(coverage: Coverage): List<String[]>{
    var result = new ArrayList<String[]>()
    if(coverage.PatternCode.equals("HOLI_OtherInsuredResidence_HOE")){
      // Other Insured Locations Occupied By Named Insured Coverage
      var lineCov = coverage as HomeownersLineCov_HOE
      for(loc in lineCov.CoveredLocations index pos){
        var description = displaykey.Web.Homeowners.Quote.LocationPrefix + loc.PolicyLocation.DisplayName
        var value = loc.LocationLimit.Description
        result.add(new String[]{description, value});
      }
    }else if(coverage.PatternCode.equals("HODW_OtherStructuresOffPremise_HOE")){
      // Other Structures Off The Residence Premises Coverage
    }else if(coverage.PatternCode.equals("HODW_PersonalPropertyOffResidence_HOE")){
      // Personal Property At Other Residences Coverage
      var dwellingCov = coverage as DwellingCov_HOE
      for(schedItem in dwellingCov.ScheduledItems){
        var description = displaykey.Web.Homeowners.Quote.LocationPrefix + schedItem.PolicyLocation.DisplayName
        var value = schedItem.AdditionalLimit.Description
        result.add(new String[]{description, value});
      }
    }else if(coverage.PatternCode.equals("HODW_SpecificStructuresOffPremise_HOE")){
      // Specific Structures Away From The Residence Premises Coverage
      var dwellingCov = coverage as DwellingCov_HOE
      var itemsPerLocation = dwellingCov.ScheduledItems.partition(\ s -> s.PolicyLocation)
      var costsPerLocation: Map<PolicyLocation, DwellingCovCost_HOE>
      if(dwellingCov.Costs != null and dwellingCov.Costs.length > 0){
        costsPerLocation = dwellingCov.Costs.partitionUniquely(\ c -> {return (c as ScheduleByLocCovCost_HOE).Location})
      }
      for(loc in itemsPerLocation.Keys){
        var description = displaykey.Web.Homeowners.Quote.LocationPrefix + loc
        result.add(new String[]{description, null});
        for(schedItem in itemsPerLocation.get(loc)){
          var itemDescription = HtmlUtil.indent(displaykey.Web.Homeowners.Quote.StructurePrefix, ScriptParameters.HOQuoteLevel1Indent)
            + schedItem.Description
          var value = schedItem.AdditionalLimit.Description
          result.add(new String[]{itemDescription, value});
        }
      }
    }else if(coverage.PatternCode.equals("HODW_ScheduledProperty_HOE")){
      // Scheduled Personal Property Coverage
      var dwellingCov = coverage as DwellingCov_HOE
      var itemsPerType = dwellingCov.ScheduledItems.partition(\ s -> s.ScheduleType)
      for(type in itemsPerType.Keys){
        var total: BigDecimal = 0
        itemsPerType.get(type).each(\ s -> {total += s.ExposureValue})
        result.add(new String[]{type.DisplayName, total.asString()})
      }
    }else if(coverage.PatternCode.equals("HODW_SpecialLimitsCovC_HOE")){
      // Special Limits Personal Property Coverage
      var dwellingCov = coverage as DwellingCov_HOE
      for(schedItem in dwellingCov.ScheduledItems index pos){
        var description = schedItem.ScheduleType.DisplayName + ": "
        if(schedItem.Description != null){
          description += schedItem.Description
        }else{
          description += displaykey.Web.Homeowners.Quote.NoDescription
        }
        result.add(new String[]{description, schedItem.ExposureValue.toString()})
      }
    }else if(coverage.PatternCode.equals("HODW_OtherStructuresOnPremise_HOE")){
      // Other Structures On The Residence Premises Coverage
      var dwellingCov = coverage as DwellingCov_HOE
      for(schedItem in dwellingCov.ScheduledItems){
        var description = displaykey.Web.Homeowners.Quote.StructurePrefix
        if(schedItem.Description != null){
          description += schedItem.Description
        }else{
          description += displaykey.Web.Homeowners.Quote.NoDescription
        }
        var value = schedItem.AdditionalLimit.Description
        result.add(new String[]{description, value});
      }
    }else{
      // unexpected coverage code
      var nameValuePair = new String[]{"Special Term", "XXXX"}
      result.add(nameValuePair)
    }
    return result
  }
  
  /**
   * Returns true if for the given coverage the costs are calculated at a lower level (for some subcomponents of the coverage) 
   * and false if the cost is calculated at the coverage level
   */
  static function isLowLevelCost(coverage: Coverage): boolean{
    var isLow = coverage.PatternCode.equals("HOLI_OtherInsuredResidence_HOE")
      || coverage.PatternCode.equals("HODW_SpecificStructuresOffPremise_HOE")
      || coverage.PatternCode.equals("HODW_SpecialLimitsCovC_HOE")
      || coverage.PatternCode.equals("HODW_ScheduledProperty_HOE")
      || coverage.PatternCode.equals("HOSL_OutboardMotorsWatercraft_HOE_Ext")
      || coverage.PatternCode.equals("HOSL_WatercraftLiabilityCov_HOE_Ext")
      || coverage.PatternCode.equals("HOLI_AddResidenceRentedtoOthers_HOE")
    return isLow
  }
  
  /**
   * Returns true if the given coverage has special terms like location, structures, scheduled items
   */
  static function isSpecialCoverage(coverage: Coverage): boolean{
    var isLow = isLowLevelCost(coverage) 
      || coverage.PatternCode.equals("HODW_PersonalPropertyOffResidence_HOE")
      || coverage.PatternCode.equals("HODW_OtherStructuresOnPremise_HOE")
    return isLow
  }
}
