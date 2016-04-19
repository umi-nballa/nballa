package gw.api.databuilder.bp7

uses gw.api.databuilder.DataBuilder
uses java.lang.Integer

class BP7LineScheduledItemBuilder extends DataBuilder<BP7LineSchedCovItem, BP7LineScheduledItemBuilder> {
  
  construct() {
    super(BP7LineSchedCovItem)
  }
  
  function withScheduleNumber(value : Integer) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#ScheduleNumber.PropertyInfo, value)
    return this
  }
  
  function withStringCol1 (value : String) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#StringCol1.PropertyInfo, value)
    return this
  }

  function withStringCol2 (value : String) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#StringCol2.PropertyInfo, value)
    return this
  }
  
  function withIntCol1 (value : Integer) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#IntCol1.PropertyInfo, value)
    return this
  }
  
  function withPosInt1 (value : Integer) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#PosIntCol1.PropertyInfo, value)
    return this
  }
  
  function withBoolCol1 (value : boolean) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#BoolCol1.PropertyInfo, value)
    return this
  }
  
  function withBoolCol2 (value : boolean) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#BoolCol2.PropertyInfo, value)
    return this
  }

  function withDateCol1 (value : boolean) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#DateCol1.PropertyInfo, value)
    return this
  }
  
  function withTypeKeyCol1 (value : String) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#TypeKeyCol1.PropertyInfo, value)
    return this
  }
  
  function withTypeKeyCol2 (value : String) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#TypeKeyCol2.PropertyInfo, value)
    return this
  }
  
  function withNonNegativeInt1 (posInt : Integer) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#NonNegativeInt1.PropertyInfo, posInt)
    return this
  }
  
  function withPolicyPeriod(value : PolicyPeriod) : BP7LineScheduledItemBuilder {
    set(BP7LineSchedCovItem#BranchValue.PropertyInfo, value)
    return this
  }
}
