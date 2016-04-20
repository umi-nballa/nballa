package gw.lob.bp7

uses entity.windowed.BP7BuildingVersionList
uses gw.api.domain.LineSpecificBuilding
uses gw.api.policy.AbstractPolicyLineMethodsImpl
uses gw.api.productmodel.CoveragePattern
uses gw.api.tree.RowTreeRootNode
uses gw.api.util.JurisdictionMappingUtil
uses gw.lob.bp7.financials.BP7CostDisplayable
uses gw.lob.bp7.financials.BP7Qualifier
uses gw.lob.bp7.financials.BP7QuoteCostFilter
uses gw.lob.bp7.line.BP7LineValidation
uses gw.lob.bp7.rating.BP7RatingEngine
uses gw.lob.bp7.rating.BP7SysTableRatingEngine
uses gw.policy.PolicyLineValidation
uses gw.rating.AbstractRatingEngine
uses gw.rating.worksheet.treenode.WorksheetTreeNodeContainer
uses gw.rating.worksheet.treenode.WorksheetTreeNodeUtil
uses gw.validation.PCValidationContext

uses java.lang.Iterable
uses java.math.BigDecimal
uses java.util.ArrayList
uses java.util.HashSet
uses java.util.Map
uses java.util.Set

@Export
class BP7PolicyLineMethods extends AbstractPolicyLineMethodsImpl {

  var _line : entity.BP7BusinessOwnersLine

  construct(line : entity.BP7BusinessOwnersLine) {
    super(line)
    _line = line
  }

  override function syncComputedValues() {
    _line.refreshBlanketLimits()
  }

  override property get CoveredStates() : Jurisdiction[] {
    var states = new HashSet<Jurisdiction>()
    if (_line.BaseState != null) {
      states.add(_line.BaseState)
    }
    for (n in _line.BP7Locations) {
      states.add(JurisdictionMappingUtil.getJurisdiction(n.PolicyLocation))
    }
    for (n in _line.BP7Locations*.Buildings*.Classifications) {
      states.add(n.Building.CoverableState)
    }
    for (n in _line.AllBuildings*.Coverages.whereTypeIs(BP7BldgSchedCov)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.AllBuildings*.Conditions.whereTypeIs(BP7BldgSchedCond)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.AllBuildings*.Exclusions.whereTypeIs(BP7BldgSchedExcl)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.AllClassifications*.Coverages.whereTypeIs(BP7ClassSchedCov)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.AllClassifications*.Conditions.whereTypeIs(BP7ClassSchedCond)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.AllClassifications*.Exclusions.whereTypeIs(BP7ClassSchedExcl)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.AllCoverages.whereTypeIs(BP7LineSchedCov)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.AllConditions.whereTypeIs(BP7LineSchedCond)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.AllExclusions.whereTypeIs(BP7LineSchedExcl)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.BP7Locations*.Coverages.whereTypeIs(BP7LocSchedCov)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.BP7Locations*.Conditions.whereTypeIs(BP7LocSchedCond)*.ScheduledItems) {
      states.add(n.CoverableState)
    }
    for (n in _line.BP7Locations*.Exclusions.whereTypeIs(BP7LocSchedExcl)*.ScheduledItems) {
      states.add(n.CoverableState)
    }

    return states.toTypedArray()
  }

  override property get AllCoverables() : Coverable[] {
    var list : ArrayList<Coverable> = { _line }
    list.addAll(_line.BP7Locations*.Buildings*.Classifications.toList())
    list.addAll(_line.BP7Locations*.Buildings.toList())
    list.addAll(_line.BP7Locations.toList())
    // Add other coverables
    return list.toTypedArray()
  }

  override property get AllCoverages() : Coverage[] {
    return AllCoverables.flatMap(\ coverable -> coverable.CoveragesFromCoverable)
  }

  override property get AllExclusions() : Exclusion[] {
    return AllCoverables.flatMap(\ coverable -> coverable.ExclusionsFromCoverable)
  }

  override property get AllConditions() : PolicyCondition[] {
    return AllCoverables.flatMap(\ coverable -> coverable.ConditionsFromCoverable)
  }

  override property get AllModifiables() : Modifiable[] {
    var list : ArrayList<Modifiable> = { _line }
    // Add other modifiables
    return list.toTypedArray()
  }

  /**
   * All costs across the term, in window mode.
   */
  override property get CostVLs() : Iterable<entity.windowed.BP7CostVersionList> {
    return _line.VersionList.BP7Costs
  }

  override property get Transactions() : Set<Transaction> {
    var branch = _line.Branch
    return branch.getSlice(branch.PeriodStart).BP7Transactions.toSet()
  }

  override property get SupportsRatingOverrides() : boolean {
    return true
  }

  override function getCostForCoverage(covered : Coverable, pattern : CoveragePattern) : Cost {
    return _line.Branch.AllCosts.firstWhere(\ cost -> {
      return cost typeis BP7Cost and
             cost.Coverage != null and
             cost.Coverage.Pattern.CodeIdentifier == pattern.CodeIdentifier and
             cost.Coverage.OwningCoverable == covered
    }) as BP7Cost
  }

  override function createPolicyLineValidation(validationContext : PCValidationContext) : PolicyLineValidation {
    return new BP7LineValidation(validationContext, _line)
  }

  override function createPolicyLineDiffHelper(reason : DiffReason, policyLine : PolicyLine) : BP7DiffHelper {
    return new BP7DiffHelper(reason, _line, policyLine as entity.BP7BusinessOwnersLine)
  }

  override function getWorksheetRootNode(showConditionals : boolean) : RowTreeRootNode {
    var treeNodes : List<WorksheetTreeNodeContainer> = {}

    var filter = new BP7QuoteCostFilter(_line.AllCostsWindowMode)
    var locations = filter.children(new BP7Qualifier("/"))

    locations
      .sortBy(\ location -> location.toString())
      .each(\ location -> {
        var buildingCosts = filter.buildingCoverageCosts(location)*.RelatedWorksheetCost.toList()
        var classificationCosts = filter.classificationCoverageCosts(location)*.RelatedWorksheetCost.toList()
        var locationDescription = (buildingCosts.first() ?: classificationCosts.first()).DisplayLocation.DisplayName

        var locationContainer = createTitleContainer(locationDescription)
        treeNodes.add(locationContainer)

        var buildingContainer = createTitleContainer(displaykey.Web.Policy.BP7.Financials.Buildings)
        locationContainer.addChild(buildingContainer)

        buildingCosts.each(\ building -> {
          createCostContainer(buildingContainer, building, showConditionals)
        })

        var classificationContainer = createTitleContainer(displaykey.Web.Policy.BP7.Financials.Classifications)
        locationContainer.addChild(classificationContainer)
      
        classificationCosts.each(\ classification -> {
          createCostContainer(classificationContainer, classification, showConditionals)
        })
      })

    return WorksheetTreeNodeUtil.buildRootNode(treeNodes)
  }
  
  private function createCostContainer(parent : WorksheetTreeNodeContainer, cost : BP7CostDisplayable, showConditionals : boolean) {
    var costContainer = new WorksheetTreeNodeContainer(cost.DisplayDescription + ": " + cost.DisplayCoverageName)
    parent.addChild(costContainer)
    costContainer.addChildren(WorksheetTreeNodeUtil.buildTreeNodes(cost as Cost, showConditionals))
  }

  private function createTitleContainer(name : String) : WorksheetTreeNodeContainer {
    var titleContainer = new WorksheetTreeNodeContainer(name)
    titleContainer.ExpandByDefault = true
    return titleContainer
  }

  override function canSafelyDeleteLocation(location : PolicyLocation) : String {
    var currentOrFutureBP7LocationsMap = getCurrentOrFutureBP7LocationsEverForLocation(location)
      .partition(\ bp7Loc -> bp7Loc.EffectiveDate <= location.SliceDate ? "current" : "future")
    if (not (currentOrFutureBP7LocationsMap["current"] == null or currentOrFutureBP7LocationsMap["current"].Empty)) {
      return displaykey.Web.Policy.BP7.Location.CannotDelete.HasBP7Locations(location)
    } else if (not (currentOrFutureBP7LocationsMap["future"] == null or currentOrFutureBP7LocationsMap["future"].Empty)) {
      var futureDatesStr = currentOrFutureBP7LocationsMap["future"].map(\ bp7Loc -> bp7Loc.EffectiveDate).order().join(", ")
      return displaykey.Web.Policy.BP7.Location.CannotDelete.HasFutureBP7Locations(location, futureDatesStr)
    }
    return super.canSafelyDeleteLocation(location)
  }

  override function checkLocationInUse(location : PolicyLocation) : boolean {
    var hasCurrentOrFutureBP7LocationForLocation = getCurrentOrFutureBP7LocationsEverForLocation(location).HasElements
    return hasCurrentOrFutureBP7LocationForLocation or super.checkLocationInUse(location)
  }

  private function getCurrentOrFutureBP7LocationsEverForLocation(location : PolicyLocation) : List<BP7Location> {
   return _line.VersionList.BP7Locations.allVersionsFlat<BP7Location>()
     .where(\ loc -> loc.Location.FixedId == location.FixedId)  // all BP7 Locations pointing to the Policy location
     .where(\ loc -> loc.ExpirationDate > location.SliceDate) // all current and future BP7 Locations
  }

  override function onPrimaryLocationCreation(location : PolicyLocation) {
    _line.addToLineSpecificLocations(location.AccountLocation)
  }
  
  override function cloneAutoNumberSequences() {
    _line.BlanketAutoNumberSeq?.clone(_line.Bundle)
    _line.BP7Locations.each(\ location -> {
      location.Location.cloneBuildingAutoNumberSequence()
      location.Buildings.each(\ building -> building.cloneAutoNumberSequences())
    })
  }
  
  override function resetAutoNumberSequences() {
    _line.initializeNumberingOfBlankets(_line.Bundle)
    _line.BlanketAutoNumberSeq.reset()
    _line.BP7Locations.each(\ location -> {
      location.Location.resetBuildingAutoNumberSequence()
      location.Buildings.each(\ building -> building.resetAutoNumberSequences())
    })
  }
  override function bindAutoNumberSequences() {
    _line.bindNumberingOfBlankets()
    _line.BP7Locations.each(\ location -> {
      location.Location.bindBuildingAutoNumberSequence()
      location.Buildings.each(\ building -> building.bindAutoNumberSequences())
    })
  }

  override function renumberAutoNumberSequences() {
    _line.renumberNewBlankets()
    _line.BP7Locations.where(\location -> not location.New).each(\ location -> {
      location.Location.renumberBuildingAutoNumberSequence()
      location.Buildings.each(\ building -> building.renumberAutoNumberSequences())
    })
  }

  override function doGetTIVForCoverage(cov : Coverage) : BigDecimal {
    // fill this in if using TIV
    return BigDecimal.ZERO
  }

  override function createRatingEngine(method: RateMethod, parameters: Map<RateEngineParameter, Object>): AbstractRatingEngine<BP7Line> {
    if (RateMethod.TC_SYSTABLE == method) {
      return new BP7SysTableRatingEngine(_line as BP7Line)
    }
    return new BP7RatingEngine(_line as BP7Line, parameters[RateEngineParameter.TC_RATEBOOKSTATUS] as RateBookStatus)
  }

  override property get BaseStateRequired(): boolean {
    return true
  }

  override property get ContainsBuildings() : boolean {
    return true
  }

  override function getAllLineBuildingsEver() : List<LineSpecificBuilding> {
    return _line.VersionList.BP7Locations.arrays<BP7BuildingVersionList>("Buildings").allVersionsFlat<BP7Building>()
  }

  override protected function getCannotDeleteBuildingMessage(building : Building) : String {
    return displaykey.Web.Policy.BP7.Building.CannotDelete.HasBP7Building(building)
  }

  override protected function getCannotDeleteBuildingFutureMessage(building : Building, dates : String) : String {
    return displaykey.Web.Policy.BP7.Building.CannotDelete.HasFutureBP7Building(building, dates)
  }
}
