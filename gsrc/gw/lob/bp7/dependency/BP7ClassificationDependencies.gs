package gw.lob.bp7.dependency

uses gw.lob.bp7.utils.BP7SysTableQueryUtil
uses gw.lob.common.dependency.AbstractFieldDependency
uses gw.lob.common.dependency.FieldDependency
uses gw.validation.PCValidationContext

class BP7ClassificationDependencies extends AbstractFieldDependency<BP7Classification> {

  private static final var WIZARD_STEP_ID = "Buildings"

  construct(classification : BP7Classification) {
    super(classification)
  }

  override protected function doUpdate() {
    var classification = Dependant
    
    classification.ClassPropertyType = classPropertyType()
    classification.ClassDescription = classDescription()
    exposure()
    
    maybeResetCoverages()
    classification.bp7sync(Wizard)
  }

  override protected function doValidate(valContext : PCValidationContext) {
    var classification = Dependant
    
    if (classification.ClassPropertyType != classPropertyType()) {
      addDependentValueError(
        valContext, 
        BP7Classification#ClassPropertyType.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Classification.ClassPropertyType, 
        classification.ClassPropertyType.DisplayName)
    }
   // uim-svallabhapurapu : OOTB validation that needs to be commented based on PctOwnerOccupied.Code
   /* else if (classification.ClassDescription != classDescription()) {
      addDependentValueError(
        valContext, 
        BP7Classification#ClassDescription.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Classification.ClassDescription, 
        classification.ClassDescription.DisplayName)
    }*/
    
    else
      exposure()

  }
  
  override protected property get Children() : List<FieldDependency> {
    return {}
  }

  private function classPropertyType() : BP7ClassificationPropertyType {
    var classification = Dependant
    var previousValue = classification.ClassPropertyType
    var newValue = previousValue
    
    var listOfCodes = classification.ClassPropertyTypeValues
    if (listOfCodes.Count == 1) {
      newValue = listOfCodes.first()
    } else if (not listOfCodes.contains(classification.ClassPropertyType)){
      newValue = null
    }
    
    if (previousValue != newValue){
      DependenciesContext.addChange(BP7Classification#ClassPropertyType.PropertyInfo, previousValue)
    }

    return newValue
  }

  private function classDescription() : typekey.BP7ClassDescription {
    var classification = Dependant
    var previousValue = classification.ClassDescription
    var newValue = previousValue
        
    var listOfCodes = classification.ClassDescriptionValues
    if (listOfCodes.Count == 1) {
      newValue = listOfCodes.first()
    } else if (not listOfCodes.contains(classification.ClassDescription)){
      newValue = null
    }
    
    if (previousValue != newValue) {
      DependenciesContext.addChange(BP7Classification#ClassDescription.PropertyInfo, previousValue)
    }

    return newValue
  }

  private function exposure() {
    var classification = Dependant
    
    var previousBasisValue = classification.ExposureBasis
    classification.setExposureBasisValue()

    if(classification.ExposureBasis != previousBasisValue or not classification.isExposureApplicable){
      var previousExposureValue = classification.Exposure
      classification.Exposure = null
      
      if (previousExposureValue != null) {
        DependenciesContext.addChange(BP7Classification#Exposure.PropertyInfo, previousExposureValue)
      }
      if(classification.ExposureBasis != previousBasisValue) {
        DependenciesContext.addChange(BP7Classification#ExposureBasis.PropertyInfo, previousBasisValue)
      }
    }
  }
  
  private function maybeResetCoverages() {
    maybeResetCoveragesAffectedByPropertyTypeChange()
    maybeResetLandscapeCoverages()    
  }
  
  private function maybeResetCoveragesAffectedByPropertyTypeChange() {
    var classification = Dependant
    
    if (DependenciesContext.wasPropertyChanged(BP7Classification#ClassPropertyType.PropertyInfo)) {
      var previousPropertyType = DependenciesContext.oldValue(BP7Classification#ClassPropertyType.PropertyInfo) as BP7ClassificationPropertyType
      
      if (previousPropertyType == BP7ClassificationPropertyType.TC_MOTEL or 
          classification.ClassPropertyType == BP7ClassificationPropertyType.TC_MOTEL) {
        classification.removeMotelCoverages()
      }
      
      if (previousPropertyType == BP7ClassificationPropertyType.TC_SELFSTORAGEFACILITY or 
          classification.ClassPropertyType == BP7ClassificationPropertyType.TC_SELFSTORAGEFACILITY) {
        classification.removeSelfStorageCoverages()
      }
    }
  }
  
  private function maybeResetLandscapeCoverages() {
    var classification = Dependant
    if (DependenciesContext.wasPropertyChanged(BP7Classification#ClassPropertyType.PropertyInfo) or
        DependenciesContext.wasPropertyChanged(BP7Classification#ClassDescription.PropertyInfo) ) {

      var previousPropertyType : BP7ClassificationPropertyType
      var previousDescription  : typekey.BP7ClassDescription
      
      previousPropertyType = DependenciesContext.wasPropertyChanged(BP7Classification#ClassPropertyType.PropertyInfo)
                           ? DependenciesContext.oldValue(BP7Classification#ClassPropertyType.PropertyInfo) as BP7ClassificationPropertyType
                           : classification.ClassPropertyType

      previousDescription  = DependenciesContext.wasPropertyChanged(BP7Classification#ClassDescription.PropertyInfo)
                           ? DependenciesContext.oldValue(BP7Classification#ClassDescription.PropertyInfo) as typekey.BP7ClassDescription
                           : classification.ClassDescription
    
      var prevClassCode = BP7SysTableQueryUtil.getClassCode(previousPropertyType, 
                                                            previousDescription)
      var newClassCode  = BP7SysTableQueryUtil.getClassCode(classification.ClassPropertyType, 
                                                            classification.ClassDescription)
                                                          
      var isPrevLandscape = BP7SysTableQueryUtil.isLandscapeGardeningForClassification(prevClassCode)                                                         
      var isNewLandscape  = BP7SysTableQueryUtil.isLandscapeGardeningForClassification(newClassCode)                                                         

      if (isPrevLandscape != isNewLandscape) {
        classification.removeLandscapeBusinessCoverages()
      }
    }
  }
  
  private function addDependentValueError(valContext : PCValidationContext, fieldName : String, fieldDisplayName : String, fieldValue : String) {
    valContext.Result.addFieldError(
      Dependant,
      fieldName,
      valContext.Level, 
      displaykey.Web.Policy.BP7.Validation.InvalidDependentValue(
        fieldDisplayName, 
        fieldValue,
        displaykey.Web.Policy.BP7.Classification.Classification,
        Dependant), 
      WIZARD_STEP_ID)
  }
}
