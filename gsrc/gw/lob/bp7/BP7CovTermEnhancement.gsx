package gw.lob.bp7

uses gw.api.productmodel.CovTermOpt
uses gw.api.web.job.JobWizardHelper

enhancement BP7CovTermEnhancement : gw.api.domain.covterm.CovTerm {

  function bp7sync(helper : JobWizardHelper) {
    if (this.Pattern typeis gw.api.productmodel.OptionCovTermPattern) {
      if (AvailableOptions.Count == 1) {
        setOnlyOption(helper)
      } else {
        setDefaultValueIfCovTermNotSet(helper)
      }
    }
  }
  
  private function setOnlyOption(helper : JobWizardHelper) {
    this.setValueFromString(AvailableOptions.first().OptionCode)
    syncMyClause(helper)
  }
  
  private function setDefaultValueIfCovTermNotSet(helper : JobWizardHelper) {
    var defaultOptionCode = this.Pattern.getDefaultValue(null)
    if (defaultOptionCode != null 
        and AvailableOptions*.OptionCode.contains(defaultOptionCode)
        and this.ValueAsString == null) {

      this.setValueFromString(defaultOptionCode)
      syncMyClause(helper)
    }
  }
  
  private function syncMyClause(helper: JobWizardHelper) {
    if(this.Clause typeis Coverage) {
      gw.web.productmodel.ProductModelSyncIssuesHandler.syncSpecifiedCoverages({this.Clause}, helper)
    } else if(this.Clause typeis Exclusion) {
      gw.web.productmodel.ProductModelSyncIssuesHandler.syncSpecifiedExclusions({this.Clause}, helper)
    } else if(this.Clause typeis PolicyCondition) {
      gw.web.productmodel.ProductModelSyncIssuesHandler.syncSpecifiedConditions({this.Clause}, helper)
    }
  }
  
  property get AvailableOptions() :  List<CovTermOpt> {
    if (this.Pattern typeis gw.api.productmodel.OptionCovTermPattern) {
      return this.Pattern.getAvailableValues(this)
    }
    
    return {}
  }
}
