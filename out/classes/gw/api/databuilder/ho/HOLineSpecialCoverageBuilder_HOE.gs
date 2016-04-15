package gw.api.databuilder.ho

uses gw.api.builder.CoverageBuilder

class HOLineSpecialCoverageBuilder_HOE extends CoverageBuilder {

  construct() {
     super(HomeownersLineCov_HOE)
  }

  function withCoveredLocation(coveredLocation : CoveredLocationBuilder_HOE) : HOLineSpecialCoverageBuilder_HOE {
    addAdditiveArrayElement(HomeownersLineCov_HOE.Type.TypeInfo.getProperty("CoveredLocations"), coveredLocation)
    return this
  }
  
}
