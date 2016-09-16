package gw.lob.bp7.classification

uses gw.api.productmodel.CoverageCategory
uses gw.lob.common.util.SystemTableQuery
uses gw.lob.bp7.BP7Categories
uses gw.lob.bp7.blanket.BP7ClassificationBlanketableCoverage
uses java.math.BigDecimal
uses gw.lob.bp7.utils.BP7SysTableQueryUtil

enhancement BP7ClassificationEnhancement : entity.BP7Classification {

  property get AssociatedBlanket() : BP7Blanket{
    return this.BlanketableCoverage.Blanket
  }

  property get StandardCoverages() : CoverageCategory {
    return this.PolicyLine?.Pattern?.getCoverageCategory(BP7Categories.BP7ClassificationStdGrp.Code)
  }

  property get FunctionalBPPValuationCoverageCoverages() : CoverageCategory {
    return this.PolicyLine?.Pattern?.getCoverageCategory(BP7Categories.BP7ClassificationFunctionalBPPValuationGrp.Code)
  }

  property get MotelCoverages() : CoverageCategory {
    return this.PolicyLine?.Pattern?.getCoverageCategory(BP7Categories.BP7ClassificationMotelBusGrp.Code)
  }

  property get SelfStorageFacilitiesCoverages() : CoverageCategory {
    return this.PolicyLine?.Pattern?.getCoverageCategory(BP7Categories.BP7ClassificationSelfStorageBusGrp.Code)
  }
  
  property get LandscapeCategory() : CoverageCategory {
    return this.PolicyLine?.Pattern?.getCoverageCategory(BP7Categories.BP7ClassificationLandscapeBusGrp.Code)
  }
  
  property get AdditionalCoveragesCategories() : String[] {
    var categories = {BP7Categories.BP7ClassificationAddlGrp.Code}

    if (this.ClassPropertyType != BP7ClassificationPropertyType.TC_MOTEL) {
      categories.add(MotelCoverages.Code)
    }

    if (this.ClassPropertyType != BP7ClassificationPropertyType.TC_SELFSTORAGEFACILITY) {
      categories.add(SelfStorageFacilitiesCoverages.Code)
    }

    if (not this.isLandscapeGardening()) {
      categories.add(LandscapeCategory.Code)
    }

    return categories.toTypedArray()
  }

  property get ExclusionsAndConditionsCategories() : String[] {
    return {BP7Categories.BP7ClassificationExclGrp.Code, BP7Categories.BP7ClassificationCondGrp.Code, BP7Categories.BP7ClassificationLandscapeBusGrp.Code}
  }

  property get ClassPropertyTypeValues() : List<typekey.BP7ClassificationPropertyType> {
    var map = {BP7ClassificationProperty#PropertyType.PropertyInfo.Name -> this.Building.PropertyType.Code}

    var listOfCodes = SystemTableQuery.query(BP7ClassificationProperty, map)
    var listOfKeys = listOfCodes.map(\ code -> typekey.BP7ClassificationPropertyType.get(code))
    listOfKeys.retainWhere(\ key -> not key.Retired)
    return listOfKeys
  }

  property get ClassDescriptionValues() : List<typekey.BP7ClassDescription> {
    var map = {BP7ClassDescription#PctOwnerOccupied.PropertyInfo.Name -> this.Building.PctOwnerOccupied.Code,
               BP7ClassDescription#ClassPropertyType.PropertyInfo.Name -> this.ClassPropertyType.Code}
               
    var listOfCodes = SystemTableQuery.query(BP7ClassDescription, map)
    var listOfKeys = listOfCodes.map(\ code -> typekey.BP7ClassDescription.get(code))
    listOfKeys.retainWhere(\ key -> not key.Retired)
    return listOfKeys
  }
  
  function setExposureBasisValue() {
    if(this.ClassificationClassGroup == null){
      this.ExposureBasis = null
      return
    }

    var exposureBasisQueryArgs = {BP7ExposureBasis#ClassGroup.PropertyInfo.Name -> ClassificationClassGroup}
    var listOfCodes = SystemTableQuery.query(BP7ExposureBasis, exposureBasisQueryArgs)
    this.ExposureBasis = listOfCodes.map(\ code -> typekey.BP7ExposureBasis.get(code)).single()
  }

  property get ClassificationClassGroup() : String {
    if(ClassificationClassCode == null)
      return null

    var classGroupQueryArgs = {BP7ClassGroup#ClassCode.PropertyInfo.Name -> ClassificationClassCode}
    return SystemTableQuery.query(BP7ClassGroup, classGroupQueryArgs, 
                                  BP7ClassGroup#Description.PropertyInfo.Name).single()
  }

  property get isExposureApplicable() : boolean {
    var rv = this.ExposureBasis == null or (
               BPPOrFunctionalValuationExists and
               this.ExposureBasis != typekey.BP7ExposureBasis.TC_LIMITOFINSURANCE
             )
    return rv
  }

  function classificationPermanentYardsStorageClauseAvailable() : boolean {
    return this.ClassPropertyType == BP7ClassificationPropertyType.TC_CONTRACTOR
  }

  function classificationAccountsReceivableClauseAvailable() : boolean {
    return BPPOrFunctionalValuationExists
  }
  
  function classificationValuablePapersClauseAvailable() : boolean {
    return BPPOrFunctionalValuationExists
  }
  
  function classificationBusinessIncomeFromDependentPropsClauseAvailable() : boolean {
    return BPPOrFunctionalValuationExists
  }

  function classificationBPPTemporarilyInPortableStorageAvailable() : boolean {
    return BPPOrFunctionalValuationExists
  }

  function theftLimitationsAvailable() : boolean {
    return this.BP7ClassificationBusinessPersonalPropertyExists
  }

  function motelLiabGuestsPropAvailable() : boolean {
    return this.ClassPropertyType == BP7ClassificationPropertyType.TC_MOTEL
  }

  function motelsAvailable() : boolean {
    return this.ClassPropertyType == BP7ClassificationPropertyType.TC_MOTEL
  }

  property get BPPOrFunctionalValuationExists() : boolean {
    return this.BP7ClassificationBusinessPersonalPropertyExists or
           (this.BP7FunctlBusnPrsnlPropValtnExists and
            this.BP7FunctlBusnPrsnlPropValtn.ScheduledItems.HasElements)
  }

  function classificationIncreasedCostOfLossAndRelatedExpensesForGreenUpgradesAvailable() : boolean {
    return
      ( this.Building.BuildingRatingBasis == "ReplacementCost" or 
        this.Building.BuildingRatingBasis == "FunctionalValuation" ) and
      this.BPPLimit > BigDecimal.ZERO
  }

  function foodContaminationAvailable() : boolean {
    return not this.Building.Location.BP7RestaurantsExists
  }

  function spoilgCovAvailable() : boolean {
    return not this.Building.Location.BP7RestaurantsExists
  }

  function isLandscapeGardening() : boolean {
    return BP7SysTableQueryUtil.isLandscapeGardeningForClassification(this.ClassificationClassCode)
  }

  property get BlanketEligible() : boolean {    
    return this.BP7ClassificationBusinessPersonalPropertyExists
  }

  property get BlanketableCoverage() : BP7ClassificationBlanketableCoverage {
    return new BP7ClassificationBlanketableCoverage(this.BP7ClassificationBusinessPersonalProperty)
  }

  property get BPPLimit() : BigDecimal {
    return this.BP7ClassificationBusinessPersonalProperty.BP7BusnPrsnlPropLimitTerm.Value
  }
  
  property set BPPLimit(newValue : BigDecimal) {
    this.BP7ClassificationBusinessPersonalProperty.BP7BusnPrsnlPropLimitTerm.setValue(newValue)

    var blanket = this.BP7ClassificationBusinessPersonalProperty.Blanket
    if(blanket != null) {
      blanket.evictNonEligibleCoverages()
    }
  }

  property get ClassificationClassCode() : String {
    return BP7SysTableQueryUtil.getClassCode(this.ClassPropertyType, this.ClassDescription)
  }

  property get RABOPTypeLiabilityOccupantsRequired(): boolean {
    return this.RABOPWanted
        and {"01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "18", "22"}.contains(this.ClassificationClassGroup)
  }

  function removeMotelCoverages() {
    removeCoveragesInCoverageCategory("BP7ClassificationMotelBusGrp")
  }
  
  function removeSelfStorageCoverages() {
    removeCoveragesInCoverageCategory("BP7ClassificationSelfStorageBusGrp")
  }
  
  function removeLandscapeBusinessCoverages() {
    removeCoveragesInCoverageCategory("BP7ClassificationLandscapeBusGrp")
  }
  
  private function removeCoveragesInCoverageCategory(coverageCategory : String) {
    this.Coverages.where(\ cov -> (cov.Pattern.CoverageCategory == coverageCategory))
      .each(\ cov -> this.removeCoverageFromCoverable(cov))
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: Added the new function associatedClassCode to get the class code,
*  BOP line of business
 */
  function associatedClassCode() {
    this.ClassCode_Ext = ""
    var classCode = gw.api.database.Query.make(BP7ClassCode)
    var result = classCode.compare(BP7ClassCode#Code, Equals, this.ClassDescription ).select().first()
    if(result != null){
      this.ClassCode_Ext = result.Code
    }
  }

  /*
*  Author: uim-svallabhapurapu
*  Change Log: New function to decide coverage existance based on occupancyType typelist,
*  BOP line of business
*/
  function bppCovExistance() : ExistenceType{
    if(this.Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_BUILDINGOWNER or
        this.Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_BOOCCUPANT or
        this.Building.PredominentOccType_Ext == typekey.BP7PredominentOccType_Ext.TC_CONDOMINIUMASSOCIATION) {
      return ExistenceType.TC_ELECTABLE
    }
    return ExistenceType.TC_REQUIRED
  }

}
