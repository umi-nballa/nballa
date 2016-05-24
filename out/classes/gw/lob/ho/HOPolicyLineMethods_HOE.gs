package gw.lob.ho

uses java.util.HashSet
uses java.util.ArrayList
uses gw.api.policy.AbstractPolicyLineMethodsImpl
uses java.util.Set
uses gw.policy.PolicyLineValidation
uses gw.validation.PCValidationContext
uses gw.plugin.diff.impl.HODiffHelper
uses gw.api.util.JurisdictionMappingUtil
uses java.math.BigDecimal
uses entity.windowed.HomeownersCost_HOEVersionList
uses java.lang.Iterable
uses java.util.Map
uses gw.rating.AbstractRatingEngine
uses gw.lob.ho.rating.HORatingEngine_HOE
uses gw.policy.PolicyEvalContext
uses gw.lob.common.UnderwriterEvaluator
uses una.lob.ho.HOE_UnderwriterEvaluator

@Export
class HOPolicyLineMethods_HOE extends AbstractPolicyLineMethodsImpl
{
  var _line : entity.HomeownersLine_HOE

  construct(owner : entity.HomeownersLine_HOE)  {
    super(owner)
   _line = owner
  }
  
  override property get CoveredStates() : Jurisdiction[] {
    var covStates = new HashSet<Jurisdiction>()
    for (loc in _line.Branch.PolicyLocations) {
      covStates.add( JurisdictionMappingUtil.getJurisdiction(loc) )
    }
    return covStates as Jurisdiction[]
  }
  
  override property get AllCoverages() : Coverage[] {
    var covs = new ArrayList<Coverage>()
    covs.addAll( _line.HOLineCoverages.toList() )
    covs.addAll( _line.Dwelling.Coverages.toList() )
    return covs as Coverage[]
  }

  override property get AllExclusions() : Exclusion[] {
    return _line.HOLineExclusions
  }

  override property get AllConditions() : PolicyCondition[] {
    return _line.HOLineConditions
  }

  override property get AllCoverables() : Coverable[] {
    var list : ArrayList<Coverable> = {_line}
    list.add(_line.Dwelling)
    return list.toTypedArray()
  }

  override property get AllModifiables() : Modifiable[] {
     var list : ArrayList<Modifiable> = {_line}
    list.add(_line.Dwelling)
    return list.toTypedArray()
  }

  /**
  * All HOCosts across the term, in window mode.
  */
  override property get CostVLs() : Iterable<HomeownersCost_HOEVersionList> {
    return _line.VersionList.HomeownersCosts
  }
  
  override property get Transactions() : Set<Transaction> {
    return _line.HOTransactions.toSet()
  }
   
  override function checkLocationInUse(location : PolicyLocation) : boolean {
    var isPolicyChange = _line.Branch.Job typeis PolicyChange
    var hasCurrentOrFutureHOLocationForLocation = getAllHOLocationsEverForLocation(location).hasMatch(\ hoLoc -> hoLoc.ExpirationDate > location.SliceDate)
    var hasCurrentOrFutureCoveredLocationForLocation = getAllCoveredLocationsEverForLocation(location).hasMatch(\ covLoc -> covLoc.ExpirationDate > location.SliceDate)
    var hasCurrentOrFuturePropertyLocationForLocation = getAllScheduledItemsEverForLocation(location).hasMatch(\ schedItem -> schedItem.ExpirationDate > location.SliceDate)
    return isPolicyChange // we can have OOS changes
        or hasCurrentOrFutureHOLocationForLocation 
        or hasCurrentOrFutureCoveredLocationForLocation 
        or hasCurrentOrFuturePropertyLocationForLocation
        or super.checkLocationInUse(location)
  }

  private function getAllHOLocationsEverForLocation(location : PolicyLocation) : List<HOLocation_HOE> {
    return _line.VersionList.HOLocationArray.flatMap(\ vl -> vl.AllVersions).where(\ hoLoc -> hoLoc.PolicyLocation.FixedId == location.FixedId)
  }

  private function getAllCoveredLocationsEverForLocation(location : PolicyLocation) : List<CoveredLocation_HOE> {
    var coveredlocs = new ArrayList<CoveredLocation_HOE>()
    for (covloc in _line.VersionList.HOLineCoverages*.CoveredLocations.flatMap(\ vl -> vl*.AllVersions)) {
      for (cl in covloc) {
        if (cl.PolicyLocation.FixedId == location.FixedId) {
          coveredlocs.add(cl)
        }
      }
    }
    return coveredlocs     
  }

  private function getAllScheduledItemsEverForLocation(location : PolicyLocation) : List<ScheduledItem_HOE> {
    var scheduleditems = new ArrayList<ScheduledItem_HOE>()
    for (item in _line.Dwelling.VersionList.Coverages*.ScheduledItems.flatMap(\ vl -> vl*.AllVersions)) {
      for (it in item) {
        if (it.PolicyLocation.FixedId == location.FixedId) {
          scheduleditems.add(it)
        }
      }
    }
    return scheduleditems     
  }

  override function onPrimaryLocationCreation(location : PolicyLocation) { 
    if (_line.Dwelling == null) {
      _line.createAndAddDwelling( location )
    }
  }
  
  override function createPolicyLineValidation(validationContext : PCValidationContext) : PolicyLineValidation {
    return new HomeownersLineValidation_HOE(validationContext, _line as productmodel.HomeownersLine_HOE)  
  }
  
  override function cloneAutoNumberSequences() {
    if(_line.Dwelling.Coverages != null) {
      _line.Dwelling.Coverages.each(\ c -> c.cloneScheduledItemAutoNumberSequence())
    }
    
    if(_line.HOLineCoverages != null){
      _line.HOLineCoverages.each(\ c -> c.cloneCoveredLocationAutoNumberSequence())
    }
  }
  
  override function resetAutoNumberSequences() {
    if (_line.Dwelling.Coverages != null) {
      _line.Dwelling.Coverages.each(\ c -> c.resetScheduledItemAutoNumberSequence())
    }
    
    if(_line.HOLineCoverages != null){
      _line.HOLineCoverages.each(\ c -> c.resetCoveredLocationAutoNumberSequence())
    }
  }
  
  override function bindAutoNumberSequences() {
    if (_line.Dwelling.Coverages != null) {
      _line.Dwelling.Coverages.each(\ c -> c.bindScheduledItemAutoNumberSequence())
    }
    
    if(_line.HOLineCoverages != null){
      _line.HOLineCoverages.each(\ c -> c.bindCoveredLocationAutoNumberSequence())
    }
  }

  override function renumberAutoNumberSequences() {
    if (_line.Dwelling.Coverages != null) {
      _line.Dwelling.Coverages.each(\ c -> c.ScheduledItemAutoNumberSeq.renumberNewBeans(c.ScheduledItems, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber")))
    }
    
    if(_line.HOLineCoverages != null){
      _line.HOLineCoverages.each(\ c -> c.CoveredLocationAutoNumberSeq.renumberNewBeans(c.CoveredLocations, CoveredLocation_HOE.Type.TypeInfo.getProperty("LocationNumber")))
    }
  }

  override function createPolicyLineDiffHelper(reason : DiffReason, policyLine : PolicyLine) : HODiffHelper {
    return new HODiffHelper(reason, this._line, policyLine as HomeownersLine_HOE)
  }

  override function doGetTIVForCoverage(cov : Coverage) : BigDecimal {
    switch (cov.FixedId.Type) {
      case DwellingCov_HOE.Type:  
        return (cov as DwellingCov_HOE).TotalCovLimit
      case HomeownersLineCov_HOE.Type:
        return (cov as HomeownersLineCov_HOE).CoverageLimit
    }
    return BigDecimal.ZERO
  }

  override function createRatingEngine(method : RateMethod, parameters : Map<RateEngineParameter, Object>) : AbstractRatingEngine<HomeownersLine_HOE> {
    return new HORatingEngine_HOE(_line as productmodel.HomeownersLine_HOE)
  }

  override property get SupportsNonSpecificLocations() : boolean {
    return true
  }

  override property get PolicyLocationCanBeRemovedWithoutRemovingAssociatedRisks() : boolean {
    return true
  }

  override property get BaseStateRequired(): boolean {
    return true
  }

  /* UNA specific implementation to start Underwriting Evaluation for HO
   */
  override function createUnderwriterEvaluator(context : PolicyEvalContext) : UnderwriterEvaluator {
    return new HOE_UnderwriterEvaluator(context)
  }
}
