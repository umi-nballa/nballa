package onbase.webservice.dataobject

uses gw.xml.ws.annotation.WsiExportable

uses java.util.Date

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
 * Data object for transferring policy metadata to OnBase.
 * <p>
 * Account metadata variables included in this class are for demo purpose. User should only keep minimum metadata variables
 * for performance and synchronization reasons.
 * <p>
 * Volatile variables are the metadata can be changed by Guidewire users. Synchronization of these variables between OnBase and
 * Guidewire will be handled in a later phase of the project.
 */
@WsiExportable("http://onbase.net/onbase/webservice/dataobject")
public final class PolicyInfoForOnBase {
  /** The policy public id. */
  var _publicId: String as PublicID
  /** The policy number. */
  var _policyNumber: String as PolicyNumber
  /** The policy type. */
  var _policyType: String as PolicyType
  /** The policy issued date. */
  var _issuedDate: Date as IssuedDate
  /** The underwriter for this policy. */
  var _underwriter: String as Underwriter
  /** The jobs information in this policy. */
  var _jobs: JobInfoForOnBase[] as PolicyJobs

  /** The primary named insured*/
  var _primaryNamedInsured : ContactInfoForOnBase as PrimaryNamedInsured

 // var _primaryFirstName : String as PrimaryFirstName
  //var _primaryLastName : String as PrimaryLastName

//  var _secondaryFirstName  : String as SecondaryFirstName
//  var _secondaryLastName : String as SecondaryLastName

  /** The additional named insured*/
  var _additionalNamedInsureds : ContactInfoForOnBase[] as AdditionalNamedInsured
  /** The name of the product */
  var _productName : String as ProductName
  /** The effective date of the policy */
  var _policyEffectiveDate : Date as PolicyEffectiveDate
  /** The expiration date of the policy */
  var _policyExpirationDate : Date as PolicyExpirationDate
  /** The term of the policy */
  var _term : String as Term
  /** The agency code/producer code */
  var _agencyCode : String as AgencyCode
  /** The legacy policy number */
  var _legacyPolicyNumber: String as LegacyPolicyNumber
  /** The transaction effective date */
  var _transactionEffectiveDate: Date as TransactionEffectiveDate
  /** The customer service representative */
  var _csr: String as CSR

}
