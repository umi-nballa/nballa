package una.rating.autoratebookload

uses gw.api.productmodel.PolicyLinePattern

uses java.io.File
uses java.util.Date

/**
 * Rate Book data that one can read from the "header" (IE: first few elements) of an exported Rate Book XML file.
 */
class RateBookProperties {
  var _file: File as JavaFile
  var _code: String as BookCode
  var _name: String as BookName
  var _desc: String as BookDesc
  var _edition: int as BookEdition
  var _policyLine: PolicyLinePattern as PolicyLine
  var _status: RateBookStatus as Status
  var _effectiveDate: Date as EffectiveDate
  var _expirationDate: Date as ExpirationDate
  var _lastStatusChangeDate: Date as LastStatusChangeDate
  var _renewalEffectiveDate: Date as RenewalEffectiveDate
  protected construct() {
  }
}
