package gw.lob.common

enhancement CovTermEnhancement: gw.api.domain.covterm.CovTerm {

  function syncOptionTermToTheOnlyOption() {
    if (this.Pattern typeis gw.api.productmodel.OptionCovTermPattern) {
      var availableOptions = this.Pattern.getAvailableValues(this)
      if (availableOptions.Count == 1)
        this.setValueFromString(availableOptions.first().OptionCode)
    }
  }

  function hasNoAvailableOptionsOrNotApplicableOptionOnly() : boolean {
    var pattern = this.Pattern
    if (pattern typeis gw.api.productmodel.OptionCovTermPattern) {
      var availableOptions = pattern.getAvailableValues(this)
      if (availableOptions.Empty or
          (pattern.Required and availableOptions.Count == 1 and availableOptions.first().OptionCode == "NotApplicable") ) {
        return true
      }
    }

    return false
  }

}
