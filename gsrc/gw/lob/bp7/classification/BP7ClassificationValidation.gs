package gw.lob.bp7.classification

uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext
uses java.math.BigDecimal

@Export
class BP7ClassificationValidation extends PCValidationBase {
  private var _classification : BP7Classification
  
  construct(valContext : PCValidationContext, classification : BP7Classification) {
    super(valContext)
    _classification = classification
  }

  override function validateImpl() {
    Context.addToVisited( this, "validateImpl")

    productModelCovTerms()
    requiredDataModelFields()
    functionalBPPValuationSchedule()
    limitValidation()
  }

  private function productModelCovTerms() {
    Context.addToVisited(this, "productModelCovTerms")
  }
  
  private function functionalBPPValuationSchedule() {
    Context.addToVisited(this, "functionalBPPValuationSchedule")
    
    if (_classification.BP7FunctlBusnPrsnlPropValtnExists) {
      if (_classification.BP7FunctlBusnPrsnlPropValtn.ScheduledItems.IsEmpty) {
        Result.addError(
            _classification, 
            ValidationLevel.TC_DEFAULT, 
            displaykey.Web.Policy.BP7.Validation.AtLeastOneScheduleItem(
              _classification.BP7FunctlBusnPrsnlPropValtn.DisplayName),
            "Buildings")
      }
    }
  }
  
  private function requiredDataModelFields() {
    Context.addToVisited(this, "requiredDataModelFields")
    
    if (_classification.ClassPropertyType == null) {
      addDataModelFieldError(
        BP7Classification#ClassPropertyType.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Classification.ClassPropertyType)
    }
    if (_classification.ClassDescription == null) {
      addDataModelFieldError(
        BP7Classification#ClassDescription.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Classification.ClassDescription)
    }
    /** Commenting to get the deployment in - touch base with Thiagu later
    if (_classification.Area == null) {
      addDataModelFieldError(
        BP7Classification#Area.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Classification.Area)
    }
    */
    if (_classification.AmusementArea == null) {
      addDataModelFieldError(
        BP7Classification#AmusementArea.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Classification.AmusementArea)
    }
    if (_classification.Playground == null) {
      addDataModelFieldError(
        BP7Classification#Playground.PropertyInfo.Name, 
        displaykey.Web.Policy.BP7.Classification.Playground)
    }
  }

  private function addDataModelFieldError(fieldName : String, fieldDisplayName : String) {
    Result.addFieldError(
      _classification, 
      fieldName, 
      Context.Level, 
      displaykey.Web.Policy.BP7.Validation.MissingRequiredField(
        fieldDisplayName, 
        _classification), 
      "Buildings")
  }

  private function limitValidation() {
    var totalClassificationLimit = (_classification.BPPLimit ?: BigDecimal.ZERO) + (_classification.BP7FunctlBusnPrsnlPropValtn.TotalLimit ?: BigDecimal.ZERO)

    if(_classification.BP7UtilitySrvcsDirectDamageExists and _classification.BP7UtilitySrvcsDirectDamage.BP7Limit33Term.Value > totalClassificationLimit) {
      Result.addError(_classification,
          ValidationLevel.TC_DEFAULT,
          displaykey.Web.Policy.BP7.Validation.Classification.UtilityServicesDirectDamageLimitExceedsClassificationLimit(_classification))
    }
  }
}
