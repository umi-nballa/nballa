package gw.lob.bp7

uses gw.api.diff.DiffItem
uses gw.plugin.diff.impl.DiffHelper
uses gw.api.diff.DiffProperty
uses gw.lang.reflect.IPropertyInfo
uses gw.lob.common.util.LOBDiffUtil
uses gw.api.diff.DiffAdd
uses gw.entity.IEntityPropertyInfo

class BP7DiffHelper extends DiffHelper<entity.BP7BusinessOwnersLine> {

  construct(reason : DiffReason, bp7Line1 : entity.BP7BusinessOwnersLine, bp7Line2 : entity.BP7BusinessOwnersLine) {
    super(reason, bp7Line1, bp7Line2)
  }

  /**
   * Should be used to add diff items that apply to this LOB, e.g. line-level coverages
   * @param diffItems - list of diff items to add to
   * @return List<DiffItem> - returns the list of diff items that we've modified
   */
  override function addDiffItems(diffItems : List<DiffItem>) : List<DiffItem> {
    diffItems = super.addDiffItems(diffItems)


    // Add line-specific data model items to the comparison set, such as line-level coverages, coverables, line-specific Cost entities, etc.
    diffItems.addAll(this.compareLineField("DateBusinessStarted", 0))
    diffItems.addAll(this.compareLineField("BP7LineBusinessType", 0))
    diffItems.addAll(this.compareLineField("BusinessDesc", 0))

    diffItems.addAll(this.compareLineField("BP7LineCoverages", 1))
    diffItems.addAll(this.compareLineField("BP7LineExclusions", 1))
    diffItems.addAll(this.compareLineField("BP7LineConditions", 1))

    diffItems.addAll(this.compareLineField("BP7Locations", 4))
    addBlanketDiffs(diffItems)

    return diffItems
  }

  private function addBlanketDiffs(diffItems : List<DiffItem>) : List<DiffItem> {
    var blanketDiffItems = this.compareLineField("Blankets", 2)
    for (item in blanketDiffItems) {
      if (not isBlanketable(item.Bean)) {
        diffItems.add(item)
      }
    }

    diffItemsFrom<BP7BuildingCov>(Line1.AllBuildings*.Coverages.toList(),
        Line2.AllBuildings*.Coverages.toList(),
        diffItems)

    diffItemsFrom<BP7ClassificationCov>(Line1.AllClassifications*.Coverages.toList(),
        Line2.AllClassifications*.Coverages.toList(),
        diffItems)

    return diffItems
  }

  private function diffItemsFrom<C extends EffDated>(v1 : List<C>, v2 : List<C>, diffItems : List<DiffItem>) {
    for (candidate in v2) {
      var matchingCov = v1.firstWhere(\ cov -> cov.FixedId == candidate.FixedId)
      if (matchingCov != null) {
        var matchingBlanket = matchingCov.getFieldValue("Blanket") as EffDated
        var candidateBlanket = candidate.getFieldValue("Blanket") as EffDated
        if (candidateBlanket.FixedId != matchingBlanket.FixedId) {
          diffProperty<C>(diffItems, candidate, matchingCov)
        }
      } else {
        diffItems.add(new DiffAdd(candidate))
      }
    }
  }

  private function isBlanketable(bean : KeyableBean) : boolean {
    return bean typeis BP7BuildingCov ||
        bean typeis BP7ClassificationCov
  }

  private function diffProperty<T extends KeyableBean>(diffItems: List<DiffItem>, entityV1 : KeyableBean, entityV2 : KeyableBean) {
    var  prop = T.Type.TypeInfo.getProperty("Blanket") as IEntityPropertyInfo
    diffItems.add(new DiffProperty(entityV1, entityV2, prop))
  }

  /**
   * Filters diff items that apply to this LOB
   * @param diffItems - list of diff items to filter
   * @return List<DiffItem> - returns the list of diff items that we've modified
   */
  override function filterDiffItems(diffItems : List<DiffItem>) : List<DiffItem> {
    diffItems = super.filterDiffItems(diffItems)

    // Add line-specific filtering logic here
    diffItems.removeWhere(\diff -> diff typeis DiffProperty and isInitialClausePropertyInfo(diff))

    diffItems.removeWhere(\ diff -> shouldRemoveDiff(diff) )

    return diffItems
  }

  private function isInitialClausePropertyInfo(diffProperty : DiffProperty) : boolean {
    return diffProperty.PropertyInfo.Name == "InitialCoveragesCreated"
        or diffProperty.PropertyInfo.Name == "InitialExclusionsCreated"
        or diffProperty.PropertyInfo.Name == "InitialConditionsCreated"
  }

  private function shouldRemoveDiff(diff : DiffItem) : boolean {
    var dependentConflicts = 0
    if (DifferenceReason == "ApplyChanges" and diff.OOSConflict and diff typeis DiffProperty) {
      if (LOBDiffUtil.isAvailabilityDiff(diff)) return true
      diff.OOSConflictingVersions.each(\ oosVersion -> {
        if (
          shouldRemoveLineConflict(diff.Bean, oosVersion, diff.PropertyInfo) or
          shouldRemoveLocationConflict(diff.Bean, oosVersion, diff.PropertyInfo) or
          shouldRemoveBuildingConflict(diff.Bean, oosVersion, diff.PropertyInfo) or
          shouldRemoveClassificationConflict(diff.Bean, oosVersion, diff.PropertyInfo) or
          shouldRemoveBlanketConflict(diff.Bean, diff.PropertyInfo)
        ) {
          dependentConflicts++
        }
      })

      return (dependentConflicts == diff.OOSConflictingVersions.Count)
    } else

    if ((DifferenceReason == "PolicyReview" or DifferenceReason == "MultiVersionJob" or DifferenceReason == "CompareJobs")
        and diff.Property
        and LOBDiffUtil.isAvailabilityDiff(diff.asProperty())) {
      // do not show diffs for availability changes
      return true
    }

    return false
  }

  private function shouldRemoveConflictLimitedFungiBacteriaCov(
      coverage : BP7LimitedFungiBacteriaCov, otherCoverage : BP7LimitedFungiBacteriaCov, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7LimitedFungiBacteriaCov#DirectTerm1.PropertyInfo and
      coverage.BP7SeparatePremisesLocationsOptionTerm.Value != otherCoverage.BP7SeparatePremisesLocationsOptionTerm.Value
       
  }

  private function shouldRemoveLineConflict(bean : KeyableBean, oosVersion : KeyableBean, diffPropInfo : IPropertyInfo) : boolean {
    return
      bean typeis BP7LimitedFungiBacteriaCov and
      shouldRemoveConflictLimitedFungiBacteriaCov(bean, oosVersion as BP7LimitedFungiBacteriaCov, diffPropInfo)
  }

  private function shouldRemoveConflictLocationLimitedFungiOrBacteria(
      coverage : BP7LocationLimitedFungiOrBacteria, otherCoverage : BP7LocationLimitedFungiOrBacteria, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7LocationLimitedFungiOrBacteria#DirectTerm1.PropertyInfo and
      coverage.BP7SeparateAnnualAggregateLimit1Term.OptionValue != otherCoverage.BP7SeparateAnnualAggregateLimit1Term.OptionValue
  }

  private function shouldRemoveConflictLocationEmployeeDishty(
      coverage : BP7LocationEmployeeDishty, otherCoverage : BP7LocationEmployeeDishty, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7LocationEmployeeDishty#DirectTerm1.PropertyInfo and
      coverage.BP7EmployeeDishtyApplyTerm.OptionValue != otherCoverage.BP7EmployeeDishtyApplyTerm.OptionValue
  }

  private function shouldRemoveConflictLocationComputerFraudFundsTransferFraud(
      coverage : BP7LocationComputerFraudFundsTransferFraud, otherCoverage : BP7LocationComputerFraudFundsTransferFraud, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7LocationComputerFraudFundsTransferFraud#DirectTerm1.PropertyInfo and
      coverage.BP7ComputerFraudApplyTerm.OptionValue != otherCoverage.BP7ComputerFraudApplyTerm.OptionValue
  }

  private function shouldRemoveLocationConflict(bean : KeyableBean, oosVersion : KeyableBean, diffPropInfo : IPropertyInfo) : boolean {
    return 
      (
        bean typeis BP7LocationLimitedFungiOrBacteria and
        shouldRemoveConflictLocationLimitedFungiOrBacteria(bean, oosVersion as BP7LocationLimitedFungiOrBacteria, diffPropInfo)
      ) or
      (
        bean typeis BP7LocationEmployeeDishty and
        shouldRemoveConflictLocationEmployeeDishty(bean, oosVersion as BP7LocationEmployeeDishty, diffPropInfo)
      ) or
      (
        bean typeis BP7LocationComputerFraudFundsTransferFraud and
        shouldRemoveConflictLocationComputerFraudFundsTransferFraud(bean, oosVersion as BP7LocationComputerFraudFundsTransferFraud, diffPropInfo)
      ) or
      (
        bean typeis BP7Location and
        shouldRemoveConflictLocationLiquorLiabilityGrade(bean, oosVersion as BP7Location, diffPropInfo)
      )
  }

  private function shouldRemoveConflictLocationLiquorLiabilityGrade(location : BP7Location, otherLocation : BP7Location, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7Location#LiquorLiabGrade.PropertyInfo and
      (location.LiquorLiabGrade == null) != (otherLocation.LiquorLiabGrade == null)
  }

  private function shouldRemoveConflictPctOwnersOccupied(building : BP7Building, otherBuilding : BP7Building, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7Building#PctOwnerOccupied.PropertyInfo and 
      building.BP7StructureExists != otherBuilding.BP7StructureExists
  }

  private function shouldRemoveConflictTotalCondoBldgSquareFo(building : BP7Building, otherBuilding : BP7Building, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7Building#TotalCondoBldgSquareFo.PropertyInfo and
      building.TotalCondoBldgSquareFoVisible != otherBuilding.TotalCondoBldgSquareFoVisible
  }

  private function shouldRemoveConflictBuildingLimitedFungiOrBacteria(
      coverage : BP7BuildingLimitedFungiOrBacteria, otherCoverage : BP7BuildingLimitedFungiOrBacteria, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7BuildingLimitedFungiOrBacteria#DirectTerm1.PropertyInfo and
      coverage.BP7SeparateAnnualAggregateLimitTerm.OptionValue != otherCoverage.BP7SeparateAnnualAggregateLimitTerm.OptionValue
  }

  private function shouldRemoveBuildingConflict(bean : KeyableBean, oosVersion : KeyableBean, diffPropInfo : IPropertyInfo) : boolean {
    return 
      (
        bean typeis BP7Building and 
        (
          shouldRemoveConflictPctOwnersOccupied(bean, oosVersion as BP7Building, diffPropInfo) or 
          shouldRemoveConflictTotalCondoBldgSquareFo(bean, oosVersion as BP7Building, diffPropInfo)
        )
      ) or
      (
        bean typeis BP7BuildingLimitedFungiOrBacteria and
        shouldRemoveConflictBuildingLimitedFungiOrBacteria(bean, oosVersion as BP7BuildingLimitedFungiOrBacteria, diffPropInfo)
      )
  }

  private function shouldRemoveConflictExposureBasis(diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7Classification#ExposureBasis.PropertyInfo
  }

  private function shouldRemoveConflictExposure(classification : BP7Classification, otherClassification : BP7Classification, diffPropInfo : IPropertyInfo) : boolean {
    return
      diffPropInfo == BP7Classification#Exposure.PropertyInfo and
      classification.isExposureApplicable != otherClassification.isExposureApplicable
  }

  private function shouldRemoveClassificationConflict(bean : KeyableBean, oosVersion : KeyableBean, diffPropInfo : IPropertyInfo) : boolean {
    return
      bean typeis BP7Classification and
      (
        shouldRemoveConflictExposureBasis(diffPropInfo) or
        shouldRemoveConflictExposure(bean, oosVersion as BP7Classification, diffPropInfo)
      )
  }

  private function shouldRemoveBlanketConflict(bean : KeyableBean, diffPropInfo : IPropertyInfo) : boolean {
    return 
      bean typeis BP7Blanket and
      diffPropInfo == BP7Blanket#BlanketLimit.PropertyInfo
  }
}