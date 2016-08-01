package gwservices.pc.dm.api

uses gw.pl.persistence.core.Bundle
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.gx.entitypopulators.Registry

/**
 * Entry point for loading accounts
 */
class DMAccountAPI extends DMTransactionAPIBase {
  /// Logging prefix ///
  private static final var _LOG_TAG = "${DMAccountAPI.Type.RelativeName} - "
  construct(registry: Registry) {
    super(registry)
  }

  override function processRecordInternal(record: MigrationRecord, bundle: Bundle) {
    var acct = PopulatorUtil.populate(record.Account, record, bundle) as Account
    if (_logger.DebugEnabled) {
      _logger.debug("${_LOG_TAG} addAccount generated account number ${acct.AccountNumber} ")
    }
    record.ApplicationID = acct.AccountNumber
  }
}
