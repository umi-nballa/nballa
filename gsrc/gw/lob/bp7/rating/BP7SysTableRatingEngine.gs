package gw.lob.bp7.rating

uses gw.lob.common.util.DateRange

@Export
class BP7SysTableRatingEngine extends BP7AbstractRatingEngine<BP7Line> {

  construct(line : BP7Line) {
    super(line)
  }

  override function rateLiability(line : BP7BusinessOwnersLine, sliceToRate : DateRange) {
    //## todo: Implement me
  }

  override function rateBuilding(building : BP7Building, sliceToRate : DateRange) {
    new BP7BuildingRater(this).rateSlice(building, sliceToRate).each(\ costData -> {
      addCost(costData)
    })
  }

  override function rateClassification(classification : BP7Classification, sliceToRate : DateRange) {
    new BP7ClassificationRater(this).rateSlice(classification, sliceToRate).each(\ costData -> {
      addCost(costData)
    })
  }

  override property get NumDaysInCoverageRatedTerm(): int {
    return 365
  }
}
