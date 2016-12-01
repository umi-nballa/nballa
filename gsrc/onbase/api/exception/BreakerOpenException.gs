package onbase.api.exception

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Change:
 *   01/05/2015 - J. Walker
 *      * Created
 *
 */
/**
 * Breaker open exception.
 */
class BreakerOpenException extends OnBaseApiException {
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
  construct(msg: String, ex: java.lang.Throwable) {
    super(msg, ex);
  }
}
