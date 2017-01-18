package una.model

uses java.lang.Double
uses java.math.BigDecimal
uses java.lang.Override
uses gw.xml.ws.annotation.WsiExportable

/**
 * Created DTO for Tuna Service
 * Created By: pavan Theegala
 * Created Date: 6/16/16
 */
class PropertyDataModel {
  var Id:String           as ID
  var value:String        as Value
  var percent:BigDecimal      as Percent
  var namedValue:String   as NamedValue

//  override  function toString() : String {
//    return value + " (" + percent + "%)"
//  }
}