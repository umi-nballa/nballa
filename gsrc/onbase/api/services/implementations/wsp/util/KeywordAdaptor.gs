package onbase.api.services.implementations.wsp.util

uses onbase.api.exception.ServicesTierException
uses onbase.api.services.datamodels.Keyword

uses java.lang.IllegalArgumentException
uses java.util.HashMap
uses onbase.api.KeywordMap
uses onbase.api.services.datamodels.InsuredName
uses java.util.ArrayList

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
  private var _keywordMap = new HashMap<KeywordMap, Object>();
  /**
   * @param keywords List of keywords to convert
   *
   * @throws onbase.api.exception.ServicesTierException
   */
  construct(keywords: List<Keyword>) {
    try {
      keywords.each(\k -> {
        var keyword = KeywordMap.valueOf(k.Name)
        var keywordVal = _keywordMap.get(keyword)
        if (keywordVal == null) {
          _keywordMap.put(keyword, k.Value)
        } else {

          if (typeof keywordVal == List) {
            var list = keywordVal as List<Object>
            list.add(k.Value)
          } else {
            _keywordMap.put(keyword, new ArrayList<Object>({keywordVal, k.Value}))
          }
        }
      })
    } catch (ex: IllegalArgumentException) {
      ex.printStackTrace()
      throw new ServicesTierException("Unknown keyword in keyword adaptor", ex)
    }
  }

  /**
   * Value for keyword ActivityCode or null if unset.
   */
  property get ActivityCode(): String {
    return _keywordMap.get(KeywordMap.activitycode) as String
  }

  /**
   *  Value for keyword AdditionalNamed Insureds or null if unset.
   */
  property get AdditionalNamedInsureds(): List<InsuredName> {
    var val = _keywordMap.get(KeywordMap.additionalnamedinsureds)
    if (val typeis InsuredName) {
      return new ArrayList<InsuredName>({val})
    }

    return val as List<InsuredName>
  }

  /**
   * Value for keyword AccountNumber or null if unset.
   */
  property get AccountNumber(): String {
    return _keywordMap.get(KeywordMap.accountnumber) as String
  }

  /**
   * Value for keyword AgencyCode or null if unset.
   */
  property get AgencyCode(): String {
    return _keywordMap.get(KeywordMap.agencycode) as String
  }

  /**
   * Value for keyword Description or null if unset.
   */
  property get Description(): String {
    return _keywordMap.get(KeywordMap.description) as String
  }

  /**
   * Value for keyword IssueDate or null if unset.
   */
  property get IssueDate(): String {
    return _keywordMap.get(KeywordMap.issuedate) as String
  }

  /**
   * Value for keyword JobDisplayName or null if unset.
   */
  property get JobDisplayName(): String {
    return _keywordMap.get(KeywordMap.jobdisplayname) as String
  }

  /**
   * Value for keyword JobID or null if unset.
   */
  property get JobID(): String {
    return _keywordMap.get(KeywordMap.jobid) as String
  }

  /**
   * Value for keyword JobNumber or null if unset.
   */
  property get JobNumber(): String {
    return _keywordMap.get(KeywordMap.jobnumber) as String
  }

  /**
   * Value for keyword LegacyPolicyNumber or null if unset.
   */
  property get LegacyPolicyNumber(): String {
    return _keywordMap.get(KeywordMap.legacypolicynumber) as String
  }

  /**
   * Value for keyword MailDate or null if unset.
   */
  property get MailDate(): String {
    return _keywordMap.get(KeywordMap.maildate) as String
  }

  /**
   * Value for keyword MailFromAddress or null if unset.
   */
  property get MailFromAddress(): String {
    return _keywordMap.get(KeywordMap.mailfromaddress) as String
  }

  /**
   * Value for keyword MailSubject or null if unset.
   */
  property get MailSubject(): String {
    return _keywordMap.get(KeywordMap.mailsubject) as String
  }

  /**
   * Value for keyword MailToAddress or null if unset.
   */
  property get MailToAddress(): String {
    return _keywordMap.get(KeywordMap.mailtoaddress) as String
  }

  /**
   * Value for keyword NamedInsured or null if unset.
   */
  property get NamedInsured(): String {
    return _keywordMap.get(KeywordMap.namedinsured) as String
  }

  /**
   * Value for keyword OnBaseDocumentType or null if unset.
   */
  property get OnBaseDocumentType(): String {
    return _keywordMap.get(KeywordMap.onbasedocumenttype) as String
  }

  /**
   * Value for keyword PolicyEffectiveDate or null if unset.
   */
  property get PolicyEffectiveDate(): String {
    return _keywordMap.get(KeywordMap.policyeffectivedate) as String
  }

  /**
   * Value for keyword PolicyExpirationDate or null if unset.
   */
  property get PolicyExpirationDate(): String {
    return _keywordMap.get(KeywordMap.policyexpirationdate) as String
  }

  /**
   * Value for keyword PolicyNumber or null if unset.
   */
  property get PolicyNumber(): String {
    return _keywordMap.get(KeywordMap.policynumber) as String
  }

  /**
   * Value for keyword PolicyType or null if unset.
   */
  property get PolicyType(): String {
    return _keywordMap.get(KeywordMap.policytype) as String
  }

  /**
   *  Value for keyword Primary Named Insureds or null if unset.
   */
  property get PrimaryNamedInsureds(): List<InsuredName> {
    var val = _keywordMap.get(KeywordMap.primarynamedinsureds)
    if (val typeis InsuredName) {
      return new ArrayList<InsuredName>({val})
    }

    return val as List<InsuredName>
  }

  /**
   * Value for keyword ProductName or null if unset.
   */
  property get ProductName(): String {
    return _keywordMap.get(KeywordMap.productname) as String
  }

  /**
   * Value for keyword ReceivedDate or null if unset.
   */
  property get ReceivedDate(): String {
    return _keywordMap.get(KeywordMap.receiveddate) as String
  }

  /**
   * Value for keyword Subtype or null if unset.
   */
  property get Subtype(): String {
    return _keywordMap.get(KeywordMap.subtype) as String
  }

  /**
   * Value for keyword SuppressActivity or null if unset.
   */
  property get SuppressActivity(): String {
    return _keywordMap.get(KeywordMap.supressactivity) as String
  }

  /**
   * Value for keyword Term or null if unset.
   */
  property get Term(): String {
    return _keywordMap.get(KeywordMap.term) as String
  }

  /**
   * Value for keyword TransactionEffectiveDate or null if unset.
   */
  property get TransactionEffectiveDate(): String {
    return _keywordMap.get(KeywordMap.transactioneffectivedate) as String
  }

  /**
   * Value for keyword Async Document ID or null if unset.
   */
  property get AysncDocumentID(): String {
    return _keywordMap.get(KeywordMap.asyncdocumentid) as String
  }

  property get Source(): String {
    return _keywordMap.get(KeywordMap.source) as String
  }
}
