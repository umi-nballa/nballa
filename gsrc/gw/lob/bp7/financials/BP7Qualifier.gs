package gw.lob.bp7.financials

class BP7Qualifier {
  var _qualifier : List<String>

  construct(__qualifier : String) {
    validateQualifier(__qualifier)
    _qualifier = __qualifier.split("/").toList()
    if(_qualifier.HasElements) {
      _qualifier.remove(0)
    }
  }
  
  override function equals(rhs : Object) : boolean {
    if(rhs typeis BP7Qualifier) {
      return _qualifier == rhs._qualifier
    }
    return false
  }
  
  override function hashCode() : int {
    return _qualifier.hashCode()
  }

  override function toString() : String {
    return _qualifier.join(": ")
  }
  
  private function toPath(tokens : List<String>) : String {
    return "/" + tokens.join("/")
  }

  function leafOf(parent : BP7Qualifier) : boolean {
    return 
      this.childOf(parent) and 
      this.Depth == (parent.Depth + 1)
  }
  
  function childOf(parent : BP7Qualifier) : boolean {
    if (this.Depth < parent.Depth) {
      return false
    }

    var childPath = this._qualifier.subList(0, parent.Depth)
    return parent._qualifier == childPath
  }

  function nextLevel(parent : BP7Qualifier) : BP7Qualifier {
    var subpath = toPath(_qualifier.subList(0, parent.Depth + 1))
    return new BP7Qualifier(subpath)
  }

  property get Depth() : int {
    return _qualifier.Count
  }

  private function validateQualifier(qualifier : String) {
    if(qualifier == null or 
       qualifier.Empty or
       not qualifier.startsWith("/")) {
         throw "Empty qualifier is invalid"
    }
  }
}
