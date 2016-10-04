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
   * Value for keyword AccountNumber or null if unset.
   */
  property get AccountNumber() : String { return _keywordMap.get(KeywordMap.accountid) }

  /**
   * Value for keyword ActivityID or null if unset.
   */
  property get ActivityID() : String { return _keywordMap.get(KeywordMap.activityid) }

  /**
   * Value for keyword CheckID or null if unset.
   */
  property get CheckID() : String { return _keywordMap.get(KeywordMap.checkid) }

  /**
   * Value for keyword Claim Number or null if unset.
   */
  property get ClaimNumber() : String { return _keywordMap.get(KeywordMap.claimid) }

  /**
   * Value for keyword Contact ID or null if unset.
   */
  property get ContactID() : String { return _keywordMap.get(KeywordMap.contactid) }

  /**
   * Value for keyword Contact Name or null if unset.
   */
  property get ContactName() : String { return _keywordMap.get(KeywordMap.contactname) }

  /**
   * Value for keyword DocumentIdForRevision or null if unset.
   */
  property get DocumentIdForRevision() : String { return _keywordMap.get(KeywordMap.documentidforrevision) }

  /**
   * Value for keyword Description or null if unset.
   */
  property get Description() : String { return _keywordMap.get(KeywordMap.description) }

  /**
   * Value for keyword ExposureID or null if unset.
   */
  property get ExposureID() : String { return _keywordMap.get(KeywordMap.exposureid) }

  /**
   * Value for keyword ExposureName or null if unset.
   */
  property get ExposureName() : String { return _keywordMap.get(KeywordMap.exposurename) }

  /**
   * Value for keyword FileName or null if unset.
   */
  property get FileName() : String { return _keywordMap.get(KeywordMap.filename) }

  /**
   * Value for keyword InsuredName or null if unset.
   */
  property get InsuredName() : String { return _keywordMap.get(KeywordMap.insured) }

  /**
   * Value for keyword JobNumber or null if unset.
   */
  property get JobNumber() : String { return _keywordMap.get(KeywordMap.jobnumber) }

  /**
   * Value for keyword LinkType or null if unset.
   */
  property get LinkType() : String { return _keywordMap.get(KeywordMap.linktype) }

  /**
   * Value for keyword LinkValue or null if unset.
   */
  property get LinkValue() : String { return _keywordMap.get(KeywordMap.linkvalue) }

  /**
   * Value for keyword MatterID or null if unset.
   */
  property get MatterID() : String { return _keywordMap.get(KeywordMap.matterid) }

  /**
   * Value for keyword MatterName or null if unset.
   */
  property get MatterName() : String { return _keywordMap.get(KeywordMap.mattername) }

  /**
   * Value for keyword MimeType or null if unset.
   */
  property get MimeType() : String { return _keywordMap.get(KeywordMap.mimetype) }

  /**
   * Value for keyword Policy Number or null if unset.
   */
  property get PolicyNumber() : String { return _keywordMap.get(KeywordMap.policyid) }

  /**
   * Value for keyword PolicyID or null if unset.
   */
  property get ProducerID() : String { return _keywordMap.get(KeywordMap.producerid) }


  /**
   * Value for keyword Recipient or null if unset.
   */
  property get Recipient() : String { return _keywordMap.get(KeywordMap.recipient) }

  /**
   * Value for keyword ReserveID or null if unset.
   */
  property get ReserveID() : String { return _keywordMap.get(KeywordMap.reserveid) }

  /**
   * Value for keyword Status or null if unset.
   */
  property get Status() : String { return _keywordMap.get(KeywordMap.status) }

  /**
   * Value for keyword User or null if unset.
   */
  property get User() : String { return _keywordMap.get(KeywordMap.user) }

  /**
   * Value for keyword ClaimSecurityRole or null if unset.
   */
  property get ClaimSecurityRole() : String { return _keywordMap.get(KeywordMap.claimsecurityrole) }

  /**
   * Value for keyword ClaimSecurityRole or null if unset.
   */
  property get AysncDocumentID() : String { return _keywordMap.get(KeywordMap.asyncdocumentid) }
}
