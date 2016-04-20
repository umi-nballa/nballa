package gw.lob.bp7
uses gw.api.productmodel.OptionCovTermPattern

enhancement BP7OptionCovTermPatternEnhancement : gw.api.productmodel.OptionCovTermPattern {
  function optionCodeFrom(description : String) : String {
    return this.Options.firstWhere(\ o -> o.Description == description).OptionCode
  }

  function descriptionFrom(optionCode : String) : String {
    return this.getCovTermOpt(optionCode).Description
  }
}
