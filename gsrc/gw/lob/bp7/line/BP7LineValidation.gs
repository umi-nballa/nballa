package gw.lob.bp7.line

uses gw.lob.bp7.blanket.BP7BlanketValidation
uses gw.lob.bp7.location.BP7LocationValidation
uses gw.lob.bp7.schedules.BP7BusinessIncomeScheduledItem
uses gw.policy.PolicyLineValidation
uses gw.validation.PCValidationContext

uses java.lang.UnsupportedOperationException
uses gw.api.productmodel.Schedule
uses gw.lob.bp7.schedules.validation.BP7ScheduleValidation
uses gw.api.domain.Clause

@Export
class BP7LineValidation extends PolicyLineValidation<entity.BP7BusinessOwnersLine> {

  property get BP7Line() : BP7BusinessOwnersLine {
    return Line
  }

  construct(valContext : PCValidationContext, policyLine : BP7BusinessOwnersLine) {
    super(valContext, policyLine)
  }

  override function doValidate() {
    BP7Line.validateDependentFields(Context)
    validateLine()
    validateChildren()
  }

  private function validateLine() {
    Context.addToVisited(this, "validateLine")
    checkDamageToPremisesRentedToYou()
    validateBusinessIncomeExemptSchedule()
    validateAmendmentLiquorLiabilitySchedule()
    validateWaiverOfTransferOfRightsOfRecoveryAgainstOthersToUsSchedule()
    validateContractorsSchedule()
    validateEmployeeDishonestNamedEmployeesSchedule()
    validateDiscretionaryPayrollExpenseSchedule()
    validateComputerFraudFundsTransferFraudLimit()
    validateFunctionalBuildingValuationWaitingPeriod()
    validateApartmentBuildingsTenantsAutosSchedule()
    validateRestaurantsLossOrDamageToCustomersAutosSchedule()
    validatePhotographySchedule()
    validateOrdinanceOrLawWaitingPeriod()
    validateSchedules()
    validatePolicyDefaultsDuringPolicyChange()
  }

  private function validateChildren() {
    Context.addToVisited(this, "validateChildren")
    BP7Line.BP7Locations.each(\ location -> {
      new BP7LocationValidation(Context, location).validate()
    } )
    BP7Line.Blankets.each(\ blanket -> new BP7BlanketValidation(Context, blanket).validate())
  }

  private function validateSchedules()  {
    Context.addToVisited(this, "validateSchedules")
    BP7Line.CoveragesConditionsAndExclusionsFromCoverable.whereTypeIs(Schedule).each( \ schedule -> new BP7ScheduleValidation(Context, schedule as Clause & Schedule).validate())
  }

  private function checkDamageToPremisesRentedToYou() {
    Context.addToVisited(this, "checkDamageToPremisesRentedToYou")
    if (BP7Line.BP7BusinessLiability?.BP7TenantsFireLiabLimitTerm?.Value > 50000) {
      var buildingWithCoverageSelected = BP7Line.BP7Locations*.Buildings.firstWhere(\ building -> building.BP7TenantsLiabilityExists)

      if (buildingWithCoverageSelected != null) {
        var errorMsg = displaykey.Web.Policy.BP7.Validation.Line.DamageToPremisesRentedToYouAboveBaseLimit(buildingWithCoverageSelected.DisplayName)
        Result.addError(BP7Line, ValidationLevel.TC_QUOTABLE, errorMsg)
      }
    }
  }
  
  private function validateBusinessIncomeExemptSchedule() {
    Context.addToVisited(this, "validateBusinessIncomeExemptSchedule")

    if (BP7Line.BP7BusinessIncomeExists) {
      if (BP7Line.BP7BusinessIncome.BP7ExemptTerm.Value) {
        if (BP7Line.BP7BusinessIncome.ScheduledItems.IsEmpty) {
          Result.addError( BP7Line, "default", displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(
            BP7Line.BP7BusinessIncome.BP7ExemptTerm.DisplayName), "BP7")
        }
      } else {
        if (not BP7Line.BP7BusinessIncome.ScheduledItems.IsEmpty) {
          BP7Line.BP7BusinessIncome.ScheduledItems.each(\ item -> {
            BP7Line.BP7BusinessIncome.removeScheduledItem(item)
          })
        }
      }

      BP7Line.BP7BusinessIncome.ScheduledItems.each(\ item -> {
        if (eitherBothFilledOrBothEmpty(new BP7BusinessIncomeScheduledItem(item))) {
          Result.addError( BP7Line, "default", displaykey.Web.Policy.BP7.Validation.Line.EitherExemptFieldsShouldBeFilled, "BP7")
        }
      })
    }
  }

  function validateAmendmentLiquorLiabilitySchedule() {
    Context.addToVisited(this, "validateAmendmentLiquorLiabilitySchedule")

    if(BP7Line.BP7AmendmentLiquorLiabExclExcptnExists) {
      var scheduleItems = BP7Line.BP7AmendmentLiquorLiabExclExcptn.ScheduledItems

      if (scheduleItems.IsEmpty) {
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(
          BP7Line.BP7AmendmentLiquorLiabExclExcptn.DisplayName))
      }

      var uniqueDescriptions = scheduleItems*.getStringColumn("Description").toSet()
      if (uniqueDescriptions.Count != scheduleItems.Count) {
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.Line.DuplicateScheduleItemDescription(
          BP7Line.BP7AmendmentLiquorLiabExclExcptn.DisplayName))
      }
    }
  }
  
  function validateContractorsSchedule() {
    Context.addToVisited(this, "validateContractorsSchedule")

    if(BP7Line.BP7ContrctrsToolsAndEquipmntScheduleExists) {
      var scheduleItems = BP7Line.BP7ContrctrsToolsAndEquipmntSchedule.ScheduledItems

      if (scheduleItems.IsEmpty) {
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(
          BP7Line.BP7ContrctrsToolsAndEquipmntSchedule.DisplayName))
      }

      var uniqueDescriptions = scheduleItems*.getStringColumn("Description").toSet()
      if (uniqueDescriptions.Count != scheduleItems.Count) {
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.Line.DuplicateScheduleItemDescription(
          BP7Line.BP7ContrctrsToolsAndEquipmntSchedule.DisplayName))
      }

      var limitSum = scheduleItems*.getIntegerColumn("Limit").sum()
      if (limitSum > 100000){
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.Line.TotalScheduledLimitForContractorToolsExceeds100K)
      }
    }
  }

  function validateEmployeeDishonestNamedEmployeesSchedule() {
    Context.addToVisited(this, "validateEmployeeDishonestNamedEmployeesSchedule")

    if(BP7Line.BP7EmployeeDishonestyNamedEmployeesExists) {
      var scheduleItems = BP7Line.BP7EmployeeDishonestyNamedEmployees.ScheduledItems

      if (scheduleItems.IsEmpty) {
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(
            BP7Line.BP7EmployeeDishonestyNamedEmployees.DisplayName))
      }
    }
  }

  function validateDiscretionaryPayrollExpenseSchedule() {
    Context.addToVisited(this, "validateDiscretionaryPayrollExpenseSchedule")

    if(BP7Line.BP7DiscretionaryPayrollExpenseExists) {
      var scheduleItems = BP7Line.BP7DiscretionaryPayrollExpense.ScheduledItems

      if (scheduleItems.IsEmpty) {
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(
            BP7Line.BP7DiscretionaryPayrollExpense.DisplayName))
      }
    }
  }

  function validateWaiverOfTransferOfRightsOfRecoveryAgainstOthersToUsSchedule() {
    Context.addToVisited(this, "validateWaiverOfTransferOfRightsOfRecoveryAgainstOthersToUsSchedule")

    if(BP7Line.BP7WaiverTransferRightsOfRecoveryAgainstOthersToUsExists) {
      var scheduleItems = BP7Line.BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs.ScheduledItems

      if (scheduleItems.IsEmpty) {
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(
          BP7Line.BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs.DisplayName))
      }

      var uniqueDescriptions = scheduleItems*.getStringColumn("Description").toSet()
      if (uniqueDescriptions.Count != scheduleItems.Count) {
        Result.addError(BP7Line, "default", displaykey.Web.Policy.BP7.Validation.Line.DuplicateScheduleItemDescription(
          BP7Line.BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs.DisplayName))
      }
    }
  }

  private function validateComputerFraudFundsTransferFraudLimit() {
    Context.addToVisited(this, "validateComputerFraudFundsTransferFraudLimit")

    if (Context.isAtLeast(ValidationLevel.TC_QUOTABLE) && BP7Line.BP7ComputerFraudFundsTransferFraudExists
        && BP7Line.BP7ComputerFraudFundsTransferFraud.BP7Limit4Term.OptionValue.Description != "No Coverage") {
      if (!BP7Line.BP7Locations.hasMatch(\loc -> loc.BP7LocationComputerFraudFundsTransferFraudExists
          && loc.BP7LocationComputerFraudFundsTransferFraud.BP7ComputerFraudApplyTerm.OptionValue.Description == "Yes")) {
        Result.addError(BP7Line, ValidationLevel.TC_QUOTABLE,
            displaykey.Web.Policy.BP7.Validation.Line.ComputerFraudFundsTransferFraudNoLocationElectingCoverage)
      }
    }
  }

  private function validateFunctionalBuildingValuationWaitingPeriod() {
    Context.addToVisited(this, "validateFunctionalBuildingValuationWaitingPeriod")

    if (Context.isAtLeast(ValidationLevel.TC_QUOTABLE)) {
      var values = BP7Line.AllBuildings.where(\b -> b.BP7FunctlBldgValtnExists)*.BP7FunctlBldgValtn*.BP7NumberOfHoursTerm*.OptionValue
      var value = values?.firstWhere( \ val -> val != null)
      if (value != null and values.hasMatch(\val -> val != null and val != value)) {
        Result.addError(BP7Line, ValidationLevel.TC_QUOTABLE, displaykey.Web.Policy.BP7.Validation.Building.FunctionalBuildingValuationEndorsementMustHaveTheSameWaitingPeriod)
      }
    }
  }

  private function validateApartmentBuildingsTenantsAutosSchedule() {
    Context.addToVisited(this, "validateApartmentBuildingsTenantsAutosSchedule")

    if (Context.isAtLeast(ValidationLevel.TC_DEFAULT) && BP7Line.BP7ApartmentBuildingsTenantsAutosExists) {
      var scheduleItems = BP7Line.BP7ApartmentBuildingsTenantsAutos.ScheduledItems
      if (scheduleItems.IsEmpty) {
        Result.addError(BP7Line, ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(BP7Line.BP7ApartmentBuildingsTenantsAutos.DisplayName))
      }

      var locationsCount = BP7Line.BP7ApartmentBuildingsTenantsAutos.ScheduledItems*.Location.toSet().Count
      if (locationsCount != scheduleItems.Count) {
        Result.addError(BP7Line, ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.BP7.Validation.Line.AtMostOneSchedItemForLocationOnApartmentBuildingsTenantsAutos)
      }
    }
  }

  private function validateRestaurantsLossOrDamageToCustomersAutosSchedule() {
    Context.addToVisited(this, "validateRestaurantsLossOrDamageToCustomersAutosSchedule")

    if (Context.isAtLeast(ValidationLevel.TC_DEFAULT) && BP7Line.BP7RestaurantsLossOrDamageToCustomersAutosLegalLiaExists) {
      var scheduleItems = BP7Line.BP7RestaurantsLossOrDamageToCustomersAutosLegalLia.ScheduledItems
      if (scheduleItems.IsEmpty) {
        Result.addError(BP7Line, ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(BP7Line.BP7RestaurantsLossOrDamageToCustomersAutosLegalLia.DisplayName))
      }

      var locationsCount = BP7Line.BP7RestaurantsLossOrDamageToCustomersAutosLegalLia.ScheduledItems*.Location.toSet().Count
      if (locationsCount != scheduleItems.Count) {
        Result.addError(BP7Line, ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.BP7.Validation.Line.AtMostOneSchedItemForLocationOnRestaurantsLossOrDamageToCustomerAutos)
      }
    }
  }

  private function validatePhotographySchedule() {
    Context.addToVisited(this, "validatePhotographySchedule")

    if(BP7Line.BP7PhotographyExists) {
      if (BP7Line.BP7Photography.BP7ScheduledItemsTerm.Value and BP7Line.BP7Photography.ScheduledItems.IsEmpty) {
        Result.addError( BP7Line, "default", displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(BP7Line.BP7Photography.DisplayName), "BP7")
      }
    }
  }

  private function validateOrdinanceOrLawWaitingPeriod() {
    Context.addToVisited(this, "ordinanceOrLawWaitingPeriodValidation")
    var numberOfDiffTermValues = BP7Line.AllBuildings
        .where(\building -> building.BP7OrdinanceOrLawCovExists and not (building.BP7OrdinanceOrLawCov.BP7HoursWaitingPeriodTerm.OptionValue == null))
        *.BP7OrdinanceOrLawCov*.BP7HoursWaitingPeriodTerm*.OptionValue.toSet().Count

    if (numberOfDiffTermValues > 1) {
      Result.addError(BP7Line,
          ValidationLevel.TC_QUOTABLE,
          displaykey.Web.Policy.BP7.Validation.Building.ordinanceOrLawWaitingPeriodMustBeTheSameAcrossAllBuildings)
    }
  }

  private function validatePolicyDefaultsDuringPolicyChange()
  {
    Context.addToVisited(this, "policyDefaultsDuringPolicyChange")
    //Basic-Policy Change Story
    var curperiod =BP7Line.AssociatedPolicyPeriod
    if(curperiod.Job.Subtype==typekey.Job.TC_POLICYCHANGE && curperiod.BP7Line.BP7LocationPropertyDeductibles_EXTExists) //covTerm.PatternCode=="BP7WindHailDeductible_EXT" &&
    {
      var basedonperiod = curperiod.BasedOn
      if(curperiod.BP7Line.BP7LocationPropertyDeductibles_EXT.HasBP7WindHailDeductible_EXTTerm &&
          basedonperiod.BP7Line.BP7LocationPropertyDeductibles_EXT.HasBP7WindHailDeductible_EXTTerm)
      {
        if(curperiod.BP7Line.BP7LocationPropertyDeductibles_EXT.BP7WindHailDeductible_EXTTerm.OptionValue.CodeIdentifier!=basedonperiod.BP7Line.BP7LocationPropertyDeductibles_EXT.BP7WindHailDeductible_EXTTerm.OptionValue.CodeIdentifier
         &&   basedonperiod.BP7Line.BP7LocationPropertyDeductibles_EXT.BP7WindHailDeductible_EXTTerm.OptionValue.CodeIdentifier!="NA_EXT")
        {
          Result.addError(BP7Line, ValidationLevel.TC_LOADSAVE, "Cannot change Windstorm Hail Percentage if original value was not Not Applicable")
        }
      }
    }
  }

  private function locationHasMoneyAndSecuritiesCoverage() : List<BP7Location> {
    var locations = BP7Line.BP7Locations.where(\ location -> location.BP7LocationMoneySecuritiesExists )
    return locations.toList()
  }

  private function eitherBothFilledOrBothEmpty(scheduledItem : BP7BusinessIncomeScheduledItem) : boolean {
    return scheduledItem.ExemptEmployee.HasContent == scheduledItem.ExemptJobClassification.HasContent
  }

  /**************************************************************************************
   * Validating all entities in this job step
   **************************************************************************************/    
  static function validateLineStep(line : BP7BusinessOwnersLine) {
    PCValidationContext.doPageLevelValidation( \ context -> {
      new BP7LineValidation(context, line).validateLine()
    })
  }

  override function validateLineForAudit() {
    throw new UnsupportedOperationException(displaykey.Validator.UnsupportedAuditLineError)
  }
}
