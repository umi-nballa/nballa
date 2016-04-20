package gw.forms.generic

uses gw.forms.FormData
uses gw.forms.GenericFormInference
uses gw.admin.FormPatternValidation
uses gw.api.productmodel.PolicyLinePattern
uses gw.xml.XMLNode
uses java.util.Set
uses gw.forms.FormInferenceContext
uses gw.api.productmodel.PolicyLinePatternLookup
uses gw.entity.TypeKey
uses gw.lang.reflect.TypeSystem
uses gw.entity.ITypeList

class MultipleTypeKeysSelectionForm extends FormData implements GenericFormInference {
  var _coverables : Coverable[]

  override function populateInferenceData(context: FormInferenceContext, availableStates: Set<Jurisdiction>) {
    var entityType = TypeSystem.getByRelativeName(Pattern.CoverableType)
    _coverables = context.Period.AllCoverables.where(\ c -> entityType.isAssignableFrom(typeof c) and availableStates.contains(c.CoverableState))
  }

  override property get InferredByCurrentData(): boolean {
    if (_coverables.IsEmpty) {
      return false
    }
    if (Pattern.CoverableTypeKeyExistsOnAll) {
      for (var c in _coverables) {
        if (not acceptCoverable(c)) {
          return false
        }
      }
      return true
    } else {
      for (var c in _coverables) {
        if (acceptCoverable(c)) {
          return true
        }
      }
      return false
    }
  }

  override function addDataForComparisonOrExport(contentNode: XMLNode) {
    contentNode.addChild(createTextNode("CoverableTypeList", Pattern.CoverableTypeList))

    var covTypeKeys = new XMLNode("CoverableTypeKeys")
    Pattern.CoverableTypeKeys.each( \ typeKey -> {
      covTypeKeys.addChild(createTextNode("FormPatternTypeKey", typeKey.Code))
    })
    contentNode.addChild(covTypeKeys)


    var allCoverablesNode = new XMLNode("Coverables")
    contentNode.addChild(allCoverablesNode)
    for (var c in _coverables) {
      if (acceptCoverable(c)) {
        var coverableNode = new XMLNode("Coverable")
        coverableNode.addChild(createTextNode("FixedId", c.TypeIDString))
        allCoverablesNode.addChild(coverableNode)
      }
    }
  }

  function acceptCoverable(c : Coverable) : boolean {
    return Pattern.CoverableTypeKeys*.Code.contains((c[Pattern.CoverableTypeList] as TypeKey).Code)
  }

  override property get DisplayName(): String {
    return displaykey.Forms.Generic.MultipleTypeKeysSelectionForm
  }

  override property get ValidPolicylines(): List<PolicyLinePattern> {
    return PolicyLinePatternLookup.getAll()
  }

  override property get PolicyLineRequired(): boolean {
    return true
  }

  override function validateCustomFields(formPattern: FormPattern, validation: FormPatternValidation) {
    if (missingRequiredFields(formPattern, validation)) {
      return
    }

    if (formPattern.PolicyLinePatternRef == null) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.LineDoesNotExist(formPattern.DisplayName, formPattern.PolicyLinePatternCode))
      return
    } else if (not formPattern.PolicyLinePatternRef.Pattern.AllCoverableEntityTypes*.RelativeName.contains(formPattern.CoverableType)) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.IncompatibleCoverableType(
          formPattern.DisplayName, formPattern.PolicyLinePatternCode, formPattern.CoverableType))
      return
    }

    if (formPattern.CoverableTypeListRef == null) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.IncompatibleCoverableTypeList(
          formPattern.DisplayName, formPattern.CoverableType, formPattern.CoverableTypeList))
      return
    } else if (not (formPattern.CoverableTypeListRef.FeatureType typeis ITypeList)) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.InvalidCoverableTypeList(
          formPattern.DisplayName, formPattern.CoverableTypeList))
      return
    }

    if (not formPattern.CoverableTypeKeys.HasElements) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.IncompatibleCoverableTypeKeys(
          formPattern.DisplayName, formPattern.CoverableTypeList, formPattern.CoverableTypeKeys*.Code))
    }
  }

  protected function missingRequiredFields(formPattern : FormPattern, validation : FormPatternValidation) : boolean {
    var missingRequired = false
    if (formPattern.PolicyLinePatternCode == null) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.MissingRequired(formPattern.DisplayName, "PolicyLinePatternCode"))
      missingRequired = true
    }
    if (formPattern.CoverableType == null) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.MissingRequired(formPattern.DisplayName, "CoverableType"))
      missingRequired = true
    }
    if (formPattern.CoverableTypeList == null) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.MissingRequired(formPattern.DisplayName, "CoverableTypeList"))
      missingRequired = true
    }
    if (!formPattern.CoverableTypeKeys.HasElements) {
      validation.Result.addError(formPattern, "default", displaykey.Validation.FormPattern.Inference.MissingRequired(formPattern.DisplayName, "CoverableTypeKeys"))
      missingRequired = true
    }
    return missingRequired
  }

  override function clearCustomFields(formPattern: FormPattern) {
    formPattern.CoverableTypeKeyExistsOnAll = false
    formPattern.CoverableType = null
    formPattern.CoverableTypeList = null
    formPattern.clearCoverableTypeKeys()
  }
}