package onbase.api.exception

uses java.lang.Throwable

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Server connection exception in the services-tier
 *
 * Last Changes:
 *   02/11/2015 - Richard R. Kantimahanthi
 *     * Initial implementation.
 */

class ServicesTierServerConnectionException extends ServicesTierException {
  construct(msg: String) {
    super(msg);
  }
  construct(msg: String, ex: Throwable) {
    super(msg, ex);
  }
}
