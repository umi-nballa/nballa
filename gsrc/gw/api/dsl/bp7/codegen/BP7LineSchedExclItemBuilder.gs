package gw.api.dsl.bp7.codegen

uses gw.api.databuilder.DataBuilder
uses gw.api.builder.BuilderPropertyPopulator
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7LineSchedExclItemBuilder extends DataBuilder<BP7LineSchedExclItem, BP7LineSchedExclItemBuilder> {

  
  construct() {
    super(BP7LineSchedExclItem)
  }
  
  function withScheduleNumber(value : java.lang.Integer) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("ScheduleNumber"), value)
    return this
  }
  
  function withStringCol1(value : String) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("StringCol1"), value)
    return this
  }
  
  function withStringCol2(value : String) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("StringCol2"), value)
    return this
  }
  
  function withIntCol1(value : java.lang.Integer) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("IntCol1"), value)
    return this
  }
  
  function withPosIntCol1(value : java.lang.Integer) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("PosIntCol1"), value)
    return this
  }
  
  function withBoolCol1(value : boolean) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("BoolCol1"), value)
    return this
  }
  
  function withBoolCol2(value : boolean) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("BoolCol2"), value)
    return this
  }
  
  function withDateCol1(value : java.util.Date) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("DateCol1"), value)
    return this
  }
  
  function withTypeKeyCol1(value : String) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("TypeKeyCol1"), value)
    return this
  }
  
  function withTypeKeyCol2(value : String) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("TypeKeyCol2"), value)
    return this
  }
  
  function withNamedInsured(value : DataBuilder) : BP7LineSchedExclItemBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7LineSchedExclItem.Type.TypeInfo.getProperty("NamedInsured"), value))
    return this
  }
  
  function withNonNegativeInt1(value : java.lang.Integer) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("NonNegativeInt1"), value)
    return this
  }
  
  function withStringCol3(value : String) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("StringCol3"), value)
    return this
  }
  
  function withStringCol4(value : String) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("StringCol4"), value)
    return this
  }
  
  function withNonNegativeInt2(value : java.lang.Integer) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("NonNegativeInt2"), value)
    return this
  }
  
  function withBoolCol3(value : boolean) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("BoolCol3"), value)
    return this
  }
  
  function withBoolCol4(value : boolean) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("BoolCol4"), value)
    return this
  }
  
  function withBoolCol5(value : boolean) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("BoolCol5"), value)
    return this
  }
  
  function withLongStringCol1(value : String) : BP7LineSchedExclItemBuilder {
    set(BP7LineSchedExclItem.Type.TypeInfo.getProperty("LongStringCol1"), value)
    return this
  }
  
  function withLocation(value : DataBuilder) : BP7LineSchedExclItemBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7LineSchedExclItem.Type.TypeInfo.getProperty("Location"), value))
    return this
  }
  
  function withAdditionalInsured(value : DataBuilder) : BP7LineSchedExclItemBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7LineSchedExclItem.Type.TypeInfo.getProperty("AdditionalInsured"), value))
    return this
  }
  
  function withAdditionalInterest(value : DataBuilder) : BP7LineSchedExclItemBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7LineSchedExclItem.Type.TypeInfo.getProperty("AdditionalInterest"), value))
    return this
  }
  
  function withCondition(condition : PolicyConditionBuilder) : BP7LineSchedExclItemBuilder {
    throw "Unimplemented"
  }
  
  function withCoverage(coverage : CoverageBuilder) : BP7LineSchedExclItemBuilder {
    throw "Unimplemented"
  }
  
  function withExclusion(exclusion : ExclusionBuilder) : BP7LineSchedExclItemBuilder {
    throw "Unimplemented"
  }
  
}