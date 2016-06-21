package gw.lob.bp7.building

uses gw.lob.bp7.classification.BP7ClassificationValidation
uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext

uses java.math.BigDecimal

@Export
class BP7BuildingValidation extends PCValidationBase {
  private var _building : BP7Building
  
  construct(valContext : PCValidationContext, building : BP7Building) {
    super(valContext)
    _building = building
  }

  override function validateImpl() {
    Context.addToVisited( this, "validateImpl")
    validateBuilding()
    atLeastOneClassification()

    atMostOneClassificationWithPredominantOverride()
    atLeastTwoClassificationsForMixedPropertyType()
    morethanOneClassification()
    requiredCoverages()
    limitValidation()
    vacancyPermitDatesValidation()
    validateChildren()
  }
  
  private function validateBuilding() {
    Context.addToVisited( this, "validateBuilding")
    requiredDataModelFields()
    validateProtectiveSafeguardsSchedule()
  }
  
  private function requiredCoverages() {
    Context.addToVisited( this, "requiredCoverages")
    
    var isOver10Percent = _building.PctOwnerOccupied == typekey.BP7PctOwnerOccupied.TC_OVER10
    if (not _building.BP7StructureExists or isOver10Percent){
      if (not _building.Classifications.hasMatch(\ classification -> classification.BPPOrFunctionalValuationExists)){
        Result.addError(_building, 
                        ValidationLevel.TC_QUOTABLE, 
                          isOver10Percent 
                            ? displaykey.Web.Policy.BP7.Validation.Building.MissingBPPCoverageOnBuilding(_building)
                            : displaykey.Web.Policy.BP7.Validation.Building.MissingBuildingOrBPPCoverage(_building)
        ) 
      }
    }
  }
  
  private function validateProtectiveSafeguardsSchedule() {
    Context.addToVisited(this, "validateProtectiveSafeguardsSchedule")

    if(_building.BP7ProtectiveSafeguardsExists) {
      var scheduleItems = _building.BP7ProtectiveSafeguards.ScheduledItems

      if (scheduleItems.IsEmpty) {
        Result.addError(_building, "default", displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(
          _building.BP7ProtectiveSafeguards.DisplayName))
      }

      var uniqueDescriptions = scheduleItems*.getTypeKeyColumn("Symbol")*.Code.toSet()
      if (uniqueDescriptions.Count != scheduleItems.Count) {
        Result.addError(_building, "default", displaykey.Web.Policy.BP7.Validation.Line.DuplicateScheduleItemDescription(
          _building.BP7ProtectiveSafeguards.DisplayName))
      }
    }
  }

  private function validateChildren() {
    Context.addToVisited( this, "validateChildren")
    _building.Classifications.each(\ classification -> new BP7ClassificationValidation(Context, classification).validate())
  }

  private function atLeastOneClassification() {
    if(_building.Classifications.IsEmpty) {
       Result.addError(_building, 
                       ValidationLevel.TC_DEFAULT, 
                       displaykey.Web.Policy.BP7.Validation.Building.BuildingWithoutClassification(_building))
    }
  }

  private function atMostOneClassificationWithPredominantOverride() {
    var numPredomOverride = _building.Classifications.where(\ classification -> classification.PredominantOverride).Count
    if(numPredomOverride > 1) {
       Result.addError(_building, 
                       ValidationLevel.TC_QUOTABLE, 
                       displaykey.Web.Policy.BP7.Validation.Building.MultiplePredominantOverrides(_building.Building.BuildingNum))
    }
  }

  private function requiredDataModelFields() {    
    if (_building.PropertyType == null) {
      addDataModelFieldError(
        BP7Building#PropertyType.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Building.PropertyType)
    }
//    if (_building.BldgCodeEffGradeClass == null) {
//      addDataModelFieldError(
//        BP7Building#BldgCodeEffGradeClass.PropertyInfo.Name,
//        displaykey.Web.Policy.BP7.Building.EffectivenessGradeClass)
//    }
    if (_building.BldgCodeEffGrade == null) {
      addDataModelFieldError(
        BP7Building#BldgCodeEffGrade.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Building.EffectivenessGrade)
    }
    if (_building.ConstructionType == null) {
      addDataModelFieldError(
        BP7Building#ConstructionType.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Building.ConstructionType)
    }
    if (_building.Sprinklered == null) {
      addDataModelFieldError(
        BP7Building#Sprinklered.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Building.Sprinklered)
    }
//    if (_building.PctOwnerOccupied == null) {
//      addDataModelFieldError(
//        BP7Building#PctOwnerOccupied.PropertyInfo.Name,
//        displaykey.Web.Policy.BP7.Building.PctOwnerOccupied)
//    }
    if (_building.TotalCondoBldgSquareFoVisible and _building.TotalCondoBldgSquareFo == null) {
      addDataModelFieldError(
        BP7Building#TotalCondoBldgSquareFo.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Building.TotalCondominiumBuildingSquareFootage)
    }
  }

  private function addDataModelFieldError(fieldName : String, fieldDisplayName : String) {
    Result.addFieldError(
      _building, 
      fieldName, 
      Context.Level, 
      displaykey.Web.Policy.BP7.Validation.MissingRequiredField(
        fieldDisplayName, 
        _building), 
      "Buildings")
  }

  private function atLeastTwoClassificationsForMixedPropertyType() {
    Context.addToVisited(this, "atLeastTwoClassificationsForMixedPropertyType")

    if (Context.isAtLeast(ValidationLevel.TC_QUOTABLE) && _building.PropertyType == BP7PropertyType.TC_MIXED
        && _building.Classifications.Count < 2) {
      Result.addError(_building, ValidationLevel.TC_QUOTABLE,
          displaykey.Web.Policy.BP7.Validation.Building.LessThanTwoClassificationsForMixedPropertyType(_building.Location, _building))
    }
  }

  //Logic for BR2
  private function morethanOneClassification() {
    if(_building.Classifications.Count > 1) {
      Result.addError(_building,
          ValidationLevel.TC_DEFAULT,
          displaykey.Web.Policy.BP7.Validation.Building.Buildingmorethanoneclassification(_building))
    }
  }




  private function limitValidation() {
    Context.addToVisited( this, "limitValidation")

    if(_building.BP7UtilitySrvcsDirectDamageForBuildingExists
        and _building.BP7UtilitySrvcsDirectDamageForBuilding.BP7Limit43Term.Value > (_building.BuildingLimit ?: BigDecimal.ZERO)) {
      Result.addError(_building,
          ValidationLevel.TC_DEFAULT,
          displaykey.Web.Policy.BP7.Validation.Building.UtilityServicesDirectDamageLimitExceedsBuildingLimit(_building))
    }
  }

  private function vacancyPermitDatesValidation() {
    Context.addToVisited( this, "vacancyPermitDatesValidation")
    if(_building.BP7VacancyPermitExists) {
      if(_building.BP7VacancyPermit.BP7StartDateTerm.Value > _building.BP7VacancyPermit.BP7EndDateTerm.Value) {
        Result.addError(_building,
            ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.BP7.Validation.Building.VacancyPermitStartDateAfterEndDate)
      }

      if(_building.BP7VacancyPermit.BP7StartDateTerm.Value.compareIgnoreTime(_building.EffectiveDate) < 0
          or _building.BP7VacancyPermit.BP7StartDateTerm.Value.compareIgnoreTime(_building.ExpirationDate) > 0) {
        Result.addError(_building,
            ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.BP7.Validation.Building.VacancyPermitStartDateBeforeEffectiveDateOrAfterExpirationDate)
      }

      if(_building.BP7VacancyPermit.BP7EndDateTerm.Value.compareIgnoreTime(_building.EffectiveDate) < 0
          or _building.BP7VacancyPermit.BP7EndDateTerm.Value.compareIgnoreTime(_building.ExpirationDate) > 0) {
        Result.addError(_building,
            ValidationLevel.TC_DEFAULT,
            displaykey.Web.Policy.BP7.Validation.Building.VacancyPermitEndDateBeforePolicyEffectiveDateOrAfterExpirationDate)
      }
    }
  }

  /**************************************************************************************
   * Validating all entities in this job step
   **************************************************************************************/
  static function validateBuildingsAndClassificationsStep(line : BP7BusinessOwnersLine) {
    PCValidationContext.doPageLevelValidation( \ context -> {
      line.BP7Locations*.Buildings.each(\ building -> {
        new BP7BuildingValidation(context, building).validate()
      })
    })
  }
}
