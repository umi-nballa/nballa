package una.integration.mapping.hpx.businessowners

uses una.integration.mapping.hpx.common.HPXCoverageMapper
uses gw.api.domain.covterm.OptionCovTerm
uses gw.xml.XmlElement

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

    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    switch (currentCoverage.PatternCode) {
/*
      case "BP7AddlInsdBldgOwners" :
          var bp7AddlInsdBldgOwners = createBP7AddlInsdBldgOwnersSchedule(currentCoverage, previousCoverage)
          for (item in bp7AddlInsdBldgOwners) { limits.add(item)}
          break
      case "BP7AddlInsdControllingInterestLocation_EXT" :
          var scheduledProperties = createBP7AddlInsdControllingInterest(currentCoverage, previousCoverage)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdDesignatedPersonOrgLocation_EXT" :
          var bp7AddlInsds = createBP7AddlInsdDesignatedPersonOrgItem(currentCoverage, previousCoverage)
          for (item in bp7AddlInsds) { limits.add(item)}
          break
          */

   /*************************************  Location Based Additional Insured Coverages - Start *****************************************************************/
      case "BP7AddlInsdCoOwnerInsdPremises" :
          var scheduledProperties = createBP7AddlInsdCoOwnerInsdPremises(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdGrantorOfFranchiseEndorsement" :
          var scheduledProperties = createBP7AddlInsdGrantorOfFranchiseEndorsement(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break

      case "BP7AddlInsdLessorsLeasedEquipmt" :
          var scheduledProperties = createBP7AddlInsdLessorsLeasedEquipmt(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break

      case "BP7AddlInsdManagersLessorsPremises" :
          var scheduledProperties = createBP7AddlInsdManagersLessorsPremises(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break

      case "BP7AddlInsdMortgageeAssigneeReceiver" :
          var scheduledProperties = createBP7AddlInsdMortgageeAssigneeReceiver(currentCoverage, previousCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
   /*************************************  Location Based Additional Insured Coverages - End *****************************************************************/
    }

    return limits
  }

  override function createCoverableInfo(currentCoverage: Coverage, previousCoverage: Coverage): wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType {
    var coverable = new wsi.schema.una.hpx.hpx_application_request.types.complex.CoverableType()
    if (currentCoverage.OwningCoverable typeis BP7Building) {
      var building = currentCoverage.OwningCoverable as BP7Building
      coverable.BuildingNo = building?.Building?.BuildingNum != null ? building.Building.BuildingNum : ""
      coverable.LocationNo = building?.Location?.Location.LocationNum != null ? building?.Location?.Location.LocationNum : ""
    }
    else if (currentCoverage.OwningCoverable typeis BP7Location) {
      var location = currentCoverage.OwningCoverable as BP7Location
      coverable.LocationNo = location?.Location?.LocationNum != null ? location.Location.LocationNum : ""
    }
    if (currentCoverage.OwningCoverable typeis BP7Classification) {
      var classification = currentCoverage.OwningCoverable as BP7Classification
      coverable.ClassificationNo = classification?.ClassificationNumber != null ?  classification.ClassificationNumber : ""
    }
    return coverable
  }

  override function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, previousCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
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
      return super.createOptionLimitInfo(coverage, currentCovTerm, previousCovTerm, transactions)
    }
  }

  override function getCostCoverage(cost : Cost) : Coverage {
    var result : Coverage

    switch(typeof cost){
      case BP7BuildingCovCost:
          result = cost.Coverage
          break
      case BP7LocationCovCost:
          result = cost.Coverage
          break
      case BP7LineCovCost:
          result = cost.Coverage
          break
    }
    return result
  }

   /*
  function createBP7AddlInsdBldgOwnersSchedule(currentCoverage : Coverage, previousCoverage : Coverage)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
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
    }
    return limits
  }


  function createBP7AddlInsdControllingInterest(currentCoverage : Coverage, previousCoverage : Coverage)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
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
    }
    return limits
  }


  function createBP7AddlInsdDesignatedPersonOrgItem(currentCoverage : Coverage, previousCoverage : Coverage)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as BP7Location).BP7AddlInsdDesignatedPersonOrgLocation_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.ScheduleType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = item.AdditionalLimit != null ? item.AdditionalLimit.Code : 0
      limit.FormatText = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.LimitDesc = item.Description != null ? item.Description : ""
    }
    return limits
  }
   */


  /************************************************************* Location Based Coverages - Start *********************************************************************************/

  function createBP7AddlInsdCoOwnerInsdPremises(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as BP7Location).BP7AddlInsdCoOwnerInsdPremises.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                        "| SubLoc:" +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  function createBP7AddlInsdGrantorOfFranchiseEndorsement(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as BP7Location).BP7AddlInsdGrantorOfFranchiseEndorsement.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) + //item.AdditionalInsured.AdditionalInsuredType != null ?
                        "| SubLoc:" +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  function createBP7AddlInsdLessorsLeasedEquipmt(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as BP7Location).BP7AddlInsdLessorsLeasedEquipmt.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                        "| SubLoc:" +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  function createBP7AddlInsdManagersLessorsPremises(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as BP7Location).BP7AddlInsdManagersLessorsPremises.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                        "| SubLoc:" + item.LongStringCol1 +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  function createBP7AddlInsdMortgageeAssigneeReceiver(currentCoverage : Coverage, previousCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as coverable as BP7Location).BP7AddlInsdMortgageeAssigneeReceiver.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType
      limit.CurrentTermAmt.Amt = 0.00
      limit.NetChangeAmt.Amt = 0.00
      limit.FormatPct = 0
      limit.FormatText = item.LongStringCol1 //  Desginated Part
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                        "| SubLoc:" + item.LongStringCol1 +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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
 /************************************************************* Location Based Coverages - End *********************************************************************************/
}