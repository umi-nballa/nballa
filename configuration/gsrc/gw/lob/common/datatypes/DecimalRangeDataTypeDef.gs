package gw.lob.common.datatypes

uses java.lang.NumberFormatException
uses java.math.BigDecimal
uses com.guidewire.pl.metadata.datatype2.constraints.FieldValidatorBasedDecimalConstraintsHandler
uses com.guidewire.pl.metadata.datatype2.impl.DecimalDataTypeDef
uses gw.api.util.Range
uses gw.datatype.def.IDataTypeDefValidationErrors
uses gw.datatype.handler.IDataTypeConstraintsHandler
uses gw.lang.reflect.IPropertyInfo

class DecimalRangeDataTypeDef extends DecimalDataTypeDef {

  var _minimum : String as Minimum
  var _maximum : String as Maximum

  override function validate(prop : IPropertyInfo, errors : IDataTypeDefValidationErrors) {
    super.validate(prop, errors)
    if (_minimum == null || _maximum == null) {
      errors.addError("Range values cannot be null.")
    }
    try {
      var min = new BigDecimal(_minimum)
      var max = new BigDecimal(_maximum)
    } catch (ex : NumberFormatException) {
      errors.addError("Invalid number format.")
    }
  }

  override property get ConstraintsHandler() : IDataTypeConstraintsHandler {
    var min = new BigDecimal(_minimum)
    var max = new BigDecimal(_maximum)
    return new FieldValidatorBasedDecimalConstraintsHandler(null, getValidator(), Range.closed(min, max))
  }

}