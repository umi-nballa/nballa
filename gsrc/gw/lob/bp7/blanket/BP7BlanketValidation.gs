package gw.lob.bp7.blanket
uses gw.validation.PCValidationBase
uses gw.validation.PCValidationContext

class BP7BlanketValidation extends PCValidationBase {
  private var _blanket : BP7Blanket
  
  construct(valContext : PCValidationContext, blanket : BP7Blanket) {
    super(valContext)
    _blanket = blanket
  }

  override function validateImpl() {
    Context.addToVisited(this, "validateImpl")
    
    checkMinimumCoverageNumber()
    checkSingleTypeCoverageInCombinedBlanket()
    checkIneligibleCoveragesInsideBlanket()
  }

  private function checkMinimumCoverageNumber() {
    Context.addToVisited(this, "checkMinimumCoverageNumber")

    if (not (_blanket.BlanketedCoverages.Count > 1)) {
      Result.addError(_blanket, ValidationLevel.TC_DEFAULT, displaykey.Web.Policy.BP7.Validation.Blanket.MinimumCoverage)
    }
  }

  private function checkSingleTypeCoverageInCombinedBlanket() {
    Context.addToVisited(this, "checkSingleTypeCoverageInCombinedBlanket")
    
    if (_blanket.BlanketType == BP7BlktType.TC_BUILDINGANDBUSINESSPERSONALPROPERTYCOMBINED and
        (not _blanket.HasBuildingCoverages or not _blanket.HasClassificationCoverages)) {
      Result.addError(
        _blanket, 
        ValidationLevel.TC_DEFAULT, 
        displaykey.Web.Policy.BP7.Validation.Blanket.SingleTypeInCombinedBlanket(BP7BlktType.TC_BUILDINGANDBUSINESSPERSONALPROPERTYCOMBINED.DisplayName))
    }
  }

  private function checkIneligibleCoveragesInsideBlanket() {
    Context.addToVisited(this, "checkIneligibleCoveragesInsideBlanket")

    var ineligibleCoverages = _blanket.BlanketedCoverages.where(\ coverage -> 
      not coverage.Eligible or
      (_blanket.BlanketType == BP7BlktType.TC_BUSINESSPERSONALPROPERTYONLY and coverage typeis BP7BuildingBlanketableCoverage) or 
      (_blanket.BlanketType == BP7BlktType.TC_BUILDINGONLY and coverage typeis BP7ClassificationBlanketableCoverage)
      )

    if (ineligibleCoverages.Count > 0) {
      var descriptions = ineligibleCoverages.map(\ cov -> cov.NumberedCoveragePath).join("\n")
      Result.addError(
        _blanket, 
        ValidationLevel.TC_DEFAULT, 
        displaykey.Web.Policy.BP7.Validation.Blanket.IneligibleCoverageInsideBlanket(descriptions))
    }
  }

  /**************************************************************************************
   * Validating all entities in this job step
   **************************************************************************************/    
  static function validateBlanketStep(line : BP7BusinessOwnersLine) {
    PCValidationContext.doPageLevelValidation( \ context -> {
      line.Blankets.each(\ blanket -> new BP7BlanketValidation(context, blanket).validate())
    })
  }
}
