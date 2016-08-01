package una.utils

uses java.lang.Double
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/12/16
 * Time: 9:58 AM
 * To change this template use File | Settings | File Templates.
 */
class MathUtil {

  /**
  * rounds a given operand to the nearest "factor"
  */
  @Param("operand", "The number to round")
  @Param("factor", "The factor to round to")
  @Returns("The operand input rounded to the nearest factor.  e.g. an input of 1251.5 and 500, repectively, would return 1000.")
  public static function roundTo(operand : double, factor : int) : double {
    var result : double

    if(operand != 0 and factor != 0){

      var quotient = new Double(operand).intValue() / factor  //quotient would be 1251
      var remainder = operand % factor  //remainder would be
      var halfWay = factor / 2

      if(remainder >= halfWay){
        result = (quotient + 1) * factor
      }else{
        result = quotient * factor
      }
    }

    return result
  }
}