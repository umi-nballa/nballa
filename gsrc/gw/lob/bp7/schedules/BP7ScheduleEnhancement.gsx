package gw.lob.bp7.schedules

uses gw.api.domain.Clause
uses gw.api.productmodel.ClausePattern
uses gw.lob.bp7.contact.BP7BuildingAdditionalInterestContainer
uses gw.lob.common.contact.AbstractAdditionalInterestContainer

uses java.util.Map

enhancement BP7ScheduleEnhancement : gw.api.productmodel.Schedule {
  function addNewScheduledItem(policyAddlInsured: PolicyAddlInsuredDetail): ScheduledItem {
    var scheduledItem = this.createAndAddScheduledItem()
    policyAddlInsured.AdditionalInsuredType = AdditionalInsuredType
    scheduledItem.setAdditionalInsuredColumn("AdditionalInsured", policyAddlInsured)
    return scheduledItem
  }

  function addNewScheduledItem(policyAddlInterest : AddlInterestDetail): ScheduledItem {
    var scheduledItem = this.createAndAddScheduledItem()
    policyAddlInterest.AdditionalInterestType = typekey.AdditionalInterestType.TC_LOSSPAY
    scheduledItem.setAdditionalInterestColumn("AdditionalInterest", policyAddlInterest)
    return scheduledItem
  }

  function removeScheduledItemFromSchedule(item : ScheduledItem) {
    if (IsAdditionalInsuredSchedule) {
      item.getAdditionalInsuredColumn().remove()
    }

    if (IsAdditionalInterestSchedule) {
      item.getAdditionalInterestColumn().remove()
    }

    this.removeScheduledItem(item)
  }

  property get IsAdditionalInsuredSchedule() : boolean {
    return {gw.lob.bp7.BP7Categories.BP7LineAddlInsuredGrp.Code, gw.lob.bp7.BP7Categories.BP7LocationAddlInsuredGrp.Code}
        .contains((this as Clause).Pattern.CoverageCategory.Code)
  }

  property get IsAdditionalInterestSchedule() : boolean {
    return (this as gw.api.domain.Clause).Pattern == "BP7LossPayable"
  }

  property get AdditionalInterestContainer() : AbstractAdditionalInterestContainer {
    var coverable = (this as Clause).OwningCoverable
    if ((coverable typeis BP7Building) and IsAdditionalInterestSchedule) {
      return new BP7BuildingAdditionalInterestContainer(coverable)
    }

    return null
  }

  property get AdditionalInsuredType() : typekey.AdditionalInsuredType {
    var addlInsuredTypes: Map<ClausePattern, typekey.AdditionalInsuredType> = {
        //Line Level
        "BP7AddlInsdControllingInterest" -> typekey.AdditionalInsuredType.TC_CONTROL,
        "BP7AddlInsdDesignatedPersonOrg" -> typekey.AdditionalInsuredType.TC_DESIG,
        "BP7AddlInsdEngineersArchitectsSurveyorsNotEngagedB" -> typekey.AdditionalInsuredType.TC_ENGNOT,
        "BP7AddlInsdOwnersLesseesOrContrctrsCompldOps" -> typekey.AdditionalInsuredType.TC_OLCCOMPLETE,
        "BP7AddlInsdStatePoliticalSubdivisions" -> typekey.AdditionalInsuredType.TC_GOVPREM,
        "BP7AddlInsdStatePoliticalSubdivisionsPermits" -> typekey.AdditionalInsuredType.TC_GOVPERM,
        "BP7AddlInsdVendors" -> typekey.AdditionalInsuredType.TC_VENDOR,

        //Location level
        "BP7AddlInsdBldgOwners" -> typekey.AdditionalInsuredType.TC_BLDGOWN,
        "BP7AddlInsdGrantorOfFranchiseEndorsement" -> typekey.AdditionalInsuredType.TC_GRANTFRAN,
        "BP7AddlInsdOwnersLesseesContrctrs" -> typekey.AdditionalInsuredType.TC_OLCSCHED,
        "BP7AddlInsdMortgageeAssigneeReceiver" -> typekey.AdditionalInsuredType.TC_MORT,
        "BP7AddlInsdCoOwnerInsdPremises" -> typekey.AdditionalInsuredType.TC_COOWN,
        "BP7AddlInsdLessorsLeasedEquipmt" -> typekey.AdditionalInsuredType.TC_LESSEQUIP,
        "BP7AddlInsdManagersLessorsPremises" -> typekey.AdditionalInsuredType.TC_MGRPREM,
        "BP7AddlInsdLandLeased" -> typekey.AdditionalInsuredType.TC_OWNLAND
    }

    return addlInsuredTypes.get((this as Clause).Pattern)
  }
}
