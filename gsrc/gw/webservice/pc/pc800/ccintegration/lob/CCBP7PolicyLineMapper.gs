package gw.webservice.pc.pc800.ccintegration.lob

uses gw.webservice.pc.pc800.ccintegration.CCBasePolicyLineMapper
uses gw.webservice.pc.pc800.ccintegration.CCPolicyGenerator
uses java.lang.Integer
uses java.util.ArrayList
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCPolicySummaryProperty
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCPropertyRU
uses gw.webservice.pc.pc800.ccintegration.entities.anonymous.elements.CCPolicy_RiskUnits
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCPropertyCoverage
uses gw.webservice.pc.pc800.ccintegration.entities.anonymous.elements.CCRiskUnit_Coverages
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCBuildingRU

uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCCoverage
uses gw.webservice.pc.pc800.ccintegration.entities.types.complex.CCCovTerm
uses gw.api.domain.covterm.CovTerm
uses gw.api.domain.covterm.TypekeyCovTerm

class CCBP7PolicyLineMapper extends CCBasePolicyLineMapper {

  var _bp7Line : BP7BusinessOwnersLine
  var _RUCount : Integer
  var _skipCount : Integer;
  
  construct(line : PolicyLine, policyGen : CCPolicyGenerator) {
    super(line, policyGen)
    _bp7Line = line as BP7BusinessOwnersLine
  }

  // Returns true if the Coverage should be excluded from what is sent to CC
  override function isCoverageExcluded(cov : Coverage) : Boolean {
    if(isCoverageToExcludeFromMapping(cov)){
      _excludedCoverages.add(cov.PatternCode)
    }
    return _excludedCoverages.contains(cov.PatternCode)
  }

  // Create a summary list of covered buildings for the PolicySummary that is returned for a search result (not a full policy mapping)
  override function mapPropertySummaries(propertyList : ArrayList<CCPolicySummaryProperty>) {
    var count = propertyList.Count;   // Use for numbering the properties across multiple lines
    for (boploc in _bp7Line.BP7Locations.sortBy(\ l -> l.Location.LocationNum)) {
      if(meetsLocationFilteringCriteria(boploc.Location)) {
        for (bld in boploc.Buildings.sortBy(\ b -> b.Building.BuildingNum)) {
          if (_policyGen.meetsPolicySystemIDFilteringCriteria(bld.TypeIDString)) {
            var ccBld = new CCPolicySummaryProperty();
            ccBld.PolicySystemID = bld.TypeIDString
            propertyList.add(ccBld);

            count = count + 1
            ccBld.PropertyNumber = count
            var loc = boploc.PolicyLocation
            ccBld.Location = loc.LocationNum.toString()
            ccBld.BuildingNumber = bld.Building.BuildingNum.toString()

            //CCPolicySummaryProperty.Address is deprecated as of 8.0.1. Use AddressLine1 and AddressLine2 instead.
            ccBld.Address = loc.AddressLine1
            ccBld.AddressLine1 = loc.AddressLine1
            if (loc.AddressLine2.HasContent) {
              ccBld.AddressLine2 = loc.AddressLine2
              ccBld.Address = ccBld.Address + ", " + loc.AddressLine2
            }

            ccBld.City = loc.City
            ccBld.Description = trimRUDescription(bld.Building.Description)
          }
        }
      }
    }
  }

  override function getLineCoverages() : List<entity.Coverage> {
    return _bp7Line.BP7LineCoverages as List<entity.Coverage>
  }
  
  override function createRiskUnits() {
    // Keep a count as we add risk units.  This may start > 0 if other lines have been processed first.
    _RUCount = _ccPolicy.RiskUnits == null ? 0 : _ccPolicy.RiskUnits.Count
    var startingCount = _RUCount
    var skipCount = 0   // Used to track how many "properties" were filtered out

    // Create risk units for each building
    for (boploc in _bp7Line.BP7Locations.sortBy(\ l -> l.Location.LocationNum)) {
      if (meetsLocationFilteringCriteria(boploc.Location)) {
        // Get the Location
        var ccLoc = _policyGen.getOrCreateCCLocation( boploc.Location )

        // Create location-level risk units and coverages against those risk units
        // First, create the location-level risk
        var locRU = new CCPropertyRU()
        _ccPolicy.RiskUnits.add(new CCPolicy_RiskUnits(locRU))

        _RUCount = _RUCount + 1
        locRU.RUNumber = _RUCount

        locRU.PolicyLocation = ccLoc
        locRU.Description = trimRUDescription(boploc.DisplayName)
        locRU.PolicySystemID = boploc.TypeIDString

        // Create location-level coverages
        for (cov in boploc.Coverages.sortBy(\ c -> c.Pattern.Priority)) {
          var ccCov = new CCPropertyCoverage()
          populateCoverage(ccCov, cov)
          locRU.Coverages.add(new CCRiskUnit_Coverages( ccCov ))
        }

        // Process all the buildings on location
        for (bld in boploc.Buildings.sortBy(\ b -> b.Building.BuildingNum)) {
          if (_policyGen.meetsPolicySystemIDFilteringCriteria(bld.TypeIDString)) {
            var ccBuilding = _policyGen.getOrCreateCCBuilding(bld.Building)

            // Create a new risk unit
            var ru = new CCBuildingRU()
            _ccPolicy.RiskUnits.add(new CCPolicy_RiskUnits(ru))

            _RUCount = _RUCount + 1
            ru.RUNumber = _RUCount
            ru.Building = ccBuilding
            ru.PolicyLocation = ccLoc
            ru.Description = trimRUDescription(bld.Building.Description)
            ru.PolicySystemID = bld.TypeIDString

            // Process building-level coverages
            for (cov in bld.Coverages.sortBy(\ c -> c.Pattern.Priority)) {
              var ccCov = new CCPropertyCoverage()
              populateCoverage(ccCov, cov)
              ru.Coverages.add(new CCRiskUnit_Coverages( ccCov ))
            }

            // Process building-level classification coverages
            for(classCov in bld.Classifications.Coverages){
              var ccCov = new CCPropertyCoverage()
              populateCoverage(ccCov, classCov)
              ru.Coverages.add(new CCRiskUnit_Coverages( ccCov ))
            }

            // For building-level additional interests (e.g., lienholders), add a location-level contact in CC
            for (addInterest in bld.AdditionalInterests) {
              addRULevelAdditionalInterest(addInterest.ID, ru, addInterest.PolicyAddlInterest.ContactDenorm)
            }
          } else { // Filtered out the building so add 1 to the number skipped
            skipCount = skipCount + 1
          }
        } // End of each building
      } else {  // Filtered out the location
        skipCount = skipCount + boploc.Buildings.Count + 1  // Count buildings + 1 for the location-level risk
      }
    } // end of each location

    addToPropertiesCount(_RUCount - startingCount + skipCount)
  }

  override function handleCovTermSpecialCases(pcCov : Coverage, pcCovTerm : CovTerm, ccCov : CCCoverage, ccCovTerms : CCCovTerm[]) {

    super.handleCovTermSpecialCases(pcCov, pcCovTerm, ccCov, ccCovTerms)

    // Handle coinsurance
    if (((pcCov.PatternCode == "BOPBuildingCov") and (pcCovTerm.PatternCode == "BOPBuildingCoin")) or
        ((pcCov.PatternCode == "BOPPersonalPropCov") and (pcCovTerm.PatternCode == "BOPPersonalPropCoin")))
    {
      (ccCov as CCPropertyCoverage).Coinsurance = mapCoinsurance(pcCovTerm.ValueAsString)
    }

    // Handle valuation method (Actual Cash Value vs. Replacement Cost)
    if (((pcCov.PatternCode == "BOPBuildingCov") and (pcCovTerm.PatternCode == "BOPBldgValuation")) or
        ((pcCov.PatternCode == "BOPPersonalPropCov") and (pcCovTerm.PatternCode == "BOPBPPValuation")))
    {
      // Map the values in PC that have corresponding values in CC
      (ccCov as CCPropertyCoverage).CoverageBasis = mapValuationMethod((pcCovTerm as TypekeyCovTerm).Value.Code)
    }

  }

  /**
  * This method will be used to add BP7 Excluded Coverages
  */
  private function isCoverageToExcludeFromMapping(cov : Coverage) : Boolean {
    if((cov.PatternCode == "BP7AddlInsdControllingInterest") or
      (cov.PatternCode == "BP7ClassificationAccountsReceivable") or
      (cov.PatternCode == "BP7LocationPropertyDeductibles") or
      (cov.PatternCode == "BP7LocationPropertyDeductibles_EXT") or
      (cov.PatternCode == "BP7DisclosurePursuantToTRIA2002") or
      (cov.PatternCode == "BP7AddlInsdOwnersLandLeasedToInsuredLine_EXT") or
      (cov.PatternCode == "BP7AddlInsdOwnersLandLeasedToInsuredLocation_EXT") or
      (cov.PatternCode == "BP7AddlInsdMortgageeAssigneeReceiver") or
      (cov.PatternCode == "BP7AddlInsdMortgageeAsigneeReceiverLine_EXT") or
      (cov.PatternCode == "BP7AddlInsdManagersLessorsPremises") or
      (cov.PatternCode == "BP7AddlInsdManagersLessorsPremisesLine_EXT") or
      (cov.PatternCode == "BP7AddlInsdManagersLessorsPremisesItem") or
      (cov.PatternCode == "BP7AddlInsdLessorsLeasedEquipmt") or
      (cov.PatternCode == "BP7AddlInsdLessorsLeasedEquipmtLine_EXT") or
      (cov.PatternCode == "BP7AddlInsdGrantorOfFranchiseEndorsement") or
      (cov.PatternCode == "BP7AddlInsdDesignatedPersonOrg") or
      (cov.PatternCode == "BP7AddlInsdDesignatedPersonOrgLocation_EXT") or
      (cov.PatternCode == "BP7AddlInsdCoOwnerInsdPremises") or
      (cov.PatternCode == "BP7AddlInsdCoOwnerInsdPremisesLine_EXT") or
      (cov.PatternCode == "BP7DamagePremisisRentedToYou_EXT") or
      (cov.PatternCode == "BP7ClassificationValuablePapers")){
      return true
    }
    return false
  }

}
