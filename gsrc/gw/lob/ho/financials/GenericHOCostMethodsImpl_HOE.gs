package gw.lob.ho.financials
@Export

class GenericHOCostMethodsImpl_HOE<T extends HomeownersCost_HOE> implements HOCostMethods_HOE {
  protected var _owner : T as readonly Cost
  construct(owner : T) {
     _owner = owner
  }
 override property get Coverage() : Coverage
  {
    return null
  }

  override property get Dwelling() : Dwelling_HOE {
    return null //## todo: Implement me
  }
  
  override property get State() : Jurisdiction
  {
    return null
  }

  override property get Location() : PolicyLocation
  {
    return null
  }

}
