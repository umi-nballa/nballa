package gw.api.dsl.bp7.codegen

uses gw.api.databuilder.DataBuilder
uses gw.api.builder.BuilderPropertyPopulator
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7BldgSchedCovItemBuilder extends DataBuilder<BP7BldgSchedCovItem, BP7BldgSchedCovItemBuilder> {

  
  construct() {
    super(BP7BldgSchedCovItem)
  }
  
  function withScheduleNumber(value : java.lang.Integer) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("ScheduleNumber"), value)
    return this
  }
  
  function withStringCol1(value : String) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("StringCol1"), value)
    return this
  }
  
  function withStringCol2(value : String) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("StringCol2"), value)
    return this
  }
  
  function withIntCol1(value : java.lang.Integer) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("IntCol1"), value)
    return this
  }
  
  function withPosIntCol1(value : java.lang.Integer) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("PosIntCol1"), value)
    return this
  }
  
  function withBoolCol1(value : boolean) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("BoolCol1"), value)
    return this
  }
  
  function withBoolCol2(value : boolean) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("BoolCol2"), value)
    return this
  }
  
  function withDateCol1(value : java.util.Date) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("DateCol1"), value)
    return this
  }
  
  function withTypeKeyCol1(value : String) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("TypeKeyCol1"), value)
    return this
  }
  
  function withTypeKeyCol2(value : String) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("TypeKeyCol2"), value)
    return this
  }
  
  function withNamedInsured(value : DataBuilder) : BP7BldgSchedCovItemBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("NamedInsured"), value))
    return this
  }
  
  function withNonNegativeInt1(value : java.lang.Integer) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("NonNegativeInt1"), value)
    return this
  }
  
  function withStringCol3(value : String) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("StringCol3"), value)
    return this
  }
  
  function withStringCol4(value : String) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("StringCol4"), value)
    return this
  }
  
  function withNonNegativeInt2(value : java.lang.Integer) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("NonNegativeInt2"), value)
    return this
  }
  
  function withBoolCol3(value : boolean) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("BoolCol3"), value)
    return this
  }
  
  function withBoolCol4(value : boolean) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("BoolCol4"), value)
    return this
  }
  
  function withBoolCol5(value : boolean) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("BoolCol5"), value)
    return this
  }
  
  function withLongStringCol1(value : String) : BP7BldgSchedCovItemBuilder {
    set(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("LongStringCol1"), value)
    return this
  }
  
  function withLocation(value : DataBuilder) : BP7BldgSchedCovItemBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("Location"), value))
    return this
  }
  
  function withAdditionalInsured(value : DataBuilder) : BP7BldgSchedCovItemBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("AdditionalInsured"), value))
    return this
  }
  
  function withAdditionalInterest(value : DataBuilder) : BP7BldgSchedCovItemBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7BldgSchedCovItem.Type.TypeInfo.getProperty("AdditionalInterest"), value))
    return this
  }
  
  function withCondition(condition : PolicyConditionBuilder) : BP7BldgSchedCovItemBuilder {
    throw "Unimplemented"
  }
  
  function withCoverage(coverage : CoverageBuilder) : BP7BldgSchedCovItemBuilder {
    addArrayElement(getValueType().TypeInfo.getProperty("Coverages"), coverage)
    return this
  }
  
  function withExclusion(exclusion : ExclusionBuilder) : BP7BldgSchedCovItemBuilder {
    throw "Unimplemented"
  }
  
}