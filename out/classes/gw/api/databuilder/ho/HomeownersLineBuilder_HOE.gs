package gw.api.databuilder.ho

uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.PolicyLineBuilderBase


class HomeownersLineBuilder_HOE extends PolicyLineBuilderBase<HomeownersLine_HOE, HomeownersLineBuilder_HOE> {

  construct() {
      super(HomeownersLine_HOE)
      setDefaults()
  }
  
  private function setDefaults() {
    withPolicyType(typekey.HOPolicyType_HOE.TC_HO3)
    withDwelling(new DwellingBuilder_HOE())
    withCoverage(new CoverageBuilder(HomeownersLineCov_HOE)  
                    .withPatternCode("HOLI_Personal_Liability_HOE")
                     .withOptionCovTerm("HOLI_Liability_Limit_HOE", "100,000"))
  }
  
  function withPolicyType(policyType : HOPolicyType_HOE) : HomeownersLineBuilder_HOE {
    set(HomeownersLine_HOE.Type.TypeInfo.getProperty("HOPolicyType"), policyType)    
    return this
  }
  
  function withDwelling(dwelling : DwellingBuilder_HOE) : HomeownersLineBuilder_HOE {
    set(HomeownersLine_HOE.Type.TypeInfo.getProperty("Dwelling"), dwelling)
    return this
  }
  
  function withCoverage(coverageBuilder : CoverageBuilder) : HomeownersLineBuilder_HOE {
    addArrayElement(HomeownersLine_HOE.Type.TypeInfo.getProperty("HOLineCoverages"), coverageBuilder)
    return this
  }

  function withCondition(conditionBuilder : PolicyConditionBuilder) : HomeownersLineBuilder_HOE {
    addArrayElement(HomeownersLine_HOE.Type.TypeInfo.getProperty("HOLineConditions"), conditionBuilder)
    return this
  }
  
  function withExclusion(exclusionBuilder : ExclusionBuilder) : HomeownersLineBuilder_HOE {
    addArrayElement(HomeownersLine_HOE.Type.TypeInfo.getProperty("HOLineExclusions"), exclusionBuilder)
    return this
  }
}
