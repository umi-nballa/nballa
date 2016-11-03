package gw.lob.cp

uses gw.api.util.JurisdictionMappingUtil
uses gw.api.util.NumberUtil
uses gw.api.util.StateJurisdictionMappingUtil
uses gw.coverage.AllCoverageCopier
uses gw.api.web.job.JobWizardHelper



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
    for (ai in this.AdditionalInterests)
    {
      clonedBuilding.addToAdditionalInterests(ai)
    }

    for (var coverage in this.Coverages) {
      var clonedCoverage = coverage.copyCoverage() as CPBuildingCov
      clonedCoverage.setEffectiveWindow(clonedBuilding.SliceDate, this.Branch.PeriodEnd)
      clonedBuilding.addToCoverages(clonedCoverage)
    }
    /*for (var exclusion in this.Exclusions) {
      var clonedExclusion = exclusion.copyExclusion() as CPBuildingExcl
      clonedExclusion.setEffectiveWindow(clonedBuilding.SliceDate, this.Branch.PeriodEnd)
      clonedBuilding.addToExclusions(clonedExclusion)
    }
    for (var condition in this.Conditions) {
      var clonedCondition = condition.copyCondition() as CPBuildingCond
      clonedCondition.setEffectiveWindow(clonedBuilding.SliceDate, this.Branch.PeriodEnd)
      clonedBuilding.addToConditions(clonedCondition)
    } */
    // Add classification to cloneBuilding by creating new object
    /*for(cl in this.Classifications){

      var newClassification = clonedBuilding.createAndAddClassification(helper)
      newClassification.Coverages.each( \ elt -> elt.remove())
      newClassification.Exclusions.each( \ elt -> elt.remove())
      newClassification.Conditions.each( \ elt -> elt.remove())

      newClassification.InitialCoveragesCreated  = cl.InitialCoveragesCreated
      newClassification.InitialExclusionsCreated = cl.InitialExclusionsCreated
      newClassification.InitialConditionsCreated = cl.InitialConditionsCreated

      for(clCov in cl.Coverages){
        var clonedClCov = clCov.copyCoverage() as BP7ClassificationCov
        clonedClCov.setEffectiveWindow(newClassification.SliceDate,this.Branch.PeriodEnd)
        newClassification.addToCoverages(clonedClCov)
      }
      for(clCov in cl.Exclusions){
        var clonedClExcl = clCov.copyExclusion() as BP7ClassificationExcl
        clonedClExcl.setEffectiveWindow(newClassification.SliceDate,this.Branch.PeriodEnd)
        newClassification.addToExclusions(clonedClExcl)
      }
      for(clCov in cl.Conditions){
        var clonedClCond = clCov.copyCondition() as BP7ClassificationCond
        clonedClCond.setEffectiveWindow(newClassification.SliceDate,this.Branch.PeriodEnd)
        newClassification.addToConditions(clonedClCond)
      }

      newClassification.ClassDescription = cl.ClassDescription
      newClassification.ClassCode_Ext = cl.ClassCode_Ext
      newClassification.ClassPropertyType = cl.ClassPropertyType
      newClassification.Area = cl.Area
    }  // end of classification
    */
    //Add building units
    /*for(bldgUnit in this.BldgUnits){
      var cloneBldUnit = clonedBuilding.createAndAddNewBuildingUnits()
      cloneBldUnit.OccupantName = bldgUnit.OccupantName
      cloneBldUnit.TotalSqFootage = bldgUnit.TotalSqFootage
      cloneBldUnit.Description = bldgUnit.Description
    } */
    // End of Building Units
    /*clonedBuilding.PropertyType = this.PropertyType
    clonedBuilding.Building.Description = this.Building.Description
    clonedBuilding.PredominentOccType_Ext = this.PredominentOccType_Ext
    clonedBuilding.YearBuilt_Ext = this.YearBuilt_Ext
    clonedBuilding.NoOfStories_Ext = this.NoOfStories_Ext
    clonedBuilding.NoOfUnits_Ext = this.NoOfUnits_Ext
    clonedBuilding.BuildingSqFootage_Ext = this.BuildingSqFootage_Ext
    clonedBuilding.Caged_Ext  = this.Caged_Ext
    clonedBuilding.Alarmed_Ext  = this.Alarmed_Ext
    clonedBuilding.Monitored_Ext = this.Monitored_Ext

    if(this.UnitNumber != null){
      clonedBuilding.UnitNumber = this.UnitNumber
    }
    if(this.RABOPWanted != null){
      clonedBuilding.RABOPWanted = this.RABOPWanted
    }
    if(this.RABOPType != null){
      clonedBuilding.RABOPType = this.RABOPType
    }
    if(this.RABOPTypeLiabilityLess != null){
      clonedBuilding.RABOPTypeLiabilityLess = this.RABOPTypeLiabilityLess
    }
    if(this.BldgCodeEffGradeClass != null){
      clonedBuilding.BldgCodeEffGradeClass = this.BldgCodeEffGradeClass
    }
    if(this.BldgCodeEffGrade != null){
      clonedBuilding.BldgCodeEffGrade = this.BldgCodeEffGrade
    }
    if(this.ConstructionType != null){
      clonedBuilding.ConstructionType = this.ConstructionType
    }
    if(this.Sprinklered != null){
      clonedBuilding.Sprinklered = this.Sprinklered
    }
    if(this.TotalCondoBldgSquareFo != null){
      clonedBuilding.TotalCondoBldgSquareFo = this.TotalCondoBldgSquareFo
    }
    if(this.CentralBurglarAlarm_Ext != null){
      clonedBuilding.CentralBurglarAlarm_Ext = this.CentralBurglarAlarm_Ext
    }
    if(this.CentralFireAlarmSystem_Ext != null){
      clonedBuilding.CentralFireAlarmSystem_Ext = this.CentralFireAlarmSystem_Ext
    }
    if(this.FireDepartmentDistance_Ext != null) {
      clonedBuilding.FireDepartmentDistance_Ext = this.FireDepartmentDistance_Ext
    } */

    //clonedBuilding.updateDependentFields(null, helper)
    return  clonedBuilding
  }

}
