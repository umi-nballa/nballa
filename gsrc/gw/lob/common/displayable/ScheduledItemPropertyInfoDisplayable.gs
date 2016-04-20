package gw.lob.common.displayable

uses gw.api.diff.DiffProperty
uses gw.api.productmodel.SchedulePropertyInfo
uses gw.api.productmodel.SchedulePropertyValueProvider
uses gw.api.web.job.JobWizardHelper
uses gw.lang.reflect.IPropertyInfo
uses gw.lob.common.dependency.FieldDependency
uses gw.validation.PCValidationContext

uses java.lang.Integer

class ScheduledItemPropertyInfoDisplayable<T> implements Displayable<T> {

  var _scheduledItem : ScheduledItem & EffDated as Entity
  var _propertyInfo : SchedulePropertyInfo
  var _displayableAdapter : SchedulePropertyInfoDisplayableAdapter

  protected var _valueProvider : SchedulePropertyValueProvider

  protected construct(scheduledItem : ScheduledItem, propertyInfo : SchedulePropertyInfo, displayableAdapter : SchedulePropertyInfoDisplayableAdapter) {
    _scheduledItem = scheduledItem as ScheduledItem & EffDated
    _propertyInfo = propertyInfo
    _displayableAdapter = displayableAdapter

    _valueProvider = PropertyValueProvider as SchedulePropertyValueProvider<T>
  }

  override property get Visible(): boolean {
    return _displayableAdapter.isVisible(_scheduledItem, _propertyInfo)
  }

  override property get Required(): boolean {
    return _propertyInfo.Required
  }

  override property get Label(): String {
    return _propertyInfo.Label
  }

  override property get Editable(): boolean {
    return _displayableAdapter.isEditable(_scheduledItem, _propertyInfo)
  }

  override property get Available() : boolean {
    return true
  }

  override property get ValueRange() : List<T> {
    return _displayableAdapter.getValueRange<T>(_scheduledItem, _propertyInfo as SchedulePropertyInfo<T>)
  }

  override property get Value(): T {
    return _valueProvider.Value as T
  }

  override property set Value(newValue: T) {
    _valueProvider.Value = newValue
  }

  override property get ValidValue(): T {
    return _displayableAdapter.getValidValue<T>(_scheduledItem, _propertyInfo as SchedulePropertyInfo<T>, Value)
  }

  override property get ShowConfirmMessage(): boolean {
    return false
  }

  override property get ConfirmMessage(): String {
    return null
  }

  override property get ValidateExpression(): String {
    return null
  }

  override function update() {
    Value = ValidValue
    if(not _displayableAdapter.isVisible(_scheduledItem, _propertyInfo)) {
      Value = null
    }
  }

  override function validate(valContext: PCValidationContext) {
    if (Value != ValidValue) {
      if (Editable) {
        addDependentValueError(valContext)
      } else {
        update()
      }
    }
  }

  override function onChange(wizard: JobWizardHelper) {
    if (Entity typeis FieldDependency) {
      Entity.updateDependentFields(null, wizard)
    }
  }

  protected property get PropertyValueRange() : List<T> {
    return _propertyInfo.ValueRange as List<T>
  }

  protected property get PropertyValueProvider() : SchedulePropertyValueProvider {
    return _propertyInfo.createValueProvider(_scheduledItem)
  }

  protected function addDependentValueError(valContext: PCValidationContext) {
    valContext.Result.addFieldError(
        Entity,
            PropertyInfo.Name,
            valContext.Level,
            displaykey.Web.Policy.Validation.Schedule.InvalidDependentValue(Label, Value, Entity.ScheduleParent, Entity),
            null
    )
  }

  override property get IntegerValue(): Integer {
    return Value as Integer
  }

  override property set IntegerValue(newValue: Integer) {
    Value = newValue as T
  }

  override property get PropertyInfo(): IPropertyInfo {
    return _propertyInfo.PropertyInfo
  }

  override function shouldSuppressOOSConflict(diffItem: DiffProperty) : boolean {
    // TODO: fix behaviour for schedule items
    return false
  }
}