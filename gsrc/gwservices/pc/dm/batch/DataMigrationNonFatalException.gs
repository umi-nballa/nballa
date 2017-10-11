package gwservices.pc.dm.batch

uses java.lang.Exception
uses java.lang.Throwable

class DataMigrationNonFatalException extends Exception {
  /** Error codes from data migration processing */
  public static final enum CODE {
    GENERAL, MISSING_PRODUCER, MISSING_ACTION, MISSING_POLICY_NUMBER, MISSING_PUP_LINE,
    BAD_EXPOSURE_TYPE, MISSING_EXPOSURE, MISSING_UNDERLYING_POLICY, MISSING_CONTACT_ROLE,
    MISSING_CONTACT, INVALID_CONTACT_TYPE, UNSUPPORTED_OPERATION, DUPLICATE_PRODUCER,
    MISSING_UNDERWRITER, ACCOUNT_FAILURE, MISSING_POLICY, INVALID_POLICY_STATE, MISSING_ACCOUNT,
    MISSING_PRODUCT, MISSING_ACCOUNT_HOLDER, MISSING_COVERAGE, INVALID_COVERAGE,
    MISSING_COVERAGE_TERM, INVALID_COVERAGE_TERM, MISSING_CONDITION, MISSING_MODIFIER_PATTERN_CODE, MISSING_MODIFIER,
    INVALID_MODIFIER, INVALID_CONDITION, INVALID_POLICY_LINE, MISSING_TAX_LOCATION, MISSING_PATTERN_CODE,
    MISSING_LINE_COVERAGE, UNMATCHED_DATA_MIGRATION_COST, MULTIPLE_ACCOUNTS, MISSING_RENEWAL_PROCESS,
    INVALID_ADDL_INTEREST_DETAIL, DWELLING_NOT_FOUND, INVALID_EXCLUSION, MISSING_EXCLUSION,
    MISSING_ACTIVITY_PATTERN, INVALID_ACTIVITY_PATTERN, INVALID_MIGRATION_COST_TYPE,
    MISSING_CANCEL_EFFECTIVE_DATE, MISSING_CANCEL_SOURCE, MISSING_CANCELLATION_REASON,
    MISSING_CANCEL_REFUND_METHOD, MISSING_CANCEL_DESCRIPTION, MISSING_PAYLOAD, MISSING_ACCOUNT_CONTACT,
    INVALID_EFFECTIVE_CANCEL_DATE, VEHICLE_NOT_FOUND, DRIVER_NOT_CREATED, INVALID_MVR,
    FORM_NOT_FOUND, INVALID_EXPOSURE, MISSING_UNDERLYING_POLICIES, MISSING_MODEL, MISSING_TRANSACTION_RECORD,
    MISSING_TRANSACTION_ELEMENT, ALREADY_BOUND, ALREADY_RESCINDED, MISSING_JOB_CANCELLATION,
    MISSING_PA_LINE, INVALID_MOD_PATTERN_CODE, EXCLUSION_NOT_FOUND, CONDITION_NOT_FOUND,
    DRIVER_NOT_FOUND, COVERAGE_NOT_FOUND, DUPLICATE_POLICY, ATTEMPTING_TO_CREATE_USER,
    EXISTING_POLICY_FOUND, MISSING_UWCOMPANY, MISSING_EFFECTIVE_DATE, MULTIPLE_MCI_MATCHES,
    UNSUPPORTED_PARENT, UNSUPPORTED_MODEL, ATTEMPTING_TO_CREATE_GROUP, MISSING_ACCOUNT_CONTACT_ROLE,
    MISSING_RATE_FACTOR, INVALID_RATE_FACTOR, UNSUPPORED_REWRITE_TYPE, MISSING_NEW_TRANSACTION, MISSING_STATIC_ENTITY,
    INVALID_REWRITE_TYPE, INVALID_QUOTE, UNPARSEABLE_MODEL, INCORRECT_BRANCH, MISSING_CHILD, INVLAID_MIGRATION_PROCESS_TYPE,
    INVALID_ENVIRONMET_TYPE,MISSING_OR_INVALID_DATA
  }

  private var _code: CODE as Code = GENERAL
  construct(acode: CODE) {
    super()
    this._code = acode
  }

  construct(acode: CODE, messageA: String) {
    super(messageA)
    this._code = acode
  }

  construct(acode: CODE, messageB: String, causeB: Throwable) {
    super(messageB, causeB)
    this._code = acode
  }

  construct(acode: CODE, messages: String[]) {
    super(messages.join(", "))
    this._code = acode
  }
}
