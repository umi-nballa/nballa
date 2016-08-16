package gw.lob.bp7.dependency

uses gw.lob.common.dependency.AbstractFieldDependency
uses gw.lob.common.dependency.FieldDependency
uses gw.validation.PCValidationContext
uses java.lang.Integer
uses gw.api.web.job.JobWizardHelper

class BP7BuildingDependencies extends AbstractFieldDependency<BP7Building> {

  private static final var WIZARD_STEP_ID = "Buildings"

  construct(building : BP7Building) {
    super(building)
  }

  override protected function doUpdate() {
    var building = Dependant

    building.TotalCondoBldgSquareFo = totalCondoBldgSquareFo()
    building.BldgCodeEffGrade = bldgCodeEffGrade()
    building.PctOwnerOccupied = percentageOwnerOccupied()

    building.bp7sync(Wizard)
  }

  override protected function doValidate(valContext : PCValidationContext) {
    var building = Dependant

    building.TotalCondoBldgSquareFo = totalCondoBldgSquareFo()

    if (building.BldgCodeEffGrade != bldgCodeEffGrade()) {
      addDependentValueError(
        valContext, 
        BP7Building#BldgCodeEffGrade.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Building.EffectivenessGrade, 
        building.BldgCodeEffGrade.DisplayName)
    }
    //Uim-svallabhapurapu : BOP story - PctOwnerOccupied field has been unavailable so commenting below validation
    /*if (building.PctOwnerOccupied != percentageOwnerOccupied()) {
      addDependentValueError(
        valContext,
        BP7Building#PctOwnerOccupied.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Building.PctOwnerOccupied, 
        building.PctOwnerOccupied.DisplayName)
    }*/
  }
  
  override protected property get Children() : List<FieldDependency> {
    return Dependant.Classifications.toList()
  }

  private function totalCondoBldgSquareFo() : Integer {
    var building = Dependant
    if (not building.TotalCondoBldgSquareFoVisible) {
      if (building.TotalCondoBldgSquareFo != null) {
        DependenciesContext.addChange(BP7Building#TotalCondoBldgSquareFo.PropertyInfo, building.TotalCondoBldgSquareFo)
      }
      return null
    }
    
    return building.TotalCondoBldgSquareFo
  }
  
  private function bldgCodeEffGrade() : BP7BldgCodeEffectivenessGrade {
    var building = Dependant
    var previousValue = building.BldgCodeEffGrade
    var newValue = previousValue

    var listOfCodes = building.BldgCodeEffGradeValues
    if (listOfCodes.Count == 1) {
      newValue = listOfCodes.first()
    } else if (not listOfCodes.contains(building.BldgCodeEffGrade)){
      newValue = null
    }

    if (newValue != previousValue) {
      DependenciesContext.addChange(BP7Building#BldgCodeEffGrade.PropertyInfo, previousValue)
    }
    
    return newValue
  }

  private function percentageOwnerOccupied() : BP7PctOwnerOccupied {
    var building = Dependant
    var previousValue = building.PctOwnerOccupied
    var newValue = previousValue
    
    var listOfCodes = building.PercentageOwnerOccupiedValues
    if (listOfCodes.Count == 1) {
      newValue = listOfCodes.first()
    } else if (not listOfCodes.contains(building.PctOwnerOccupied)){
      newValue = null
    }
    
    if (newValue != previousValue) {
      DependenciesContext.addChange(BP7Building#PctOwnerOccupied.PropertyInfo, previousValue)
    }
    return newValue
  }

  private function addDependentValueError(valContext : PCValidationContext, fieldName : String, fieldDisplayName : String, fieldValue : String) {
    valContext.Result.addFieldError(
      Dependant,
      fieldName,
      valContext.Level, 
      displaykey.Web.Policy.BP7.Validation.InvalidDependentValue(
        fieldDisplayName, 
        fieldValue,
        displaykey.Web.Policy.BP7.Building.Building,
        Dependant), 
      WIZARD_STEP_ID)
  }
}