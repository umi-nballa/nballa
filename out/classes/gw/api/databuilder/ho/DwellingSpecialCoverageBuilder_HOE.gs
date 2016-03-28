package gw.api.databuilder.ho
uses gw.api.builder.CoverageBuilder

class DwellingSpecialCoverageBuilder_HOE extends CoverageBuilder{

  construct() {
    super(DwellingCov_HOE)
  }
  
  final function withScheduledItem(item : ScheduledItemBuilder_HOE) : DwellingSpecialCoverageBuilder_HOE {
    addAdditiveArrayElement(DwellingCov_HOE.Type.TypeInfo.getProperty("ScheduledItems"), item)
    return this
  }

}
