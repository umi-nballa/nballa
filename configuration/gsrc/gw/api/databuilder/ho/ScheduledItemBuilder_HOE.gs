package gw.api.databuilder.ho

uses gw.api.builder.BuilderPropertyPopulator
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.databuilder.DataBuilder
uses gw.entity.IEntityPropertyInfo
uses gw.api.databuilder.BuilderContext

class ScheduledItemBuilder_HOE extends DataBuilder<ScheduledItem_HOE, ScheduledItemBuilder_HOE> {

  construct() {
    super(ScheduledItem_HOE)
  }

  protected override function createBean(context : BuilderContext) : ScheduledItem_HOE{
    var cov = context.ParentBean as DwellingCov_HOE
    var scheduledItem = new ScheduledItem_HOE(cov.Dwelling.HOLine.Branch)
    cov.addScheduledItem(scheduledItem)
    return scheduledItem
  }
  
  function withDescription(description: String) : ScheduledItemBuilder_HOE {
    set(ScheduledItem_HOE.Type.TypeInfo.getProperty("Description"), description)
    return this
  }

  final function withAdditionalLimit(limit: AdditionalLiabLimit_HOE) : ScheduledItemBuilder_HOE {
    set(ScheduledItem_HOE.Type.TypeInfo.getProperty("AdditionalLimit"), limit)
    return this
  }
  
  final function withExposureValue(value: int) : ScheduledItemBuilder_HOE {
    set(ScheduledItem_HOE.Type.TypeInfo.getProperty("ExposureValue"), value)
    return this
  }
  
  final function withScheduleType(type: ScheduleType_HOE) : ScheduledItemBuilder_HOE {
    set(ScheduledItem_HOE.Type.TypeInfo.getProperty("ScheduleType"), type)
    return this
  }
  
  function withLocation(policyLocation : PolicyLocationBuilder) : ScheduledItemBuilder_HOE {
    addPopulator(new BuilderPropertyPopulator(ScheduledItem_HOE.Type.TypeInfo.getProperty("PolicyLocation") as IEntityPropertyInfo,
      policyLocation))
    return this
  }
}
