package gw.lob.common.displayable

uses gw.api.productmodel.CovTermPattern
uses gw.api.web.job.JobWizardHelper
uses gw.validation.PCValidationContext
uses java.lang.Integer
uses gw.lang.reflect.IPropertyInfo
uses gw.api.diff.DiffProperty

class ScheduledItemTermColumnDisplayable implements Displayable<Object> {

  var _scheduledItem : ScheduledItem
  var _pattern : CovTermPattern as Pattern

  construct(scheduledItem : ScheduledItem, pattern : CovTermPattern) {
    _scheduledItem = scheduledItem
    _pattern = pattern
  }

  override property get Visible() : boolean {
    return true
  }

  override property get Required() : boolean {
    return _pattern.Required
  }

  override property get Label() : String {
    return _pattern.DisplayName
  }

  override property get Editable() : boolean {
    return false
  }

  override property get Available() : boolean {
    return true
  }

  override property get ValueRange() : List<Object> {
    return null
  }

  override property get Value() : Object {
    if (_scheduledItem typeis Coverable) {
      var clause = _scheduledItem.getCoverageConditionOrExclusion(_pattern.ClausePattern)
      if (clause == null) {
        return ""
      }

      return clause.getCovTerm(_pattern).DisplayValue ?: ""
    }

    return ""
  }

  override property set Value(newValue : Object) {
  }

  override property get ValidValue() : Object {
    return null
  }

  override property get ShowConfirmMessage() : boolean {
    return false
  }

  override property get ConfirmMessage() : String {
    return null
  }

  override property get ValidateExpression(): String {
    return null
  }

  override function update() {
  }

  override function validate(valContext : PCValidationContext) {
  }

  override function onChange(wizard : JobWizardHelper) {
  }

  override property get IntegerValue(): Integer {
    return Value as Integer
  }

  override property set IntegerValue(newValue: Integer) {
    Value = newValue
  }

  override property get PropertyInfo(): IPropertyInfo {
    return null
  }

  override function shouldSuppressOOSConflict(diffItem: DiffProperty): boolean {
    return false
  }
}