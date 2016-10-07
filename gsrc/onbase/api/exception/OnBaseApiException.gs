package onbase.api.exception

uses java.lang.Exception
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
 * This is an API specific catch-all exception so we can catch only what we throw. Use this as a base for any new exceptions.
 */
class OnBaseApiException extends Exception {
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
