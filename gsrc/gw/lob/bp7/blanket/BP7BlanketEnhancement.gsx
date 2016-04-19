package gw.lob.bp7.blanket

uses gw.api.web.job.JobWizardHelper

uses java.math.BigDecimal

enhancement BP7BlanketEnhancement : entity.BP7Blanket {
  property get TotalLimitDisplay() : String {
    return com.guidewire.pl.system.util.NumberFormatUtil.render(TotalLimit)
  }

  property get TotalLimit() : BigDecimal {
    return this.BlanketedCoverages*.Limit.sum()
  }

  function refreshLimit() {
    this.BlanketLimit = TotalLimit
  }

  property get HasEligibleCoverages() : boolean {
    return getEligibleCoverages().HasElements
  }

  property get BuildingCoverages() : BP7BuildingCov[] {
    return this.BuildingBlanketedCovs
  }

  property get ClassificationCoverages() : BP7ClassificationCov[] {
    return this.ClassificationBlanketedCovs
  }

  property get BlanketedCoverages() : List<BP7Blanketable> {
    return this.BuildingCoverages.map<BP7Blanketable>(\ c -> new BP7BuildingBlanketableCoverage(c))
    .concat(this.ClassificationCoverages.map(\ c -> new BP7ClassificationBlanketableCoverage(c)))
    .toList() 
  }

  property get EligibleCoverages() : List<BP7Blanketable> {
    var rv : List<BP7Blanketable> = {}
    var buildingCov = this.Line.BlanketEligibleBuildingCoverages.map(\ cov -> new BP7BuildingBlanketableCoverage(cov, this) ).toList()
    var classificationCov = this.Line.BlanketEligibleClassificationCoverages.map(\ cov -> new BP7ClassificationBlanketableCoverage(cov, this) ).toList()

    if (this.BlanketType == BP7BlktType.TC_BUSINESSPERSONALPROPERTYONLY) {
      rv.addAll(classificationCov)
    } else if (this.BlanketType == BP7BlktType.TC_BUILDINGONLY) {
      rv.addAll(buildingCov)
    } else if (this.BlanketType == BP7BlktType.TC_BUILDINGANDBUSINESSPERSONALPROPERTYCOMBINED) {
      rv.addAll(buildingCov)
      rv.addAll(classificationCov)
    }

    return rv
  }

  function addCoverages(blanketCoverages : List<BP7Blanketable>, jobWizardHelper : JobWizardHelper = null) : BP7Blanketable[] {
    blanketCoverages.each(\ coverage -> {coverage.Included = true})
    return this.BlanketedCoverages.toTypedArray()
  }

  function removeCoverages(blanketCoverages : List<BP7Blanketable>, jobWizardHelper : JobWizardHelper) {
    blanketCoverages.each(\ coverage -> {coverage.Included = false})
  }

  function evictNonEligibleCoverages() {
    this.BlanketedCoverages
      .where(\ blanketedCov -> not blanketedCov.Eligible )
      .each(\ blanketedCov -> {blanketedCov.Included = false} )
  }

  property get HasBuildingCoverages() : boolean {
    return this.BuildingCoverages.HasElements
  }

  property get HasClassificationCoverages() : boolean {
    return this.ClassificationCoverages.HasElements
  }
}
