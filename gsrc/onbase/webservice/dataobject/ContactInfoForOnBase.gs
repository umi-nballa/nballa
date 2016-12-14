package onbase.webservice.dataobject

uses gw.xml.ws.annotation.WsiExportable

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 11/15/16
 * Time: 2:54 PM
 * To change this template use File | Settings | File Templates.
 */
@WsiExportable("http://onbase.net/onbase/webservice/dataobject")
final class ContactInfoForOnBase {

  var _firstName  : String as FirstName

  var _middleName : String as MiddleName

  var _lastName : String as LastName

  construct() {}

  construct(firstName :String, lastName : String) {
    _firstName = firstName
    _lastName = lastName
  }

  construct(firstName :String, lastName : String, middleName : String) {
    _firstName = firstName
    _lastName = lastName
    _middleName = middleName
  }

}