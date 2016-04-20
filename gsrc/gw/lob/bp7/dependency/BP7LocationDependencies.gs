package gw.lob.bp7.dependency

uses gw.lob.common.dependency.AbstractFieldDependency
uses gw.lob.common.dependency.FieldDependency
uses gw.validation.PCValidationContext
uses java.lang.Integer
uses gw.lob.bp7.availability.BP7LiquorLiabilityGradeAvailabilityHelper
uses com.guidewire.commons.entity.type2.IEntityPropInfoInternal

class BP7LocationDependencies extends AbstractFieldDependency<BP7Location> {

  construct(location : BP7Location) {
    super(location)
  }

  override protected function doUpdate() {
    var location = Dependant
    location.LiquorLiabGrade = liquorLiabilityGrade()
  }

  override protected function doValidate(valContext : PCValidationContext) {
    var location = Dependant
    var newValue = liquorLiabilityGrade()
    if(DependenciesContext.wasPropertyChanged(BP7Location#LiquorLiabGrade.PropertyInfo)){
      if(newValue == null){
        // clean up
        location.LiquorLiabGrade = newValue
      }else{
        valContext.Result.addFieldError(
          location,
          BP7Location#LiquorLiabGrade.PropertyInfo.Name,
          valContext.Level, 
          displaykey.Web.Policy.BP7.Validation.InvalidDependentValue(
            displaykey.Web.Policy.BP7.Location.LiquorLiabGrade, 
            location.LiquorLiabGrade,
            displaykey.Web.Policy.BP7.Location.Location,
            Dependant),
          "Locations")
      }
    }
  }

  override protected property get Children() : List<FieldDependency> {
    return Dependant.Buildings.toList()
  }

  private function liquorLiabilityGrade() : Integer {
    var location = Dependant
    var liquorLiabilityVisible = new BP7LiquorLiabilityGradeAvailabilityHelper(location.Line).isVisible()

    var previousValue = location.LiquorLiabGrade
    var newValue = previousValue

    if(not liquorLiabilityVisible) {
      newValue = null
    } else if(location.LiquorLiabGrade == null) {
      var liquorLiabilityColumn = BP7Location#LiquorLiabGrade.PropertyInfo as IEntityPropInfoInternal
      newValue = liquorLiabilityColumn.DefaultValue as Integer
    }
    
    if (previousValue != newValue) {
      DependenciesContext.addChange(BP7Location#LiquorLiabGrade.PropertyInfo, previousValue)
    }
    
    return newValue
  }
}