package onbase.api.exception

uses java.lang.Throwable

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/28/2015 - Clayton Sandham
 *     * Initial implementation.
 */
/**
 * General-purpose services-tier exception.
 */
class ServicesTierException extends OnBaseApiException {
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
