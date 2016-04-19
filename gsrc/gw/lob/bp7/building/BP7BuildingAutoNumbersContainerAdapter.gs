package gw.lob.bp7.building

uses gw.lob.common.autonumbers.AbstractAutoNumbersContainerAdapter
uses gw.lang.reflect.IPropertyInfo

class BP7BuildingAutoNumbersContainerAdapter extends AbstractAutoNumbersContainerAdapter<BP7Building>{

  construct(owner : BP7Building) {
    super(owner)
  }


  override function containerInBranch(branch : PolicyPeriod) : BP7Building {
    return branch.BP7Line.BP7Locations*.Buildings.firstWhere(\ building -> building.FixedId == _owner.FixedId)
  }

  override function arrayProperty(sequence : IPropertyInfo) : IPropertyInfo {
    var propInfo : IPropertyInfo
    
    if(sequence == BP7Building#ClassificationAutoNumberSeq.PropertyInfo){
      propInfo = BP7Building#Classifications.PropertyInfo
    }
    
    return propInfo
  }

  override function numberFieldProperty(sequence : IPropertyInfo) : IPropertyInfo {
    var propInfo : IPropertyInfo
    
    if(sequence == BP7Building#ClassificationAutoNumberSeq.PropertyInfo){
      propInfo = BP7Classification#ClassificationNumber.PropertyInfo
    }
    
    return propInfo
  }

}
