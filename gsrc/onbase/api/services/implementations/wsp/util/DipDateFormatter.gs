package onbase.api.services.implementations.wsp.util

uses java.text.SimpleDateFormat
/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 12/12/16
 * Time: 11:06 AM
 * To change this template use File | Settings | File Templates.
 */
class DipDateFormatter {

  public static function convertFormat(dateString: String): String {
    var retVal = ""
    if(dateString?.HasContent) {
      var expectedFormat =  new SimpleDateFormat("yyyy-MM-dd")
      var formatForDip = new SimpleDateFormat("MM/dd/yyyy")
      retVal = formatForDip.format(expectedFormat.parse(dateString))
    }
    return retVal
  }
}