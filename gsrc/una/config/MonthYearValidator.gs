package una.config

uses gw.api.validation.FieldValidatorBase
uses gw.api.validation.IFieldValidationResult
uses java.util.Map
uses gw.api.validation.FieldValidationResult
uses java.text.DateFormat
uses java.text.SimpleDateFormat
uses java.text.ParseException

/**
 * Created with IntelliJ IDEA.
 * User: sgopal
 * Date: 10/14/16
 * Time: 5:33 PM
 * To change this template use File | Settings | File Templates.
 */
class MonthYearValidator extends FieldValidatorBase {
  override function validate(monthYearString: String, p1: Object, p2: Map): IFieldValidationResult {
    var result = new FieldValidationResult()
    var DATE_FORMAT = "MM/yyyy";

    try {
      var df : DateFormat = new SimpleDateFormat(DATE_FORMAT);
      df.setLenient(false);
      df.parse(monthYearString);
    } catch (e : ParseException) {
      result.addError(displaykey.Validator.MMYYYY_Ext)
    }
    return result
  }
}