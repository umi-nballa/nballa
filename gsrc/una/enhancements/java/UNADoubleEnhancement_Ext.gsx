package una.enhancements.java

uses java.text.NumberFormat
uses java.lang.Double

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/24/16
 * Time: 7:26 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNADoubleEnhancement_Ext : Double {
  public function asMoney() : String {
    var moneyFormatter = NumberFormat.getCurrencyInstance()
    return moneyFormatter.format(this)
  }
}
