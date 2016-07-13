package gw.lob.bp7.location

uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext
uses gw.validation.ValidationUtil
uses gw.policy.InvariantValidation
uses gw.lob.bp7.building.BP7BuildingValidation
uses gw.api.productmodel.Schedule
uses gw.lob.bp7.schedules.validation.BP7ScheduleValidation
uses gw.api.domain.Clause

@Export
class BP7LocationValidation extends PCValidationBase {
  private var _location : BP7Location
  
  construct(valContext : PCValidationContext, loc : BP7Location) {
    super(valContext)
    _location = loc
  }

  override protected function validateImpl() {
    Context.addToVisited( this, "validateImpl")
    validateLocation()
    validateChildren()
  }

  private function validateLocation() {
    Context.addToVisited( this, "validateLocation")
    requiredDataModelFields()
    atLeastOneBuilding()
    scheduleItems()
    fineArtsRequiresApartmentsOrRestaurants()
    validateSchedules()
  }

  private function validateChildren() {
    Context.addToVisited( this, "validateChildren")
    _location.Buildings.each(\ building -> new BP7BuildingValidation(Context, building).validate())
  }

  private function validateSchedules() {
    Context.addToVisited(this, "validateSchedules")
    _location.CoveragesConditionsAndExclusionsFromCoverable.whereTypeIs(Schedule).each( \ schedule -> new BP7ScheduleValidation(Context, schedule as Clause & Schedule).validate())
  }

  private function requiredDataModelFields() {
    Context.addToVisited(this, "requiredDataModelFields")
    
    if (_location.FeetToHydrant == null) {
      addLocationDataModelFieldError(displaykey.Web.Policy.BP7.Location.FeetToHydrant)
    }
    if (_location.FireProtectionClassPPC == null) {
      addLocationDataModelFieldError(displaykey.Web.Policy.BP7.Location.FireProtectionClass)
    }
    if (not _location.TerritoryCode.Code.HasContent) {
      addLocationDataModelFieldError(displaykey.Web.Policy.BP7.Location.TerritoryCode)
    }
  }  
  
  
  private function addLocationDataModelFieldError(errorMsg : String) {
    Result.addError(_location, Context.Level, displaykey.Web.Policy.BP7.Validation.MissingRequiredField(errorMsg, _location), "Locations")
  }
  
  private function atLeastOneBuilding() {
    if(_location.Buildings.IsEmpty) {
       Result.addError(_location, 
                       ValidationLevel.TC_QUOTABLE, 
                       displaykey.Web.Policy.BP7.Validation.Location.LocationWithoutBuilding(_location))
    }
  }

  private function scheduleItems() {
    if(_location.BP7DesignatedPremisesProjectExists) {
      if(_location.BP7DesignatedPremisesProject.ScheduledItems.IsEmpty){
        Result.addError(_location, 
                       ValidationLevel.TC_DEFAULT, 
                       displaykey.Web.Policy.BP7.Validation.Location.DesignatedPremisesWithoutItem(_location))
      }
      else{
        var scheduledItems = _location.BP7DesignatedPremisesProject.ScheduledItems
        var itemSet = scheduledItems
          .whereTypeIs(BP7LocSchedCondItem)
          .map(\ item -> item.DisplayName).toSet()
        if(itemSet.Count < scheduledItems.Count){
          Result.addError(_location, 
                         ValidationLevel.TC_DEFAULT, 
                         displaykey.Web.Policy.BP7.Validation.Location.DesignatedPremisesWithDuplicates(_location))
        }
      }
    }
  }

  private function fineArtsRequiresApartmentsOrRestaurants() {
    if(_location.BP7FineArtsExists and not (_location.BP7ApartmentBuildingsExists or _location.BP7RestaurantsExists)) {
      Result.addError(_location,
          ValidationLevel.TC_DEFAULT,
          displaykey.Web.Policy.BP7.Validation.Location.FineArtsRequiresApartmentsOrBuildings)
    }
  }

  /**************************************************************************************
   * Validating all entities in this job step
   **************************************************************************************/
  static function validateLocationsStep(period : PolicyPeriod) {
    var context = ValidationUtil.createContext(ValidationLevel.TC_DEFAULT)
    period.BP7Line.BP7Locations.each(\ loc -> {
      // validate product model for this location
      var invVal = new InvariantValidation(context, period)
      loc.CoveragesFromCoverable.each( \ cov ->  invVal.checkCovTerms(cov))
      new BP7LocationValidation(context, loc).validateLocation()
    })
    
    context.raiseExceptionIfProblemsFound()
  }
}
