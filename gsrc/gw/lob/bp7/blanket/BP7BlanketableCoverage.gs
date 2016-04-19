package gw.lob.bp7.blanket
uses java.lang.Integer

abstract class BP7BlanketableCoverage implements BP7Blanketable {
  private var  _blanket : BP7Blanket as Blanket

  construct(__blanket : BP7Blanket) {
    _blanket = __blanket
  }

  override property get Included() : boolean {
    return
      Blanket <> null and 
      Blanket.BlanketedCoverages.contains(this)
  }
  
  override property set Included(includeInBlanket : boolean) {
    if (includeInBlanket) {
      addToBlanket(Blanket)
    } else {
      removeFromBlanket()
    }
    Blanket.refreshLimit()
  }
  
  override property get LocationNumber() : Integer {
    return Location.Location.LocationNum
  }

  override property get BuildingNumber() : Integer {
    return Building.Building.BuildingNum
  }

  override property get ClassificationNumber() : Integer {
    return Classification.ClassificationNumber
  }
    
  override property get LocationDescription() : String {
    return Location.DisplayName
  }
  
  override property get BuildingDescription() : String {
    return Building.DisplayName
  }
  
  override property get ClassificationDescription()  : String {
    return Classification == null ? "" : Classification.DisplayName
  }
  
  override property get FontColor() : String {
    return (not Included ? "#808080" : null)
  }

  abstract protected function addToBlanket(blanketToAddTo : BP7Blanket)
  abstract protected function removeFromBlanket()

  abstract property get Location() : BP7Location
  abstract property get Building() : BP7Building
  abstract property get Classification() : BP7Classification
}
