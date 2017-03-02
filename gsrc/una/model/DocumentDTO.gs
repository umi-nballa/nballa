package una.model

uses java.io.File




/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 2/27/17
 * Time: 2:03 PM
 * To change this template use File | Settings | File Templates.
 */
class DocumentDTO {

  var _account: entity.Account as Account
  var _policy: entity.Policy  as Policy
  var _description: String as Description
  var _file: File as File
  var _onBaseDocType: typekey.OnBaseDocumentType_Ext as OnBaseDocumentType
  var _onBaseDocSubtype: typekey.OnBaseDocumentSubtype_Ext as OnBaseDocumentSubype

  construct() {}

  construct(account: Account, policy: Policy, file: File, docType: OnBaseDocumentType_Ext, docSubType: OnBaseDocumentSubtype_Ext, description: String) {
    _account = account
    _policy = policy
    _file = file
    _onBaseDocType = docType
    _onBaseDocSubtype = docSubType
    _description = description
  }

}