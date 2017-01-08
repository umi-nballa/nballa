package una.utils

uses java.text.SimpleDateFormat
/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 1/6/17
 * Time: 3:41 PM
 */
class DateUtil {

  public static function  formatDateTime(dDate:DateTime):String  {
    return new SimpleDateFormat("MM/dd/yyyy").format(dDate)
  }


}