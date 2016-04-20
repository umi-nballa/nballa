package gw.lob.bp7.rating

uses java.lang.Integer
uses java.math.RoundingMode
uses gw.lang.reflect.IType
uses gw.plugin.rateflow.CostDataBase
uses gw.plugin.rateflow.ICostDataWrapper
uses gw.plugin.rateflow.IRateRoutineConfig
uses gw.rating.CostDataWithOverrideSupport
uses gw.rating.flow.domain.CalcRoutineCostDataWithAmountOverride
uses gw.rating.flow.domain.CalcRoutineCostDataWithTermOverride
uses gw.lang.reflect.IPropertyInfo
uses gw.pc.rating.flow.AvailableCoverageWrapper

@Export
class BP7RateRoutineConfig implements IRateRoutineConfig {

  // no-args constructor required
  construct() {
  }

  override function getCostDataWrapperType(paramSet : CalcRoutineParameterSet) : IType {
    return CalcRoutineCostDataWithTermOverride
  }

  override function makeCostDataWrapper(
          paramSet : CalcRoutineParameterSet, 
          costData : CostDataBase, 
          defaultRoundingLevel : Integer, 
          defaultRoundingMode : RoundingMode
  ) : ICostDataWrapper {

    return new CalcRoutineCostDataWithTermOverride(
            costData as CostDataWithOverrideSupport, 
            CalcRoutineCostDataWithAmountOverride.OverrideMode.APPROXIMATE_STANDARD_RATES,
            defaultRoundingLevel,
            defaultRoundingMode
    )
  }

  override function worksheetsEnabledForLine(line : String) : boolean {
    return true
  }

  override function includeProperty(policyLinePatternCode: String, prop: IPropertyInfo): Boolean {
    return null //default behaviour
  }

  override function getCoverageWrappersForLine(linePatternCode: String): AvailableCoverageWrapper[] {
    return new AvailableCoverageWrapper[]{}
  }
}