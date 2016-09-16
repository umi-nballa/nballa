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
  public static enum ROUNDING_MODE {ROUND_UP, ROUND_NEAREST, ROUND_DOWN}

  @Param("operand", "The number to round")
  @Param("factor", "The factor to round to")
  @Param("roundingMode", "The rounding mode to use")
  @Returns("The operand, rounded to the nearest factor determined by the roundingMode.")
  /*
    ROUND_UP will automatically round a number up to the nearest factor.  inputs of (1645, 100, ROUND_UP) will return 1700
    ROUND_DOWN will automatically round a number down to the nearest factor.  inputs of (1665, 100, ROUND_DOWN) will return 1600
    ROUND_NEAREST will automatically round a number using standard rounding rules.
    for ROUND_NEAREST, inputs of (1645, 100, ROUND_NEAREST) will return 1600.  inputs of (1665, 100, ROUND_NEAREST) will return 1700
  */
  public static function roundTo(operand : double, factor : int, roundingMode : ROUNDING_MODE) : double{
    var result : double

    switch(roundingMode){
      case ROUND_UP:
        result = roundUpTo(operand, factor)
        break
      case ROUND_NEAREST:
        result = roundToNearest(operand, factor)
        break
      case ROUND_DOWN:
        result = roundDownTo(operand, factor)
        break
    }

    return result
  }

  /**
  * rounds a given operand to the nearest "factor"
  */
  @Param("operand", "The number to round")
  @Param("factor", "The factor to round to")
  @Returns("The operand input rounded to the nearest factor.  e.g. an input of 1251.5 and 500, repectively, would return 1000.")
  private static function roundToNearest(operand : double, factor : int) : double {
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

  /**
   * rounds a given operand UP to the nearest "factor"
   */
  @Param("operand", "The number to round")
  @Param("factor", "The factor to round to")
  @Returns("The operand input rounded up to the nearest factor.")
  private static function roundUpTo(operand : double, factor : int) : double{
    var result = operand

    if(operand != 0 and factor != 0){
      if(operand % factor != 0){
        var division = ((operand / factor) as int) + 1
        result = division * factor
      }
    }

    return result
  }

  /**
   * rounds a given operand DOWN to the nearest "factor"
   */
  @Param("operand", "The number to round")
  @Param("factor", "The factor to round to")
  @Returns("The operand input rounded DOWN to the nearest factor.")
  private static function roundDownTo(operand : double, factor : int) : double{
    var intVal = (operand as int)
    return intVal - intVal % factor
  }
}