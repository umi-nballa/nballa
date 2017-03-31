package una.enhancements.java

uses java.text.NumberFormat
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 3/17/17
 * Time: 9:26 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNABigDecimalEnhancement : java.math.BigDecimal{
  public function asMoney() : String {
    var moneyFormatter = NumberFormat.getCurrencyInstance()
    return moneyFormatter.format(this)
  }
}
