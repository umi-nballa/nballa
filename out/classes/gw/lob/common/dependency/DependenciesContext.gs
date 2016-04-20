package gw.lob.common.dependency

uses java.util.Map
uses java.util.HashMap
uses gw.lang.reflect.IPropertyInfo

class DependenciesContext {
  
  private var _changeMap : Map<IPropertyInfo, Object> as readonly ChangeMap

  construct() {
    _changeMap = new HashMap<IPropertyInfo, Object>()
  }
  
  construct(changedProperty : IPropertyInfo, oldValue : Object) {
    this()
    _changeMap.put(changedProperty, oldValue)
  }
  
  private construct(fromContext : DependenciesContext) {
    _changeMap = new HashMap<IPropertyInfo, Object>(fromContext.ChangeMap)
  }
  
  function addChange(changedProperty : IPropertyInfo, oldValue : Object) {
    _changeMap.put(changedProperty, oldValue)
  }
  
  function wasPropertyChanged(propertyToCheck : IPropertyInfo) : boolean {
    return _changeMap.containsKey(propertyToCheck)
  }
  
  function oldValue(propertyToCheck : IPropertyInfo) : Object {
    return _changeMap.get(propertyToCheck)
  }
  
  function contextForNextLevel() : DependenciesContext {
    var newContext = new DependenciesContext()
    newContext._changeMap = new HashMap<IPropertyInfo, Object>(_changeMap)
    return newContext
  }

}
