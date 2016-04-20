package gw.lob.bp7.defaults

uses gw.api.domain.covterm.OptionCovTerm
uses gw.api.productmodel.OptionCovTermPattern

abstract class AbstractOptionCovTermDefault extends AbstractCovTermDefault<OptionCovTerm, OptionCovTermPattern> {

  override protected function setTermDefault() {
    if (Term != null and DefaultFromTerm != null) {
      var availableOptions = Term.Pattern.getAvailableValues(Term)
      if (availableOptions*.OptionCode.contains(DefaultFromTerm.OptionValue.OptionCode)) {
        Term.OptionValue = availableOptions.firstWhere( \ option -> option.OptionCode == DefaultFromTerm.OptionValue.OptionCode)
      }
    }
  }

  override property set TermValueString(val : String) {
    if (val != null) {
      super.TermValueString = val
    } else {
      Term.OptionValue = val
    }
  }

}