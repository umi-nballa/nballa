package gwservices.pc.dm.batch

uses com.gwservices.pc.dm.exception.DAException
uses com.gwservices.pc.dm.util.PropertyHelper
uses gw.api.database.Query
uses gw.transaction.Transaction
uses gwservices.pc.dm.api.DMTransactionContainer
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.account.accountmodel.Account
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod
uses gwservices.pc.dm.util.DMLogger

uses java.lang.Long
uses java.lang.System
uses java.lang.Thread
uses java.lang.Throwable
uses java.util.Map

/**
 * Core implementation of the migration process. Include transaction specific functionality.
 * Implementation classes should manage data access.
 */
abstract class AbstractMigrationProcess {
  /// Logging ///
  private static final var _LOG_TAG = "${AbstractMigrationProcess.Type.RelativeName} - "
  private static final var _logger = DMLogger.General
  /** Server id when not identified */
  private static final var _DEFAULT_SERVER_ID = "<no server id>"
  /** Migration role property */
  private static final var _MIGRATION_ROLE = "MIGRATION_ROLE"
  /** Migration user property */
  private static final var _MIGRATION_USER = "MIGRATION_USER"
  /** Server id property from guidewire */
  private static final var _SERVER_ID = "gw.pc.serverid"
  /** Attempted transactions */
  private var _attempted: int as readonly Attempted = 0
  /** Failed sequence numbers */
  private var _failedSequenceNumbers: List <Long> = {}
  /** Cache migration user */
  private var _migrationUser: User
  /** Migration process configuration */
  private var _propertyHelper: PropertyHelper as readonly PropertyHelper
  /** Successful transactions */
  private var _successful: int as readonly Successful = 0
  /** Transaction container */
  private var _transactionContainer = new DMTransactionContainer()
  /**
   * Constructor from a generic map of parameters
   */
  construct(params: Map <String, String>) {
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "parameters ${params}")
    }
    _propertyHelper = new PropertyHelper(params)
  }

  /**
   * Handle processing success
   */
  protected abstract function handleSuccess(migrationRecord: MigrationRecord)

  /**
   * Handle processing failure
   */
  protected abstract function handleFailure(recordId: long, sequenceNumber: long, ex: Throwable)

  /**
   * Execute the migration process
   */
  function processRecord(record: MigrationRecord) {
    if (not _failedSequenceNumbers.contains(record.SequenceNumber)) {
      _attempted++
      try {
        Transaction.runWithNewBundle(\bundle -> {
          record = _transactionContainer.getTransactionAPI(record.PayloadType).processRecord(record, bundle)
        }, MigrationUser)
        handleSuccess(record)
        _successful++
      } catch (throwable: Throwable) {
        fail(record, throwable)
      }
    }
  }

  /**
   * Keep track of failed sequenece numbers
   */
  protected function fail(record: MigrationRecord, throwable: Throwable) {
    handleFailure(record.ID, record.SequenceNumber, throwable)
    _failedSequenceNumbers.add(record.SequenceNumber)
  }

  /**
   * Convenience. Worker identifier
   */
  protected property get WorkerID(): String {
    var serverId = System.getProperty(_SERVER_ID) != null ? System.getProperty(_SERVER_ID) : _DEFAULT_SERVER_ID
    return "${serverId} - ${Thread.currentThread().Name}"
  }

  /**
   * Retrieve the migration processing user
   */
  protected property get MigrationUser(): User {
    if (_migrationUser != null) return _migrationUser
    var role: Role
    var result: User
    var migrationRoleStr = PropertyHelper.getProperty(_MIGRATION_ROLE)
    var migrationUser = PropertyHelper.getProperty(_MIGRATION_USER)
    if (migrationUser.HasContent and migrationRoleStr.HasContent) {
      var queryProduct = Query.make(User)
      queryProduct.join(User#Credential).compare(Credential#UserName, Equals, migrationUser)
      result = queryProduct.select().AtMostOneRow
      role = Query.make(Role).compare("Name", Equals, migrationRoleStr).select().AtMostOneRow
    }
    if (result != null) {
      if (role == null or not result.hasRole(role)) {
        throw new DAException("missing role ${role} or role not assigned to user ${migrationUser}")
      }
      _migrationUser = result
    } else {
      _migrationUser = User.util.UnrestrictedUser
    }
    return _migrationUser
  }

  /**
   * Parse a payload and handle error if necessary. Assumed other needed fields have been set
   */
  protected function safeParsePayload(payload: String, mr: MigrationRecord): boolean {
    try {
      if (mr.PayloadType == "Account") {
        System.out.print("Account payload : "+payload)
        mr.Account = Account.parse(payload)
        var account = mr.Account
        mr.MigrationEntityTransactionID = account.AccountNumber != null ? account.AccountNumber : account.PublicID
        mr.AutoDelete = mr.Account.MigrationAccountInfo_Ext.AutoDelete
      } else {
        System.out.print("Policy payload : "+payload)
        mr.PolicyPeriod = PolicyPeriod.parse(payload)
        var branch = mr.PolicyPeriod
        mr.MigrationEntityTransactionID = branch.PolicyNumber != null ? branch.PolicyNumber : branch.Policy.PublicID
        mr.AutoDelete = mr.PolicyPeriod.Job.MigrationJobInfo_Ext.AutoDelete
      }
      if (_logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "safeParsePayload loaded ${mr.DebugString}")
      }
      return true
    } catch (t: Throwable) {
      var exp = new DataMigrationNonFatalException(CODE.UNPARSEABLE_MODEL, t)
      fail(mr, exp)
      return false
    }
  }
}
