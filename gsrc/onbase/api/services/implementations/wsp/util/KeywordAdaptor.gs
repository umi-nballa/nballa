package onbase.api.services.implementations.wsp.util

uses onbase.api.exception.ServicesTierException
uses onbase.api.services.datamodels.Keyword

uses java.lang.IllegalArgumentException
uses java.util.HashMap
uses java.util.List
uses onbase.api.KeywordMap
uses onbase.api.services.datamodels.OnBaseDocument

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/30/2015 - dlittleton
 *     * Initial implementation.
 *
 *   01/25/2016 - Daniel Q. Yu
 *     * Added keyword claimsecurityrole.
 *     * Added keyword exposurename.
 *     * Added keyword mattername.
 *
 *   03/23/2016 - Daniel Q. Yu
 *     * Moved Enum to KeywordMap.
 *     * Added AysncDocumentID.
 *
 *   05/17/2016 - Anirudh Mohan
 *      * added DocumentHandle
 *
 *   06/09/2016 - Anirudh Mohan
 *      * added DocumentIdForRevision Property
 *      * Removed DocumentHandle Property
 *
 *   11/10/2016 - Chris Mattox
 *      * Changed all of the keywords
 */

/**
 * Translates the list of Keywords that come into the service layer into a map for
 * easier access.
 */
class KeywordAdaptor {

  private var _keywordMap = new HashMap<KeywordMap, String>();

  /**
   * @param keywords List of keywords to convert
   *
   * @throws onbase.api.exception.ServicesTierException
   */
  construct(keywords : List<Keyword>) {
    try {
      keywords.each( \ k -> _keywordMap.put(KeywordMap.valueOf(k.Name), k.Value))
    } catch(ex: IllegalArgumentException) {
      ex.printStackTrace()
      throw new ServicesTierException("Unknown keyword in keyword adaptor", ex)
    }
  }

  /**
   * Value for keyword ActivityCode or null if unset.
   */
  property get ActivityCode() : String { return _keywordMap.get(KeywordMap.activitycode) }

  /**
   * Value for keyword AdditionalFirstName or null if unset.
   */
  property get AdditionalFirstName() : String { return _keywordMap.get(KeywordMap.additionalfirstname) }

  /**
   * Value for keyword AdditionalMiddleName or null if unset.
   */
  property get AdditionalMiddleName() : String { return _keywordMap.get(KeywordMap.additionalmiddlename) }

  /**
   * Value for keyword AdditionalLastName or null if unset.
   */
  property get AdditionalLastName() : String { return _keywordMap.get(KeywordMap.additionalmiddlename) }

  /**
   * Value for keyword AgencyCode or null if unset.
   */
  property get AgencyCode() : String { return _keywordMap.get(KeywordMap.agencycode) }

  /**
   * Value for keyword ActivityCode or null if unset.
   */
  property get CSR() : String { return _keywordMap.get(KeywordMap.csr) }

  /**
   * Value for keyword Description or null if unset.
   */
  property get Description() : String { return _keywordMap.get(KeywordMap.description) }

  /**
   * Value for keyword IssueDate or null if unset.
   */
  property get IssueDate() : String { return _keywordMap.get(KeywordMap.issuedate) }

  /**
   * Value for keyword JobDisplayName or null if unset.
   */
  property get JobDisplayName() : String { return _keywordMap.get(KeywordMap.jobdisplayname) }

  /**
   * Value for keyword JobID or null if unset.
   */
  property get JobID() : String { return _keywordMap.get(KeywordMap.jobid) }

  /**
   * Value for keyword JobNumber or null if unset.
   */
  property get JobNumber() : String { return _keywordMap.get(KeywordMap.jobnumber) }

  /**
   * Value for keyword LegacyPolicyNumber or null if unset.
   */
  property get LegacyPolicyNumber() : String { return _keywordMap.get(KeywordMap.legacypolicynumber) }

  /**
   * Value for keyword MailDate or null if unset.
   */
  property get MailDate() : String { return _keywordMap.get(KeywordMap.maildate) }

  /**
   * Value for keyword MailFromAddress or null if unset.
   */
  property get MailFromAddress() : String { return _keywordMap.get(KeywordMap.mailfromaddress) }

  /**
   * Value for keyword MailSubject or null if unset.
   */
  property get MailSubject() : String { return _keywordMap.get(KeywordMap.mailsubject) }

  /**
   * Value for keyword MailToAddress or null if unset.
   */
  property get MailToAddress() : String { return _keywordMap.get(KeywordMap.mailtoaddress) }

  /**
   * Value for keyword NamedInsured or null if unset.
   */
  property get NamedInsured() : String { return _keywordMap.get(KeywordMap.namedinsured) }

  /**
   * Value for keyword OnBaseDocumentType or null if unset.
   */
  property get OnBaseDocumentType() : String { return _keywordMap.get(KeywordMap.onbasedocumenttype) }

  /**
   * Value for keyword PolicyEffectiveDate or null if unset.
   */
  property get PolicyEffectiveDate() : String { return _keywordMap.get(KeywordMap.policyeffectivedate) }

  /**
   * Value for keyword PolicyExpirationDate or null if unset.
   */
  property get PolicyExpirationDate() : String { return _keywordMap.get(KeywordMap.policyexpirationdate) }

  /**
   * Value for keyword PolicyNumber or null if unset.
   */
  property get PolicyNumber() : String { return _keywordMap.get(KeywordMap.policynumber) }

  /**
   * Value for keyword PolicyType or null if unset.
   */
  property get PolicyType() : String { return _keywordMap.get(KeywordMap.policytype) }

  /**
   * Value for keyword PrimaryFirstName or null if unset.
   */
  property get PrimaryFirstName() : String { return _keywordMap.get(KeywordMap.primaryfirstname) }

  /**
   * Value for keyword PrimaryMiddleName or null if unset.
   */
  property get PrimaryMiddleName() : String { return _keywordMap.get(KeywordMap.primarymiddlename) }

  /**
   * Value for keyword PrimaryLastName or null if unset.
   */
  property get PrimaryLastName() : String { return _keywordMap.get(KeywordMap.primarylastname) }

  /**
   * Value for keyword ProductName or null if unset.
   */
  property get ProductName() : String { return _keywordMap.get(KeywordMap.productname) }

  /**
   * Value for keyword ReceivedDate or null if unset.
   */
  property get ReceivedDate() : String { return _keywordMap.get(KeywordMap.receiveddate) }

  /**
   * Value for keyword Subtype or null if unset.
   */
  property get Subtype() : String { return _keywordMap.get(KeywordMap.subtype) }

  /**
   * Value for keyword SuppressActivity or null if unset.
   */
  property get SuppressActivity() : String { return _keywordMap.get(KeywordMap.supressactivity) }

  /**
   * Value for keyword Term or null if unset.
   */
  property get Term() : String { return _keywordMap.get(KeywordMap.term) }

  /**
   * Value for keyword TransactionEffectiveDate or null if unset.
   */
  property get TransactionEffectiveDate() : String { return _keywordMap.get(KeywordMap.transactioneffectivedate) }

  /**
   * Value for keyword Underwriter or null if unset.
   */
  property get Underwriter() : String { return _keywordMap.get(KeywordMap.underwriter) }

}
