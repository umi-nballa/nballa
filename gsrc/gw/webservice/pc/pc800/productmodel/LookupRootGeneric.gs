package gw.webservice.pc.pc800.productmodel

uses gw.api.productmodel.LookupRoot
uses gw.lang.reflect.IType
uses gw.lang.reflect.TypeSystem
uses gw.xml.ws.annotation.WsiExportable
uses gw.api.productmodel.PolicyLinePatternLookup
uses gw.api.productmodel.PolicyLinePattern
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/17/16
 * Time: 9:48 AM
 * To change this template use File | Settings | File Templates.
 */
@Export
@WsiExportable("http://guidewire.com/pc/ws/gw/webservice/pc/pc800/productmodel/LookupRootGeneric")
final class LookupRootGeneric implements LookupRoot {
  private var _productModelPolicyLinePattern : PolicyLinePattern
  var _lookupTypeInternal : IType
  var _lookupTypeName : String as LookupTypeName
  var _policyLinePatternCode : String as PolicyLinePatternCode
  var _productCode : String as ProductCode
  var _state : Jurisdiction as State
  var _policyType : PolicyTypeEnum as PolicyType
  var _UWCompanyCode : UWCompanyCode as UWCompanyCode

  construct() {
  }

  override function lookupType() : IType {
    if(_lookupTypeInternal == null){
      _lookupTypeInternal = TypeSystem.getByFullNameIfValid("entity." + LookupTypeName)
    }
    return _lookupTypeInternal
  }

  public property set LookupTypeName(name : String) {
    _lookupTypeName = name
    _lookupTypeInternal = null //reset lookup type internal so it's recalculated on next access
  }

  override function getValue(field : String, root : String) : Object {
    switch(field){
      case "PolicyLinePatternCode": return PolicyLinePatternCode
      case "State": return State
      case "ProductCode": return ProductCode
      case "UWCompanyCode": return UWCompanyCode
      case "HOPolicyType": return typekey.HOPolicyType_HOE.get(PolicyType.Code)
      case "PolicyType": return typekey.BAPolicyType.get(PolicyType.Code)
      default: return null
    }
  }

  property get ProductModelPolicyLinePattern() : PolicyLinePattern{
    if(_productModelPolicyLinePattern == null){
      _productModelPolicyLinePattern = PolicyLinePatternLookup.getAll().atMostOneWhere( \ policyLinePattern -> policyLinePattern.CodeIdentifier.equalsIgnoreCase(this.PolicyLinePatternCode))
    }

    return _productModelPolicyLinePattern
  }
}