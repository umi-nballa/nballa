package gw.lob.cp

uses gw.api.util.JurisdictionMappingUtil
uses gw.api.util.NumberUtil
uses gw.api.util.StateJurisdictionMappingUtil
uses gw.coverage.AllCoverageCopier
uses gw.api.web.job.JobWizardHelper
uses java.util.ArrayList

enhancement CPBuildingEnhancement : CPBuilding {

  /**
   * returns the sum of all building coverage limits as double
   */
  property get BusIncomeLimitSum() : double {
    var mfgLimitTerm =  this.CPBldgBusIncomeCov.BusIncomeMfgLimitTerm.Value as double
    var otherLimitTerm = this.CPBldgBusIncomeCov.BusIncomeOtherLimitTerm.Value as double
    var rentalLimitTerm = this.CPBldgBusIncomeCov.BusIncomeRentalLimitTerm.Value as double
    var sum = mfgLimitTerm + otherLimitTerm + rentalLimitTerm
    return sum
  }

  /**
   * returns the sum of building coverage limits as String
   */
  property get BusIncomeLimitSumDisplay() : String {
    var limit = BusIncomeLimitSum
    return limit != 0 ? NumberUtil.render(limit) : null
  }

  /**
   * Return a list of CP Blankets that have coverages
   * @return List<CPBlanket> - list of CPBlanket
   */
  property get CurrentCPBlankets() : List<CPBlanket> {
    return this.Coverages.where(\ c -> c.CPBlanket != null).map(\ c -> c.CPBlanket).toList()
  }

  function firstMatchingClassCode(code : String) : CPClassCode {
    var criteria = new CPClassCodeSearchCriteria()
    criteria.Code = code
    criteria.EffectiveAsOfDate = this.PolicyLine.getReferenceDateForCurrentJob(JurisdictionMappingUtil.getJurisdiction(this.CPLocation.Location))
    criteria.PreviousSelectedClassCode = (this.PolicyLine.Branch.Job.NewTerm) ? null : this.BasedOn.ClassCode.Code
    return criteria.performSearch().FirstResult
  }

  function firstMatchingClassCodeOrThrow(code : String) : CPClassCode {
    var retVal = firstMatchingClassCode(code)
    if (retVal == null){
      throw new gw.api.util.DisplayableException(displaykey.Java.ClassCodePickerWidget.InvalidCode( code ))
    }
    return retVal
  }

  function validateYearBuilt(year : int) : String {
    var nextYear = java.util.Date.Today.addYears(1).YearOfDate
    if ((year > 0 and year < 1700) or year > nextYear) {
      return displaykey.Web.Policy.CP.Validation.YearBuilt
    }
    return null
  }

  function validateYearLastUpdate(yearLastUpdate : int) : String {
    var nextYear = java.util.Date.Today.addYears(1).YearOfDate
    if (yearLastUpdate > 0 and yearLastUpdate < this.Building.YearBuilt) {
      return displaykey.Web.Policy.CP.Validation.YearLastUpdate
    }
    if (yearLastUpdate > nextYear) {
      return displaykey.Web.Policy.CP.Validation.YearLastUpdateMax
    }
    return null
  }

  function validateBasementArea(area : int) : String {
    if (this.Building.NumBasements > 0 and area <= 0) {
      return displaykey.Web.Policy.CP.Validation.BasementArea
    }
    return null
  }

  property get BuildingLocationDisplay() : String {
    return this.DisplayName + " (" + this.CPLocation.DisplayName + ")"
  }

  /**
   * Copies the complete coverage pattern from this building to the given target buildings.
   */
  function copyCoverages(toBuildings : CPBuilding[]) {
    var coverageCopier = new AllCoverageCopier(this)
    coverageCopier.ShouldCopyAll = true
    toBuildings.each(\ b -> coverageCopier.copyInto(b))
  }
  
  property get Jurisdiction() : Jurisdiction {
    return StateJurisdictionMappingUtil.getJurisdictionMappingForState(this.CPLocation.Location.State)
  }


  /**
   * The createAndAddScheduledItem adds a scheduled item entity and associates it to the owning coverage that covers
   * scheduled items.    The function has been designed with the coverage pattern as an input so that
   * the function can be resused for any other coverage at homeownersline level that also have an array of scheduled items
   */
  function createAndAddCPScheduledItem(covPattern : String) : CPscheduleItem_CP_Ext {

    var schedItem = new CPscheduleItem_CP_Ext(this.Branch)

    if (covPattern.matches("CPOptionalOutdoorProperty_EXT") and this.CPOptionalOutdoorProperty_EXTExists) {
      this.CPOptionalOutdoorProperty_EXT.addScheduledItem(schedItem)

    } else if (covPattern.matches("CPWindstormProtectiveDevices_EXT") and this.CPWindstormProtectiveDevices_EXTExists) {
      this.CPWindstormProtectiveDevices_EXT.addScheduledItem(schedItem)
    }
    else if (covPattern.matches("CPProtectiveSafeguards_EXT") and this.CPProtectiveSafeguards_EXTExists) {
     this.CPProtectiveSafeguards_EXT.addScheduledItem(schedItem)
    }
    else
  {
      throw "Unsupported cov pattern in CPBuildingEnhancement.gsx"
    }

    return schedItem
  }

  function copyBuilding(helper : JobWizardHelper = null) : CPBuilding {

    var clonedBuilding = this.CPLocation.createAndAddBuilding(helper)

    clonedBuilding.Coverages.each( \ elt -> elt.remove())
    //clonedBuilding.Exclusions.each( \ elt -> elt.remove())
    //clonedBuilding.Conditions.each( \ elt -> elt.remove())
    clonedBuilding.InitialCoveragesCreated = this.InitialCoveragesCreated
    clonedBuilding.InitialExclusionsCreated = this.InitialExclusionsCreated
    clonedBuilding.InitialConditionsCreated = this.InitialConditionsCreated
    clonedBuilding.PreferredCoverageCurrency = this.PreferredCoverageCurrency

    for (var ai in this.AdditionalInterests) {
      var clonedai = ai.copy() as CPBldgAddlInterest
      clonedBuilding.addToAdditionalInterests(clonedai)
    }

    for (var coverage in this.Coverages) {
      var clonedCoverage = coverage.copyCoverage() as CPBuildingCov
      clonedCoverage.setEffectiveWindow(clonedBuilding.SliceDate, this.Branch.PeriodEnd)
      clonedBuilding.addToCoverages(clonedCoverage)
    }

    //Adding schedule coverage terms that did not copy over
    if(this.CPOptionalOutdoorProperty_EXTExists)
      {
        this.CPOptionalOutdoorProperty_EXT.scheduledItem_Ext.each( \ elt ->
        {
            clonedBuilding.CPOptionalOutdoorProperty_EXT.addToScheduledItem_Ext(elt)
        })
      }

    if(this.CPWindstormProtectiveDevices_EXTExists)
    {
      this.CPWindstormProtectiveDevices_EXT.scheduledItem_Ext.each( \ elt ->
      {
        clonedBuilding.CPWindstormProtectiveDevices_EXT.addToScheduledItem_Ext(elt)
      })
    }

    if(this.CPProtectiveSafeguards_EXTExists)
    {
      this.CPProtectiveSafeguards_EXT.scheduledItem_Ext.each( \ elt ->
      {
        clonedBuilding.CPProtectiveSafeguards_EXT.addToScheduledItem_Ext(elt)
      })
    }


    /*for (var exclusion in this.ExclusionsFromCoverable) {
      var clonedExclusion = exclusion.copyExclusion() as CPBuildingExcl
      clonedExclusion.setEffectiveWindow(clonedBuilding.SliceDate, this.Branch.PeriodEnd)
      clonedBuilding.addToExclusions(clonedExclusion)
    }
    for (var condition in this.Conditions) {
      var clonedCondition = condition.copyCondition() as CPBuildingCond
      clonedCondition.setEffectiveWindow(clonedBuilding.SliceDate, this.Branch.PeriodEnd)
      clonedBuilding.addToConditions(clonedCondition)
    } */
    // End of Building Units
    clonedBuilding.Building.Description = this.Building.Description
    clonedBuilding.ClassCode =  this.ClassCode
    clonedBuilding.CoverageForm =  this.CoverageForm

    clonedBuilding.Building.NumStories = this.Building.NumStories//NoOfStories_Ext
    clonedBuilding.Building.NumUnits = this.Building.NumUnits
    clonedBuilding.FireProtectionClassCode = this.FireProtectionClassCode
    clonedBuilding.BCEG_Ext=this.BCEG_Ext

    clonedBuilding.Building.ConstructionType = this.Building.ConstructionType
    clonedBuilding.SqFtExt=this.SqFtExt
    clonedBuilding.RoofTypeCP=this.RoofTypeCP
    clonedBuilding.RoofShape=this.RoofShape
    clonedBuilding.FlatRoofDesc=this.FlatRoofDesc
    clonedBuilding.RoofShapeOtherDes = this.RoofShapeOtherDes

    clonedBuilding.OccupancyType=this.OccupancyType


   // clonedBuilding.Building.Sprinklered = this.Building.Sprinklered
    clonedBuilding.Building.YearBuilt = this.Building.YearBuilt
    clonedBuilding.Building.TimesRent = this.Building.TimesRent

    clonedBuilding.windmiti5=this.windmiti5
    clonedBuilding.windstorm=this.windstorm
    clonedBuilding.windstormexcl=this.windstormexcl
    clonedBuilding.windmitidate=this.windmitidate

    clonedBuilding.desgr3=this.desgr3
    clonedBuilding.guswind=this.guswind
    clonedBuilding.terexp=this.terexp
    clonedBuilding.swrr=this.swrr
    clonedBuilding.guswindloc=this.guswindloc
    clonedBuilding.intpredes=this.intpredes
    clonedBuilding.roofdecat=this.roofdecat
    clonedBuilding.roofwl=this.roofwl
    clonedBuilding.roofdk=this.roofdk
    clonedBuilding.roofcv=this.roofcv
    clonedBuilding.roofcvatach=this.roofcvatach

    clonedBuilding.openprt=this.openprt



    clonedBuilding.numot=this.numot
    clonedBuilding.numpg=this.numpg
    clonedBuilding.numdocks=this.numdocks
    clonedBuilding.numfit=this.numfit
    clonedBuilding.numsw=this.numsw

    clonedBuilding.ActiveMonitoringVideo=this.ActiveMonitoringVideo
    clonedBuilding.AutomaticFireSuppress=this.AutomaticFireSuppress
        clonedBuilding.CentralBurglarAlarm=this.CentralBurglarAlarm
        clonedBuilding.CentralFireAlarm=this.CentralFireAlarm
        clonedBuilding.ContinuousRecVideo=this.ContinuousRecVideo
        clonedBuilding.ExteriorMotionLighting=this.ExteriorMotionLighting
        clonedBuilding.GuardWatchmen=this.GuardWatchmen
        clonedBuilding.GatedAccess=this.GatedAccess
        clonedBuilding.GuardDogs=this.GuardDogs
        clonedBuilding.LocalBurglarAlarm=this.LocalBurglarAlarm
        clonedBuilding.LocalFireAlarm=this.LocalFireAlarm
        clonedBuilding.MotionActivatedVideo=this.MotionActivatedVideo
    clonedBuilding.alarmed=this.alarmed
    clonedBuilding.caged=this.caged
    clonedBuilding.monitored=this.monitored

    clonedBuilding.OtherFacilitiesDescription=this.OtherFacilitiesDescription

    clonedBuilding.DistFirHyd=this.DistFirHyd
    clonedBuilding.DistFireStn=this.DistFireStn
    clonedBuilding.DistToNext=this.DistToNext
    clonedBuilding.RespFireDept=this.RespFireDept
    clonedBuilding.BldHt=this.BldHt
    clonedBuilding?.CPLocation?.Location?.FireProtectClass   = this.CPLocation?.Location?.FireProtectClass

    clonedBuilding.Building.Heating.YearAdded = this.Building.Heating.YearAdded
    clonedBuilding.Building.Plumbing.YearAdded = this.Building.Plumbing.YearAdded
    clonedBuilding.Building.Wiring.YearAdded = this.Building.Wiring.YearAdded
    clonedBuilding.Building.Roofing.YearAdded = this.Building.Roofing.YearAdded

    clonedBuilding.Building.InterestType = this.Building.InterestType
    clonedBuilding.Building.RentedOthers = this.Building.RentedOthers
    clonedBuilding.Building.PercentVacant = this.Building.PercentVacant

 //clonedBuilding.updateDependentFields(null, helper)
    return  clonedBuilding
  }

}
