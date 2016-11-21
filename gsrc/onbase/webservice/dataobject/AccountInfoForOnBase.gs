package onbase.webservice.dataobject

uses java.lang.String

uses gw.xml.ws.annotation.WsiExportable

/**
 * 
 * Hyland Build Version: 16.0.0.999
 * 
 * Last Change:
 *   04/22/2014 - Daniel Q. Yu 
 *     * Initial implementation.
 * 
 */
/**
 * Data object for transferring account metadata to OnBase.
 * <p>
 * Account metadata variables included in this class are for demo purpose. User should only keep minimum metadata variables
 * for performance and synchronization reasons.
 * <p>
 * Volatile variables are the metadata can be changed by Guidewire users. Synchronization of these variables between OnBase and
 * Guidewire will be handled in a later phase of the project.
 */
@WsiExportable("http://onbase.net/onbase/webservice/dataobject")
final class AccountInfoForOnBase {
  /** The account public id. */
  var _publicId : String as PublicID
  /** The account number. */
  var _accountNumber : String as AccountNumber
  /** The account name. */
  var _accountName : String as AccountName
  /** The account status. */
  var _status : String as AccountStatus
  /** The policy information in this account. */
  var _policies : PolicyInfoForOnBase[] as Policies
  /** Error message. */
  var _error : String as Error
}
