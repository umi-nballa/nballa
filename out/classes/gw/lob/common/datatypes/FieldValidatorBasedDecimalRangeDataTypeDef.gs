package gw.lob.common.datatypes

uses java.math.BigDecimal
uses com.guidewire.pl.metadata.datatype2.impl.FieldValidatorBasedDataTypeDef
uses gw.datatype.def.IDataTypeDefValidationErrors
uses gw.lang.reflect.IPropertyInfo

abstract class FieldValidatorBasedDecimalRangeDataTypeDef extends FieldValidatorBasedDataTypeDef {

  var _minimum : BigDecimal as Minimum
  var _maximum : BigDecimal as Maximum

  override function validate(prop : IPropertyInfo, errors : IDataTypeDefValidationErrors) {
    super.validate(prop, errors)
    if (_minimum == null || _maximum == null) {
      errors.addError("Range values cannot be null.")
    }
  }

}