package una.pageprocess.account

uses gw.api.phone.StandardPhoneOwner
uses gw.api.phone.PhoneFields
uses gw.api.phone.PhoneOwnerFieldId
/**
 * Created with IntelliJ IDEA.
 * User: dvillapakkam
 * Date: 6/4/16
 * Time: 4:25 PM
 * To change this template use File | Settings | File Templates.
 */

class BasicPhoneOwner extends StandardPhoneOwner{

  var _overrideEditability = false;
  var _editable = true;

  construct(fields : PhoneFields) {
    super(fields, false)
  }

  construct(fields : PhoneFields, label : String) {
    super(fields, label, false)
  }

  construct(fields : PhoneFields, label : String, editable : boolean){
    super(fields, label, false)
    _overrideEditability = true
    _editable = editable
  }

  override function isRequired(fieldId : PhoneOwnerFieldId) : boolean {
    return true
  }

  override function isRegionCodeRequired() : boolean {
    return false
  }

  override function isEditable(fieldId: PhoneOwnerFieldId) : boolean {
    if (_overrideEditability && !_editable){
      return _editable
    }

    return super.isEditable(fieldId)
  }


  override function isFieldVisibleReadOnlyMode(fieldId : PhoneOwnerFieldId) : boolean {
    if (_overrideEditability && !_editable){
      return fieldId == PhoneOwnerFieldId.PHONE_DISPLAY
    }
    return super.isFieldVisibleReadOnlyMode(fieldId)
  }

  override function isFieldVisibleEditMode(fieldId : PhoneOwnerFieldId) : boolean {
    if (_overrideEditability && !_editable){
      return fieldId == PhoneOwnerFieldId.PHONE_DISPLAY
    }
    return super.isFieldVisibleEditMode(fieldId)
  }

}