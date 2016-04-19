package gw.lob.bp7.dependency

uses gw.lob.common.dependency.AbstractFieldDependency
uses gw.validation.PCValidationContext
uses gw.lob.common.dependency.FieldDependency

class BP7LineDependencies extends AbstractFieldDependency<BP7BusinessOwnersLine> {

  construct(line : BP7BusinessOwnersLine) {
    super(line)
  }

  override protected function doUpdate() {
    syncCoveragesOnBusinessTypeChange()
  }

  override function doValidate(valContext : PCValidationContext) {
  }

  override property get Children() : List<FieldDependency> {
    return Dependant.BP7Locations.toList()
  }
  
  private function syncCoveragesOnBusinessTypeChange() {
    if (DependenciesContext.wasPropertyChanged(BP7BusinessOwnersLine#BP7LineBusinessType.PropertyInfo)) {
      var line = Dependant
    
      var oldBusinessType = DependenciesContext.oldValue(BP7BusinessOwnersLine#BP7LineBusinessType.PropertyInfo)
      var currentBusinessType = line.BP7LineBusinessType    
    
      if(oldBusinessType == BP7PropertyType.TC_CONTRACTOR or currentBusinessType == BP7PropertyType.TC_CONTRACTOR){
          line.BP7LineCoverages.where(\ cov -> cov.Pattern.CoverageCategory == "BP7LineContractorBusGrp")
            .each(\ cov -> line.removeCoverageFromCoverable(cov))
      }
    
      line.bp7sync(Wizard)
    
      if(currentBusinessType == BP7PropertyType.TC_CONTRACTOR){
        line.createCoverage("BP7ContrctrsToolsAndEquipmntBlanket")
      }
    }
  }

}
