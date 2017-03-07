package una.enhancements.productmodel

uses gw.api.domain.covterm.OptionCovTerm
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 3/2/17
 * Time: 11:08 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAOptionCovTermEnhancement : gw.api.domain.covterm.OptionCovTerm {
  public function matchOptionValue(that : OptionCovTerm){
    var availableOptions = this.AvailableOptions
    var matchingValue = availableOptions?.atMostOneWhere( \ option -> option.Value?.doubleValue() == that.Value?.doubleValue())

    if(matchingValue != null){
      this.setOptionValue(matchingValue)
    }
  }
}
