package una.model

uses java.lang.Double


/**
 * Created DTO for Tuna Service
 * Created By: pavan Theegala
 * Created Date: 6/16/16
 */
class PropertyDataModel {

  var Id:String           as ID
  var value:String        as Value
  var line:String         as Line
  var percent:Double      as Percent
  var levelRecord:String  as LevelRecord
  var namedValue: String  as NamedValue
  var listValue: List<PropertyDataModel> as ListValue

}