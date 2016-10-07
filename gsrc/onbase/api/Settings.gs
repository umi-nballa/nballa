package onbase.api

uses gw.i18n.ILocale
uses onbase.api.services.interfaces.MessageProcessingInterface

uses java.util.ArrayList
uses java.util.List
//uses onbase.api.services.interfaces.MessageProcessingInterface
uses java.util.Map

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/13/2015 - Daniel Q. Yu
 *     * Initial implementation.
 *   01/14/2015 - Daniel Q. Yu
 *     * Added services/application settings.
 *   02/18/2015 - Richard R. Kantimahanthi
 *     * Added configurations specific to OnBase application messaging.
 *     * Added 'claimid' to the DeprecatedDocumentLinkType.  This is done to delete (temp claim#) and add (new claim#) from documents linked during New Claim Creation process.
 *   04/01/2015 - Daniel Q. Yu
 *     * Added settings for DocumentProvider cache system.
 *   05/29/2015 - Daniel Q. Yu
 *     * Changed DocumentProvider Settings to be GW 7 compatible.
 *     * Added DocumentProvider Settings for genericCache to replace SimpleTimedCache.
 *   07/02/2015 - Daniel Q. Yu
 *     * Added estimated cache object sizes.
 *   08/03/2015 - Daniel Q. Yu
 *	   * Added setting enableLinkedDocumentCount with default of true.
 *   11/16/2015 - Daniel Q. Yu
 *     * Added queryServiceTestKeywords for admin pages query services.
 *	 01/08/2016 - Daniel Q. Yu
 *	   * Added message function UpdateDocumentPermission.
 *	 04/26/2016 - Richard R. Kantimahanthi
 *	   * Added 'exposureid' DocumentLinkType enum.
 *	 02/06/2016 - Anirudh Mohan
 *	   * Updated the CurrentCenter to "policy"
 *	 06/29/2016- Anirudh Mohan
 *     * Added message type configuration for message broker (MessageProcessors-NewDocNotify)
 */
/**
 * This class stores all settings for OnBase Guidewire API.
 */
class Settings {
  //
  //========== General Settings ==========//
  /** Current Guidewire center. */
  public static final var CurrentCenter: GuidewireCenter = GuidewireCenter.policy
  /**
   * Enum for Guidewire centers.
   */
  enum GuidewireCenter {
    claim, policy, billing
  }

  /** OnBase document security type */
  public static final var DocumentSecurity: DocumentSecurityType = DocumentSecurityType.TC_UNRESTRICTED
  /** OnBase document type */
  public static final var DocumentType: DocumentType = DocumentType.TC_ONBASE
  /** OnBase document locale */
  public static final var DocumentLocale: ILocale = ILocale.EN_US
  //
  //==========  Logger Categories ==========//
  /** Services logger category. */
  public static final var ServicesLoggerCategory: String = "Document.OnBaseDMS"
  /** Application logger category. */
  public static final var ApplicationLoggerCategory: String = "Document.OnBaseDMS"
  /** Plugin logger category. */
  public static final var PluginLoggerCategory: String = "Document.OnBaseDMS"
  /** Admin pages logger category */
  public static final var AdminPageLoggerCategory: String = "Document.OnBaseDMS"
  //
  //========== Application Settings ==========//
  /** DocumentProvider Cache - thread pool size for background refresh. */
  public static final var enableDocumentProviderCache : boolean = true
  /** DocumentProvider Cache - thread pool size for background refresh. Not used in GW 7. */
  public static final var DocumentProviderThreadPoolSize : int = 5
  /** DocumentProvider Cache - primary context separator. */
  public static final var primaryContextSeparator : String = ";;;"
  /** Estimated OnBaseDocument object size in Bytes. This information can be looked up from Java VisualVM retained object size. */
  public static final var OnBaseDocument_EntrySize : int = 1500
  /**
   * DocumentProvider Cache - contextCache configuration.
   * maximumWeight limits number of documents. 20,000 = 30MB +/- depending on GC. GW 7 use this number set maximumSize
   * refreshAfterWrite triggers refresh on the next Get, but will serve 'stale' cache while refresh is done. 10 = 10 minutes. Not used in GW 7.
   * expireAfterWrite completely expires result set, the data will be dropped from cache. 20 = 20 minutes
   */
  public static final var contextCache_maximumWeight : int = 20000
  public static final var contextCache_refreshAfterWrite : int = 10
  public static final var contextCache_expireAfterWrite : int =20

  /**
   * DocumentProvider Cache - docIdCache configuration.
   * maximumSize limits number of documents. 20,000 = 30MB +/- depending on GC
   * refreshAfterWrite triggers refresh on the next Get, but will serve 'stale' cache while refresh is done. 10 = 10 minutes. Not used in GW 7.
   * expireAfterWrite completely expires result set, the data will be dropped from cache. 20 = 20 minutes
   */
  public static final var docIdCache_maximumSize : int = 20000
  public static final var docIdCache_refreshAfterWrite : int = 10
  public static final var docIdCache_expireAfterWrite : int = 20

  /**
   * DocumentProvider Cache - genericCache configuration.
   * maximumSize limits number of entries.
   * expireAfterWrite completely expires result set, the data will be dropped from cache. 60 = 60 minutes
   * entrySize is the estimated object size in memory in Bytes. This information can be looked up from Java VisualVM retained object size.
   */
  public static final var genericCache_maximumSize : int = 20000
  public static final var genericCache_refreshAfterWrite : int = 60
  public static final var genericCache_expireAfterWrite : int = 360
  public static final var genericCache_entrySize : int = 1000

  /**
   * Enum for DocumentLinking - LinkType.
   */
  enum DocumentLinkType {
    activityid, checkid, reserveid, ServiceRequest, claimid, exposureid
  }

  /** These are deprecated link types which use single keyword (not MIKG) in OnBase. These can be removed if current implementation
      has not been using them. But if anything else added to this list, backend service need to be changed accordingly.
      legacy values - new ArrayList() {DocumentLinkType.activityid, DocumentLinkType.checkid, DocumentLinkType.reserveid} */
  public static final var DeprecatedDocumentLinkType: List = new ArrayList() {DocumentLinkType.claimid}

  /** Enable the linked document count before user click on it. */
  public static final var enableLinkedDocumentCount : boolean = true

  // Use static text for document names when linking to notes. This can improve performance by avoiding a
  // web service call to retrieve the document name.
  public static final var useStaticNoteLinking : boolean = true

  //
  //========== Service Breaker Settings ==========//
  /**  BreakerRetryTime - Time to wait after breaker-open service failure until a retry is allowed (in seconds) */
  public static final var BreakerRetryTime: int = 600
  /** BreakerErrorTrigger - Number of consecutive errors needed to open the service breaker */
  public static final var BreakerErrorTrigger: int = 3
  /** BreakerExceptionList - Types that will trigger an error count */
  public static final var BreakerExceptionList: Type[] = {gw.xml.ws.WebServiceException,
      gw.xml.ws.WsdlFault,
      java.io.IOException }
  /**
   * Enum for DocumentRetrieval - Client types.
   */
  enum OnBaseClientType {
    Unity, Web
  }

  /**
   * Enum for DocumentRetrieval - Web Client types.
   */
  enum OnBaseWebClientType {
    HTML, ActiveX
  }

  /** DocumentRetrieval - AE Scrape URL. */
  public static final var AEScrapeURL: String = "onbase://ae/xml/?xmlInfo="
  /** DocumentRetrieval - AE Scrape tag. */
  public static final var AEScrapeTag: String = 'SCRAPE'
  /** KeywordMapping - local cached keyword mapping file. */
  public final static var keywordFile: String = "modules/configuration/gsrc/onbase/api/obmapping.properties"
  /** TemplateMapping - local cached template mapping file. */
  public final static var templateFile: String = "modules/configuration/gsrc/onbase/api/templatemapping.properties"
  /** Admin Pages - Is service stats logging enabled.  */
  public static final var isServiceStatsLoggingEnabled: boolean = true
  /** Admin Pages - default query service test keywords. */
  public static final var queryServiceTestKeywords: String = "claimid,235-53-365870"


  //========== OnBase Application Messaging Settings ==========//

  /** OnBase Message function keyword id */
  public static final var OnBaseMessageFunction : String = "OnBaseMessageFunction"
  /** OnBase message request in the OnBaseMessageTransport is built based on the OnBaseMessageFunctionType. */
  enum OnBaseMessageFunctionType {
    DocumentArchive, NewClaimUpdateKeywords, UpdateDocumentPermission
  }
  /**  List of keyword names used for GW messaging architecture. */
  enum OnBaseMessageKeywords {
    filename,
    documentname,
    documenttype,
    documentmimetype,
    documentdescription,
//    claimid,
    activityid,
    doclinknewactivityid,
//    exposureid,
//    exposurename,
//    contactid,
//    contactname,
//    matterid,
//    mattername,
//    tempclaimnumber,
//    newclaimnumber
  }

  // MessageBroker message type configuration.
  public static final var MessageProcessors : Map<OnBaseMessageBrokerType_Ext, MessageProcessingInterface> = {
    OnBaseMessageBrokerType_Ext.TC_NEWDOCNOTIFY -> new onbase.api.services.implementations.wsp.NewDocumentNotifyWSP()
  }
  //
  public static final var MessageBrokerSuccess : String = 'SUCCESS'
  public static final var MessageBrokerError : String = 'DATAERROR'
}
