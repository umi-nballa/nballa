package onbase.api.exception

uses java.lang.Throwable

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/21/2015 - Richard R. Kantimahanthi
 *     * Initial implementation.
 *
 *     01/28/2015 - Clayton Sandham
 *     * Changed the base exception type to OnBaseApiException so that we
 *     * have a specific catch-all exception that doesn't catch beyond what we throw.
 */
/**
 * Missing Document MetaData Exception.
 */
class MissingMetadataException extends OnBaseApiException {
  /**
   * Constructor.
   *
   * @param msg The exception message.
   */
  construct(msg: String) {
    super(msg);
  }

  /**
   * Constructor.
   *
   * @param msg The exception message.
   * @param ex The underlying cause of this exception.
   */
  construct(msg: String, ex: Throwable) {
    super(msg, ex);
  }
}
