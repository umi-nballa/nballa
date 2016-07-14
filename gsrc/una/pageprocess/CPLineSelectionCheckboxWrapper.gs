package una.pageprocess

uses gw.api.productmodel.PolicyLinePattern
uses gw.lob.cpp.ui.CPPLineSelectionScreenHelper

/**
 * User: amohammed
 * Date: 7/13/16
 * Time: 2:14 PM
 * To change this template use File | Settings | File Templates.
 */
class CPLineSelectionCheckboxWrapper {

  private var _policyLinePattern : PolicyLinePattern
  private var _period : PolicyPeriod
  private var _checkBoxValue : boolean

  construct(pattern : PolicyLinePattern, period : PolicyPeriod){
  _policyLinePattern = pattern
  _period = period
  _checkBoxValue = _period.getLineExists(pattern)
  }

  property get Value() : boolean {
    if(_period.getLineExists(_policyLinePattern) and _policyLinePattern.DisplayName.equalsIgnoreCase("Commercial Property Line")){
      _checkBoxValue = true
    }else{
      _checkBoxValue = false
    }
  return _checkBoxValue
  }

  property set Value(shouldCreateLine : boolean) {
  CPPLineSelectionScreenHelper.createOrRemoveLine(_period, _policyLinePattern, shouldCreateLine)
  _checkBoxValue = _period.getLineExists(_policyLinePattern)
  }
}

