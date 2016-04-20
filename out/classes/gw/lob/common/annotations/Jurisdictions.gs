package gw.lob.common.annotations

uses java.util.Set

class Jurisdictions implements IAnnotation {
  var _jurisdictions : Set<Jurisdiction>
  
  construct(jurisdictions : Set<Jurisdiction>) {
    _jurisdictions = jurisdictions
  }
  
  construct(jurisdiction : Jurisdiction) {
    this({jurisdiction})
  }  
  
  function includes(jurisdiction : Jurisdiction) : boolean {
    return _jurisdictions.contains(jurisdiction)
  }
}
