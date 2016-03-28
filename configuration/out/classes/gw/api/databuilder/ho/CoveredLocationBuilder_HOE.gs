package gw.api.databuilder.ho

uses gw.api.builder.BuilderPropertyPopulator
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.databuilder.DataBuilder
uses gw.entity.IEntityPropertyInfo
uses gw.api.databuilder.BuilderContext

class CoveredLocationBuilder_HOE extends DataBuilder<CoveredLocation_HOE, CoveredLocationBuilder_HOE> {

  construct() {
    super(CoveredLocation_HOE)
  }

  protected override function createBean(context : BuilderContext) : CoveredLocation_HOE{
    var cov = context.ParentBean as HomeownersLineCov_HOE
    var coveredLocation = new CoveredLocation_HOE(cov.HOLine.Branch)
    cov.addCoveredLocation(coveredLocation)
    return coveredLocation
  }

  function withDescription(description: String) : CoveredLocationBuilder_HOE {
    set(CoveredLocation_HOE.Type.TypeInfo.getProperty("Description"), description)
    return this
  }

  function withLocationLimit(limit: LocationLimit_HOE) : CoveredLocationBuilder_HOE {
    set(CoveredLocation_HOE.Type.TypeInfo.getProperty("LocationLimit"), limit)
    return this
  }
  
  function withLocation(policyLocation : PolicyLocationBuilder) : CoveredLocationBuilder_HOE {
    addPopulator(new BuilderPropertyPopulator(CoveredLocation_HOE.Type.TypeInfo.getProperty("PolicyLocation") as IEntityPropertyInfo,
      policyLocation))
    return this
  }

}
