package onbase.api.exception

uses java.lang.Exception
uses java.lang.Throwable


/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   07/09/2015 - Richard Kantimahanthi
 *     * Initial implementation.
 */
/**
 * This is a Document Retrieval specific catch-all exception.
 */
class OnBaseDocRetrievalException extends Exception {
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

