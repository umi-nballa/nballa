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
  function createScheduleList(currentCoverage : Coverage, transactions : java.util.List<Transaction>)
                                                                          : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {

    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    switch (currentCoverage.PatternCode) {
      case "BP7AddlInsdOwnersLandLeasedToInsuredLocation_EXT" :
          var bp7AddlInsdOwnersLandLeasedToInsured = createBP7AddlInsdOwnersLandLeasedToInsuredLocation(currentCoverage, transactions)
          for (item in bp7AddlInsdOwnersLandLeasedToInsured) { limits.add(item)}
          break
      case "BP7AddlInsdOwnersLandLeasedToInsuredLine_EXT" :
          var bp7AddlInsdOwnersLandLeasedToInsured = createBP7AddlInsdOwnersLandLeasedToInsuredLine(currentCoverage, transactions)
          for (item in bp7AddlInsdOwnersLandLeasedToInsured) { limits.add(item)}
          break
      case "BP7AddlInsdControllingInterestLocation_EXT" :
          var scheduledProperties = createBP7AddlInsdControllingInterestLocation(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdControllingInterest" :
          var scheduledProperties = createBP7AddlInsdControllingInterestLine(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdDesignatedPersonOrgLocation_EXT" :
          var bp7AddlInsds = createBP7AddlInsdDesignatedPersonOrgItemLocation(currentCoverage, transactions)
          for (item in bp7AddlInsds) { limits.add(item)}
          break
      case "BP7AddlInsdDesignatedPersonOrg" :
          var bp7AddlInsds = createBP7AddlInsdDesignatedPersonOrgItemLine(currentCoverage, transactions)
          for (item in bp7AddlInsds) { limits.add(item)}
          break
      case "BP7AddlInsdCoOwnerInsdPremises" :
          var scheduledProperties = createBP7AddlInsdCoOwnerInsdPremisesLocation(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdCoOwnerInsdPremisesLine_EXT" :
          var scheduledProperties = createBP7AddlInsdCoOwnerInsdPremisesLine(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdGrantorOfFranchiseEndorsement" :
          var scheduledProperties = createBP7AddlInsdGrantorOfFranchiseEndorsementLocation(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdGrantorOfFranchiseLine_EXT"  :
          var scheduledProperties = createBP7AddlInsdGrantorOfFranchiseEndorsementLine(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdLessorsLeasedEquipmt" :
          var scheduledProperties = createBP7AddlInsdLessorsLeasedEquipmtLocation(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdLessorsLeasedEquipmtLine_EXT"  :
          var scheduledProperties = createBP7AddlInsdLessorsLeasedEquipmtLine(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdManagersLessorsPremises" :
          var scheduledProperties = createBP7AddlInsdManagersLessorsPremisesLocation(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdManagersLessorsPremisesLine_EXT" :
          var scheduledProperties = createBP7AddlInsdManagersLessorsPremisesLine(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdMortgageeAssigneeReceiver" :
          var scheduledProperties = createBP7AddlInsdMortgageeAssigneeReceiverLocation(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlInsdMortgageeAsigneeReceiverLine_EXT"  :
          var scheduledProperties = createBP7AddlInsdMortgageeAssigneeReceiverLine(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
          break
      case "BP7AddlIntrstLosspyblprovi_EXT"  :
          var scheduledProperties = createBP7AddlIntrstLossPayable(currentCoverage, transactions)
          for (item in scheduledProperties) { limits.add(item)}
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
      coverable.BuildingNo =  classification?.Building?.Building?.BuildingNum != null ? classification?.Building?.Building?.BuildingNum : ""
      coverable.LocationNo = classification?.Building?.Location?.Location?.LocationNum != null ? classification?.Building?.Location?.Location?.LocationNum : ""
    }
    return coverable
  }

  override function createOptionLimitInfo(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>) : wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(currentCovTerm.PatternCode == "BP7OnPremisesLimit_EXT") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = currentCovTerm.OptionValue.Description != null ? currentCovTerm.OptionValue.Description : ""
      limit.LimitDesc = ""
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      return limit
    }  else {
      return super.createOptionLimitInfo(coverage, currentCovTerm, transactions)
    }
  }

  override function createOtherOptionCovTerm(coverage : Coverage, currentCovTerm : OptionCovTerm, transactions : java.util.List<Transaction>): wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType {
    if(currentCovTerm.PatternCode == "BP7OrdinLawCov_EXT") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.FormatText = currentCovTerm?.OptionValue?.OptionCode != null ? currentCovTerm.OptionValue.OptionCode : ""
      limit.CurrentTermAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.NetChangeAmt.Amt = 0
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      limit.LimitDesc = ""
      limit.WrittenAmt.Amt = 0
      return limit
    } else if (currentCovTerm.PatternCode == "BP7CovType2" or currentCovTerm.PatternCode == "BP7MaintenanceAgreement1") {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = currentCovTerm.OptionValue.OptionCode != null ? currentCovTerm.OptionValue.OptionCode : ""
      limit.LimitDesc = ""
      limit.CoverageCd = coverage.PatternCode
      limit.CoverageSubCd = currentCovTerm.PatternCode
      return limit
    } else {
      return super.createOtherOptionCovTerm(coverage, currentCovTerm, transactions)
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

  private function createBP7AddlInsdOwnersLandLeasedToInsuredLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Location).BP7AddlInsdOwnersLandLeasedToInsuredLocation_EXT.ScheduledItems
    for (item in scheduleItems) {
    var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
    limit.CoverageCd = currentCoverage.PatternCode
    limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
    limit.CurrentTermAmt.Amt = 0
    limit.NetChangeAmt.Amt = 0
    limit.FormatPct = 0
    limit.Rate = 0.00
    limit.FormatText = ""
    limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
        "| SubLoc:" +
        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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


  private function createBP7AddlInsdOwnersLandLeasedToInsuredLine(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Line).BP7AddlInsdOwnersLandLeasedToInsuredLine_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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


  private function createBP7AddlInsdControllingInterestLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Location).BP7AddlInsdControllingInterestLocation_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdControllingInterestLine(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Line).BP7AddlInsdControllingInterest.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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


  private function createBP7AddlInsdDesignatedPersonOrgItemLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Location).BP7AddlInsdDesignatedPersonOrgLocation_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdDesignatedPersonOrgItemLine(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Line).BP7AddlInsdDesignatedPersonOrg.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdCoOwnerInsdPremisesLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Location).BP7AddlInsdCoOwnerInsdPremises.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                        "| SubLoc:" +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdCoOwnerInsdPremisesLine(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Line).BP7AddlInsdCoOwnerInsdPremisesLine_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdGrantorOfFranchiseEndorsementLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Location).BP7AddlInsdGrantorOfFranchiseEndorsement.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) + //item.AdditionalInsured.AdditionalInsuredType != null ?
                        "| SubLoc:" +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdGrantorOfFranchiseEndorsementLine(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Line).BP7AddlInsdGrantorOfFranchiseLine_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) + //item.AdditionalInsured.AdditionalInsuredType != null ?
          "| SubLoc:" +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdLessorsLeasedEquipmtLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Location).BP7AddlInsdLessorsLeasedEquipmt.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                        "| SubLoc:" +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdLessorsLeasedEquipmtLine(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Line).BP7AddlInsdLessorsLeasedEquipmtLine_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

    private function createBP7AddlInsdManagersLessorsPremisesLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Location).BP7AddlInsdManagersLessorsPremises.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" + item.LongStringCol1 +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdManagersLessorsPremisesLine(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Line).BP7AddlInsdManagersLessorsPremisesLine_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" + item.LongStringCol1 +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdMortgageeAssigneeReceiverLocation(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Location).BP7AddlInsdMortgageeAssigneeReceiver.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = item.LongStringCol1 //  Desginated Part
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
                        "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
                        "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
                        "| SubLoc:" + item.LongStringCol1 +
                        "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlInsdMortgageeAssigneeReceiverLine(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Line).BP7AddlInsdMortgageeAsigneeReceiverLine_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInsured.AdditionalInsuredType != null ? item.AdditionalInsured.AdditionalInsuredType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = item.LongStringCol1 //  Desginated Part
      limit.LimitDesc = "Name:" + item.AdditionalInsured.PolicyAddlInsured.DisplayName +
          "| Address:" + item.AdditionalInsured.PolicyAddlInsured.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true) +
          "| SubLoc:" + item.LongStringCol1 +
          "| Interest: " + item.AdditionalInsured.AdditionalInsuredType.Description
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

  private function createBP7AddlIntrstLossPayable(currentCoverage : Coverage, transactions : java.util.List<Transaction>)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType>()
    var scheduleItems = (currentCoverage.OwningCoverable as BP7Building).BP7AddlIntrstLosspyblprovi_EXT.ScheduledItems
    for (item in scheduleItems) {
      var limit = new wsi.schema.una.hpx.hpx_application_request.types.complex.LimitType()
      limit.CoverageCd = currentCoverage.PatternCode
      limit.CoverageSubCd = item.AdditionalInterest.AdditionalInterestType != null ? item.AdditionalInterest.AdditionalInterestType : ""
      limit.CurrentTermAmt.Amt = 0
      limit.NetChangeAmt.Amt = 0
      limit.FormatPct = 0
      limit.Rate = 0.00
      limit.FormatText = ""
      limit.LimitDesc = "Name:" + item.AdditionalInterest.PolicyAddlInterest.DisplayName  +
          "| Address:" + item.AdditionalInterest.PolicyAddlInterest.AccountContactRole.AccountContact.Contact.PrimaryAddress +
          "| Location:" + currentCoverage.OwningCoverable.PolicyLocations.first().addressString(",", true, true)  +
          "| Type:" + item.AdditionalInterest.AdditionalInterestType.Description +
          "| PropertyDescription: " + (currentCoverage.OwningCoverable as BP7Building).Building.Description +
          "| Description: " + item.LongStringCol1
      limit.WrittenAmt.Amt = 0
      limits.add(limit)
    }
    return limits
  }
}