package gw.api.databuilder.ho

uses gw.api.builder.BuilderPropertyPopulator
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.databuilder.BuilderContext
uses gw.api.databuilder.DataBuilder
uses gw.entity.IEntityPropertyInfo

class HOLocationBuilder_HOE extends DataBuilder<HOLocation_HOE, HOLocationBuilder_HOE> {

  construct() {
    super(HOLocation_HOE)
  }
/*
  function withHOLocation(HOLocation: HOLocationBuilder_HOE) :HOLocationBuilder_HOE  {
    HOLocation = HOLocation
        .withDistHydrant(100)
        .withDistStation(10)
        .withFlooding(false)
        .withHOLine(hoLine)
        .withLocation(policyLocation)
        .withProtectionClass(protectionClass)
        .withWithinCommercial(true)
    return HOLocation
  }
*/  
  function withDistHydrant(distHydrant : int) : HOLocationBuilder_HOE {
    set(HOLocation_HOE.Type.TypeInfo.getProperty("DistanceToFireHydrant"), distHydrant)
    return this
  }
  
  function withDistStation(distStation : int) : HOLocationBuilder_HOE {
    set(HOLocation_HOE.Type.TypeInfo.getProperty("DistanceToFireStation"), distStation)
    return this
  }
  
  function withFlooding(flooding : boolean) : HOLocationBuilder_HOE {
    set(HOLocation_HOE.Type.TypeInfo.getProperty("FloodingHazard"), flooding)
    return this
  }
  
  function withProtectionClass(protectionClass : String) : HOLocationBuilder_HOE {
    set(HOLocation_HOE.Type.TypeInfo.getProperty("DwellingProtectionClassCode"), protectionClass)
    return this
  }
  
  function withWithinCommercial(withinCommercial : boolean) : HOLocationBuilder_HOE {
    set(HOLocation_HOE.Type.TypeInfo.getProperty("NearCommercial"), withinCommercial)
    return this
  }
  
  function withHOLine(hoLine : HomeownersLine_HOE) : HOLocationBuilder_HOE {
    set(HOLocation_HOE.Type.TypeInfo.getProperty("HOLine"), hoLine)
    return this
  }

  protected override function createBean(context : BuilderContext) : HOLocation_HOE {
    var dwelling = context.ParentBean as Dwelling_HOE
    return dwelling.HOLocation
  }
  
  function withLocation(policyLocation : PolicyLocationBuilder) : HOLocationBuilder_HOE {
    //set(HOLocation_HOE.Type.TypeInfo.getProperty("PolicyLocation"), policyLocation)
    addPopulator(new BuilderPropertyPopulator(HOLocation_HOE.Type.TypeInfo.getProperty("PolicyLocation") as IEntityPropertyInfo,
      policyLocation))
    return this
  }
  
}
