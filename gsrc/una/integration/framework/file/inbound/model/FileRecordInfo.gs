package una.integration.framework.file.inbound.model

uses una.integration.framework.exception.FieldErrorInformation

uses java.lang.Integer
uses java.util.Collection
uses java.util.Map

/**
 * Holds record information (corresponds to record mapping in file) from flat file.
 * If record read fails, then this bean holds the actual record and error information.
 * Created By: vtadi on 5/18/2016
 */
class FileRecordInfo {
  var _recordName: String as RecordName
  var _recordObject: Object as RecordObject
  var _recordLineNumber: Integer as RecordLineNumber
  var _failed: Boolean as Failed = false
  var _recordText: String as RecordText
  var _recordErrors: Collection<String> as RecordErrors
  var _fieldErrors: Map<String, Collection<String>> as FieldErrors

  /**
   * Creates and returns FieldErrorInformation if the record is failed
   */
  property get FieldErrorInfo() : FieldErrorInformation {
    var filedErrorInfo : FieldErrorInformation = null
    if (_failed) {
      filedErrorInfo = new FieldErrorInformation() {
          :FieldName = "Error at Line " + _recordLineNumber,
          :FieldValue = _recordText,
          :ErrorMessage = (_recordErrors?:_fieldErrors) as String
      }
    }
    return filedErrorInfo
  }
}