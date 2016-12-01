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
 * Data object for transferring job metadata to OnBase.
 * <p>
 * Account metadata variables included in this class are for demo purpose. User should only keep minimum metadata variables
 * for performance and synchronization reasons.
 * <p>
 * Volatile variables are the metadata can be changed by Guidewire users. Synchronization of these variables between OnBase and
 * Guidewire will be handled in a later phase of the project.
 */
@WsiExportable("http://onbase.net/onbase/webservice/dataobject")
final class JobInfoForOnBase {
  /** The job public id. */
  var _publicId: String as PublicID
  /** The job number. */
  var _jobNumber: String as JobNumber
  /** The job creation date. */
  var _createDate: Date as CreateDate
  /** The job status. */
  var _jobStatus: String as JobStatus
  /** The job type. */
  var _jobType: String as JobType
  /** The underwriter for this job. */
  var _underwriter: String as Underwriter
}
