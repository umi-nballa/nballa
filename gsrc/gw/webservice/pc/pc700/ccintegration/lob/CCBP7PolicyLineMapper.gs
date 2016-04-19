package gw.webservice.pc.pc700.ccintegration.lob

uses gw.webservice.pc.pc700.ccintegration.CCBasePolicyLineMapper
uses gw.webservice.pc.pc700.ccintegration.CCPolicyGenerator
uses java.lang.Integer

@Deprecated("As of 8.0 use gw.webservice.pc.pc800.ccintegration.lob.CCBP7PolicyLineMapper instead")
class CCBP7PolicyLineMapper extends CCBasePolicyLineMapper {

  var _bp7Line : BP7BusinessOwnersLine
  var _RUCount : Integer
  var _skipCount : Integer;
  
  construct(line : PolicyLine, policyGen : CCPolicyGenerator) {
    super(line, policyGen)
    _bp7Line = line as BP7BusinessOwnersLine
  }

  override function getLineCoverages() : List<entity.Coverage> {
    return _bp7Line.BP7LineCoverages as List<entity.Coverage>
  }
  
  override function createRiskUnits() {
    // Keep a count as we add risk units.  This may start > 0 if other lines have been processed first.
    _RUCount = _ccPolicy.RiskUnits.Count;
    var startingCount = _RUCount
    _skipCount = 0;


    addToPropertiesCount(_RUCount - startingCount + _skipCount)
  }
  
}
