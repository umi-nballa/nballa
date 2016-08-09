package gw.lob.bp7.building
uses gw.lob.common.util.SystemTableQuery
uses java.math.BigDecimal
uses gw.lob.bp7.blanket.BP7BuildingBlanketableCoverage
uses gw.api.web.job.JobWizardHelper

enhancement BP7BuildingEnhancement : entity.BP7Building {
  
  function changeLocation(newLocation : BP7Location, newTerm : boolean) {
    var oldLocation = this.Location
    newLocation.PolicyLocation.addToBuildings(this.Building)
    newLocation.addToLineSpecificBuildings(this)
    if (newTerm){
      oldLocation.PolicyLocation.renumberBuilding()
      newLocation.PolicyLocation.renumberBuilding()
    }
  }
  // uim-svallabhapurapu : BOP changes throw exception when trying to add more than one classification
  function createAndAddClassification(helper : JobWizardHelper = null) : BP7Classification {
    if(this.Classifications.length == 1){
      throw new gw.api.util.DisplayableException(displaykey.Web.Classification.AtMostOneClassification_Ext)
    }

    var classification = new BP7Classification(this.Branch)
    this.addToClassifications(classification)
    this.number(BP7Classification, classification)
    classification.createCoveragesConditionsAndExclusions()
    classification.updateDependentFields(null, helper)
    return classification
  }
  
  function removeClassification(classification : BP7Classification) {
    this.removeFromClassifications(classification)    
    this.renumber(BP7Classification)
    
    if (this.Classifications.Count == 1) {
      this.Classifications.single().PredominantOverride = false
    }
  }

  property get AssociatedBlanket() : BP7Blanket{
    return this.BlanketableCoverage.Blanket
  }

  property get BldgCodeEffGradeValues() : List<typekey.BP7BldgCodeEffectivenessGrade> {
    var map = {"BldgCodeEffGradeClass" -> this.BldgCodeEffGradeClass.Code}
    var listOfCodes = SystemTableQuery.query(BP7BldgCodeEffGrade, map)
    var listOfKeys = listOfCodes.map(\ code -> typekey.BP7BldgCodeEffectivenessGrade.get(code))
    listOfKeys.retainWhere(\ key -> not key.Retired)
    return listOfKeys
  }

  property get PercentageOwnerOccupiedValues() : List<typekey.BP7PctOwnerOccupied> {
    var rv = {BP7PctOwnerOccupied.TC_10ORLESS, BP7PctOwnerOccupied.TC_OVER10}
    if (not this.BP7StructureExists) {
      rv = {BP7PctOwnerOccupied.TC_NOTAPPLICABLE}
    }
    return rv
  }

  property get TotalCondoBldgSquareFoVisible() : boolean {
    return this.PctOwnerOccupied == BP7PctOwnerOccupied.TC_10ORLESS and
           this.PropertyType == BP7PropertyType.TC_OFFICECONDOMINIUM
  }

  function defaultPropertyType() {
    if(this.PropertyType == null) {
      this.PropertyType = this.Location.Line.BP7LineBusinessType
    }
  }

  property get BlanketEligible() : boolean {    
    return this.BP7StructureExists and 
           this.BP7Structure.BP7RatingBasisTerm.OptionValue != "FunctionalValuation"
  }

  property get BlanketableCoverage() : BP7BuildingBlanketableCoverage {
    return new BP7BuildingBlanketableCoverage(this.BP7Structure)
  }

  property get BuildingLimit() : BigDecimal {
    return this.BP7Structure.BP7BuildingLimitTerm.Value
  }
  
  property set BuildingLimit(newValue : BigDecimal) {
    this.BP7Structure.BP7BuildingLimitTerm.setValue(newValue)

    var blanket = this.BP7Structure.Blanket
    if(blanket != null) {
      blanket.evictNonEligibleCoverages()
    }
  }

  function increasedCostOfLossAndReltdExpensesForGreenUpgradeAvailable() : boolean {
    return this.BP7StructureExists and
           (this.BP7Structure.BP7RatingBasisTerm.OptionValue == "FunctionalValuation" or
            this.BP7Structure.BP7RatingBasisTerm.OptionValue == "ReplacementCost")
  }

  function sprinklerLeakageEQExtAvailable() : boolean {
    return this.Sprinklered and not this.BP7EarthquakeExists and not this.BP7EQSubLimitExists
  }

  function vacancyPermitAvailable() : boolean {
    return not this.BP7VacancyChangesExists
  }

  function vacancyChangesAvailable() : boolean {
    return not this.BP7VacancyPermitExists
  }

  function earthquakeAvailable() : boolean {
    return not this.BP7SprinklerLeakageEQExtExists and not this.BP7EQSubLimitExists
  }

  function eqSubLimitAvailable() : boolean {
    return not this.BP7EarthquakeExists and not this.BP7SprinklerLeakageEQExtExists
  }

  function functlBldgValtnAvailable() : boolean {
    return not this.BP7OrdinanceOrLawCovExists
  }

  function ordinanceOrLawCovAvailable() : boolean {
    return not this.BP7FunctlBldgValtnExists
  }

  function lossPayableAvailable() : boolean {
    return not this.Location.BP7AddlInsdBldgOwnersExists
  }

  property get BuildingRatingBasis() : String { 
    return this.BP7Structure.BP7RatingBasisTerm.ValueAsString
  }
  
  property set BuildingRatingBasis(newValue : String) {
    this.BP7Structure.BP7RatingBasisTerm.setValueFromString(newValue)

    var blanket = this.BP7Structure.Blanket
    if(blanket != null) {
      blanket.evictNonEligibleCoverages()
    }
  }

  property get BuildingClassCode() : String {
    return this.PredominantClassification.ClassificationClassCode
  }

  property get PredominantClassification() : BP7Classification {
    var predominant = this.Classifications.firstWhere(\ classification -> classification.PredominantOverride)
    if(predominant == null){
      // no override
      predominant = this.Classifications.maxBy(\ classification -> classification.Area)
    }
    return predominant
  }
  
  property get LessorOccupied() : boolean {
    return this.PctOwnerOccupied == BP7PctOwnerOccupied.TC_10ORLESS
  }

  property get BuildingClassGroup(): String {
    return this.PredominantClassification.ClassificationClassGroup
  }

  property get RABOPTypeLiabilityLessorsRequired(): boolean {
    return this.RABOPWanted and (this.BuildingLimit > 0)
        and (this.PctOwnerOccupied == typekey.BP7PctOwnerOccupied.TC_10ORLESS
            or {"33611", "33891", "33731"}.contains(this.BuildingClassCode)
            or {"17", "18", "19", "20", "21"}.contains(this.BuildingClassGroup))
  }


  /*
*  Author: uim-svallabhapurapu
*  Change Log: Added the new function createAndAddNewBuildingUnits to create new Building unit,
*  BOP line of business
 */
  function createAndAddNewBuildingUnits() : BuildingUnits_Ext{
    var unit = new BuildingUnits_Ext(this.Branch)
    this.addToBldgUnits(unit)
    return unit
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: Added the new function removeunits to remove building units ,
*  BOP line of business
 */
  function removeUnits() {
    for(unit in this.BldgUnits)  {
      this.removeFromBldgUnits(unit)
    }
  }
  //Uim-svallabhapurapu : called from product designer
  function buildingExistance() : ExistenceType{
     if(this.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_BUILDINGOWNER or
         this.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_BOOCCUPANT or
          this.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMASSOCIATION) {
         return ExistenceType.TC_REQUIRED
     }
    return ExistenceType.TC_ELECTABLE
  }
  //uim-svallabhapurapu : called from product designer and make coverage unavailable
  function isBuildingCovAvailable() : boolean{
    if(this.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMUNITOWNER or
        this.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOUNITOWNEROCCUPANT or
         this.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_TENANT){
      return false
    }
    return true
  }
}
