package una.pageprocess

uses gw.api.phone.BasicPhoneOwner
uses gw.api.phone.PhoneFields
uses gw.api.phone.PhoneOwnerFieldId

/**
 * Created with IntelliJ IDEA.
 * User: dvillapakkam
 * Date: 6/5/16
 * Time: 10:32 PM
 * To change this template use File | Settings | File Templates.
 */
class AccountPhoneOwner extends BasicPhoneOwner {
  var isPrimaryPhone = false

  construct(fields : PhoneFields, label : String, primaryPhone: boolean) {
    super(fields, label)
    this.isPrimaryPhone = primaryPhone
  }

  override function isRequired(fieldId : PhoneOwnerFieldId) : boolean {
    return isPrimaryPhone
  }
}