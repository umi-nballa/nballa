package gw.lob.bp7

uses gw.api.domain.Clause
uses gw.api.domain.covterm.CovTerm
uses gw.api.productmodel.ClausePattern
uses gw.api.productmodel.CovTermPattern
uses gw.api.productmodel.Schedule
uses gw.api.productmodel.SchedulePropertyInfo
uses gw.lob.bp7.defaults.EntityCovTermDefaults
uses gw.lob.common.dependency.FieldDependency
uses gw.api.web.job.JobWizardHelper

uses java.util.HashMap
uses java.util.Map
uses java.math.BigDecimal

class BP7PostOnChangeHandler {
  static function clearOutScheduleItems(term : CovTerm) {
    var coverage = term.Clause as BP7LineSchedCov
    coverage.ScheduledItems = {}
  }

  static var COVTERMS_WITH_SCHEDULES : HashMap<ClausePattern, List<CovTermPattern>> = {
    "BP7BusinessIncome" -> {"BP7Exempt"},
    "BP7Photography" -> {"BP7ScheduledItems"}
  }

  static var CLAUSES_SCHEDULE_ITEMS_REQUIRE_VALIDATION : Map<ClausePattern, List<String>> = {
    "BP7FunctlBusnPrsnlPropValtn" -> {"Description"},
    "BP7BusinessIncome" -> {"Job Classification", "Employee"},
    "BP7AmendmentLiquorLiabExclExcptn" -> {"Description Of Premises Or Activities"},
    "BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs" -> {"Name Of Person Or Organization"},
    "BP7ContrctrsToolsAndEquipmntSchedule" -> {"Description of Item"},
    "BP7ProtectiveSafeguards" -> {"Protective Device Or Service Symbol"}
  }

  static public var COVTERMS_WITH_DEPENDENTS : Map<ClausePattern, List<CovTermPattern>> = {
    "BP7EmployeeDishty" -> {"BP7Limit6"},
    "BP7LimitedFungiBacteriaCov" -> {"BP7SeparatePremisesLocationsOption"},
    "BP7ComputerFraudFundsTransferFraud" -> {"BP7Limit4"},
    "BP7LocationComputerFraudFundsTransferFraud" -> {"BP7ComputerFraudApply"},
    "BP7LocationEmployeeDishty" -> {"BP7EmployeeDishtyApply"},
    "BP7LocationLimitedFungiOrBacteria" -> {"BP7SeparateAnnualAggregateLimit1"},
    "BP7LocationPropertyDeductibles" -> {"BP7OptionalDeductible"},
    "BP7BuildingLimitedFungiOrBacteria" -> {"BP7SeparateAnnualAggregateLimit"},
    "BP7BusinessLiability" -> {"BP7EachOccLimit", "BP7PropDamageLiabDed"},
    "BP7ClassificationBusinessPersonalProperty" -> {"BP7BusnPrsnlPropLimit"},
    "BP7Structure" -> {"BP7RatingBasis", "BP7BuildingLimit"},
    "BP7ContrctrsInstalltnTypes" -> {"BP7EachCoveredJobSiteLimit"},
    "BP7InformationSecurityProtectionEndorsement" -> {"BP7SecurityBreachLiabilityRetroactiveDateSelect",
                                                      "BP7CovTierSelect",
                                                      "BP7SupplementalExtendedReportingPeriod",
                                                      "BP7WebSitePublishingLiabilityRetroactiveDateSelect",
                                                      "BP7IncludeRiskCharacteristics",
                                                      "BP7BusinessIncomeAndExtraExpenseWaitingPeriodHours"},
    "BP7CondosCoOpsAssocsDirectorsAndOfficersLiab" -> {"BP7ExtddRptgPeriod"},
    "BP7EmploymentRelatedPracticesLiabilityCov" -> {"BP7AggLimit1"},
    "BP7FunctlBldgValtn" -> {"BP7BusinessIncomeExtraExpense"},
    "BP7RestaurantsLossOrDamageToCustomersAutosLegalLia" -> {"BP7OTCEachAutoDed1", "BP7OTCAnyOneEventDed1"},
    "BP7ApartmentBuildingsTenantsAutos" -> {"BP7OTCEachAutoDed", "BP7OTCAnyOneEventDed"},
    "BP7OrdinanceOrLawCov" -> {"BP7",
                               "BP7BusnIncomeAndExtraExpenseOptional"},
    "BP7Motels" -> {"BP7GuestsPropLimit"},
    "BP7Restaurants" -> {"BP7CovType1"},
    "BP7SpoilgCov" -> {"BP7CovType2"},
    "BP7NamedPerils" -> {"BP7BurglaryRobbery"},
    "BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItem" -> {"BP7Option"},
    "BP7CondoCommlUnitOwnersOptionalCovs" -> {"BP7Limit26"}
  }

  static public var COVTERMS_WITH_FIELD_LEVEL_VALIDATION : Map<ClausePattern, List<CovTermPattern>> = {
      "BP7OrdinanceOrLawCov" -> {"BP7Limit22", "BP7Limit23", "BP7Limit24"},
      "BP7LocationComputerFraudFundsTransferFraud" -> {"BP7ComputerFraudNumEmployees"},
      "BP7LocationEmployeeDishty" -> {"BP7NumEmployees1"},
      "BP7CondoCommlUnitOwnersOptionalCovs" -> {"BP7SubLimitForCondominiumAssociationDeductible"}
  }

  static function handleClause(coverable : Coverable, clausePattern : ClausePattern, value : boolean, helper : JobWizardHelper){
    coverable.setCoverageConditionOrExclusionExists(clausePattern, value)

    if(coverable typeis FieldDependency){
      coverable.updateDependentFields(null, helper)
    }

    if(value && coverable typeis EntityCovTermDefaults){
      coverable.CovTermDefaults.where( \ elt -> elt.DefaultToClause.Pattern == clausePattern)*.setDefault()
    }
  }

  static function handleTerm(term : CovTerm, helper : JobWizardHelper) {    
    // product model dependencies
    if (doesCovTermHaveDependent(term)) {
      sync(term, helper)
    }
    if(doesCovTermHaveSchedule(term)) {
      clearOutScheduleItems(term)
    }
    
    // special handling for dynamic defaults
    handleLineEachOccurrenceLimit(term)

    handleBPPCoverage(term)

    handleBuildingCoverage(term)
    
    // data model dependencies
    var coverable = term.Clause.OwningCoverable
    if (coverable typeis FieldDependency) {
      coverable.updateDependentFields(null, helper)
    }
  }

  static function handleLineEachOccurrenceLimit(term : CovTerm){
    var coverable = term.Clause.OwningCoverable
    if (coverable typeis BP7BusinessOwnersLine) {
      var liabilityCov = coverable.BP7BusinessLiability
      if (term == liabilityCov.BP7EachOccLimitTerm) {
        updateProdComplOpsAggrLimit(coverable)
      }
    }
  }

  static function updateProdComplOpsAggrLimit(line : BP7BusinessOwnersLine){
    var liabilityCov = line.BP7BusinessLiability
    var aggrLimitTerm = liabilityCov.BP7ProdCompldOpsAggregateLimitTerm
    if (aggrLimitTerm != null and aggrLimitTerm.Value == null and aggrLimitTerm.AvailableOptions.Count > 0) {
      aggrLimitTerm.OptionValue = aggrLimitTerm.AvailableOptions.sortBy(\ option -> option.Value).first()
    }else if (aggrLimitTerm != null and aggrLimitTerm.AvailableOptions.Count > 0) {
      aggrLimitTerm.setValueFromString((liabilityCov.BP7EachOccLimitTerm.Value * 2) as String)
    }
  }

  static function handleBPPCoverage(term : CovTerm){
    var coverable = term.Clause.OwningCoverable
    if (coverable typeis BP7Classification) {
      var blanket = coverable.BP7ClassificationBusinessPersonalProperty.Blanket
      if (blanket <> null) {
        blanket.evictNonEligibleCoverages()
      }
    }
  }
  
  static function handleBuildingCoverage(term : CovTerm) {
    var coverable = term.Clause.OwningCoverable
    if (coverable typeis BP7Building) {
      var blanket = coverable.BP7Structure.Blanket
      if (blanket <> null) {
        blanket.evictNonEligibleCoverages()
      }
    }
  }

  static function sync(term : CovTerm, helper : JobWizardHelper) {
    term.Clause.OwningCoverable.PolicyLine.AllCoverables*.bp7sync(helper)
  }

  static function doesCovTermHaveValidation(covTerm : CovTerm)  : boolean {
    return COVTERMS_WITH_FIELD_LEVEL_VALIDATION.get(covTerm.Clause.Pattern)?.contains(covTerm.Pattern)
  }

  static function doesCovTermHaveDependent(covTerm : CovTerm) : boolean {
    return COVTERMS_WITH_DEPENDENTS.get(covTerm.Clause.Pattern)?.contains(covTerm.Pattern)
  }
  
  static function doesCovTermHaveSchedule(covTerm : CovTerm) : boolean {
    return covTerm.Clause typeis Schedule
      and COVTERMS_WITH_SCHEDULES.get(covTerm.Clause.Pattern)?.contains(covTerm.Pattern)
  }
  
  static function doesClauseHaveSchedule(clause : Clause) : boolean {
    return clause typeis Schedule
      and not COVTERMS_WITH_SCHEDULES.Keys.contains(clause.Pattern)
  }

  static function doesClauseScheduleRequireValidation(clause : Clause, columnHeader : String) : boolean {
    return CLAUSES_SCHEDULE_ITEMS_REQUIRE_VALIDATION.get(clause.Pattern)?.contains(columnHeader)
  }
  
  static function validateScheduledItemField(scheduledItem : ScheduledItem, schedulePropertyInfo : SchedulePropertyInfo, value : String) : String {
    var schedule = scheduledItem.ScheduleParent
    var covPattern = (schedule as Clause).Pattern

    var columnValues = schedule.ScheduledItems
        .where(\ item -> item != scheduledItem)
        .map(\ item -> item.getFieldValue(schedulePropertyInfo.PropertyInfo.Name))

    if (columnValues.contains(value)) {
      switch(covPattern) {
        case "BP7FunctlBusnPrsnlPropValtn":
          return displaykey.Web.Policy.BP7.Validation.Classification.FunctionalValuationUniqueDescription(schedule.ScheduleName)
        case "BP7BusinessIncome":
          return displaykey.Web.Policy.BP7.Validation.Line.ExemptJobEmployeeUniqueness(schedulePropertyInfo.Label)
        case "BP7AmendmentLiquorLiabExclExcptn":
        case "BP7WaiverTransferRightsOfRecoveryAgainstOthersToUs":
        case "BP7ContrctrsToolsAndEquipmntSchedule":
        case "BP7ProtectiveSafeguards":
          return displaykey.Web.Policy.BP7.Validation.Line.DuplicateScheduleItemDescription(schedulePropertyInfo.Label)
        default:
          throw "Unknown schedule pattern " + covPattern
      }
    }
    
    return null
  }
}
