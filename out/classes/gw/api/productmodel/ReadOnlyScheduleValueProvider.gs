package gw.api.productmodel

uses gw.entity.IEntityPropertyInfo

class ReadOnlyScheduleValueProvider extends SchedulePropertyValueProvider<String>{
  private var _entity : ScheduledItem
  private var _prop : IEntityPropertyInfo
  private var _expression : String

  construct(item : ScheduledItem, propertyInfo : IEntityPropertyInfo, expression : String) {
    super(item, propertyInfo)
    _entity = item
    _prop = propertyInfo
    _expression = expression
  }

  override property get Value() : String {
    if (not _expression?.HasContent) {
      return super.Value
    }

    return eval(_expression) as String
  }

  override property set Value(obj : String) : void {
    // It's read-only
  }
}