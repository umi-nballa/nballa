package gwservices.pc.dm.api

uses gw.api.database.Query
uses gw.pl.persistence.core.Bundle
uses gw.util.Pair
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.entitypopulators.EntityPopulatorUtil
uses gwservices.pc.dm.gx.entitypopulators.MigrationEntityIDDTO
uses gwservices.pc.dm.gx.entitypopulators.Registry
uses gwservices.pc.dm.util.DMLogger
uses org.slf4j.Logger

uses java.util.Date
uses java.util.Map

/**
 * Transaction API base class with conveniences
 */
abstract class DMTransactionAPIBase {
  /// Logging ///
  private static final var _LOG_TAG = "${DMTransactionAPIBase.Type.RelativeName} - "
  protected static final var _logger: Logger = DMLogger.General
  /** Entity populator instance */
  private var _populatorUtil: EntityPopulatorUtil as readonly PopulatorUtil
  construct(registry: Registry) {
    _populatorUtil = new EntityPopulatorUtil(registry)
  }

  /**
   * Process a transaction record
   */
  abstract protected function processRecordInternal(record: MigrationRecord, bundle: Bundle)

  /**
   * Process a record
   * @returns transaction identifier. For example, account or job number
   */
  function processRecord(record: MigrationRecord, bundle: Bundle): MigrationRecord {
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "processRecord enter, record = ${record.DebugString}")
    }
    loadModifiedIds(record)
    processRecordInternal(record, bundle)
    clearModifiedIds(record, bundle)
    storeModifiedIds(record)
    var identifier = record.ApplicationID
    if (_logger.InfoEnabled) {
      _logger.info(_LOG_TAG + "processRecord new identifier ${identifier} for transaction ${typeof(this)}")
    }
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "processRecord exit")
    }
    return record
  }

  /**
   * Retrieve an existing job for update
   */
  protected function getExistingJob(jobPublicId: String, bundle: Bundle): Job {
    var job: Job = null
    if (jobPublicId.HasContent) {
      job = Query.make(Job).compare(Job#PublicID, Equals, jobPublicId).select().AtMostOneRow
    }
    if (job.LatestPeriod.Promoted) {
      throw new DataMigrationNonFatalException(CODE.ALREADY_BOUND, "job ${jobPublicId} is already promoted")
    }
    if (job != null and _logger.InfoEnabled) {
      _logger.info(_LOG_TAG + "getExistingJob using existing job ${jobPublicId}")
      job = bundle.add(job)
    } else {
      _logger.info(_LOG_TAG + "getExistingJob no job found for ${jobPublicId}, will create new")
    }
    return job
  }

  /**
   * Convenience
   */
  protected function prepareTransaction(policyPeriod: entity.PolicyPeriod) {
    switch (policyPeriod.Status) {
      case "New":
          policyPeriod.JobProcess.beginEditing()
          break
      case "Quoting":
          policyPeriod.unlockFromQuoting()
      case "Quoted":
          policyPeriod.edit()
          break
    }
  }

  /**
   * Convenience
   */
  protected function addMigrationInfo(legacyPolicyNumber: String, policy: Policy): MigrationPolicyInfo_Ext {
    var migrationInfo = new MigrationPolicyInfo_Ext()
    policy.MigrationPolicyInfo_Ext = migrationInfo
    migrationInfo.LegacyPolicyNumber = legacyPolicyNumber
    migrationInfo.MigratedPolicy = true
    return migrationInfo
  }

  /**
   * Return the transaction times and update fields on the models
   */
  protected function getTransactionTimes(record: MigrationRecord, existingPeriod: PolicyPeriod): Pair <Date, Date> {
    var policyPeriod = record.PolicyPeriod
    var effectiveTime = record.getEffectiveDateTime(policyPeriod, existingPeriod)
    policyPeriod.EditEffectiveDate = effectiveTime
    var effDate = policyPeriod.EditEffectiveDate
    var expirationTime = record.getExpirationDateTime(effDate, policyPeriod.TermType, existingPeriod)
    // remove this to avoid simple value populator issues
    policyPeriod.TermType = null
    return new Pair <Date, Date>(effectiveTime, expirationTime)
  }

  /**
   * Check to make sure valid quote was produced
   */
  protected function checkValidQuote(policyPeriod: entity.PolicyPeriod) {
    if (not policyPeriod.ValidQuote) {
      throw new DataMigrationNonFatalException(CODE.INVALID_QUOTE)
    }
  }

  /**
   * If the flag is set, store costs back into MCI XML for direct load
   */
  protected function updatePayload(record: MigrationRecord, period: PolicyPeriod) {
    var migrationJobInfo = period.Job.MigrationJobInfo_Ext
    if (migrationJobInfo.UpdatePayload) {
      migrationJobInfo.UpdatePayload = false
      record.UpdatedXML = new gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod(period)
    }
  }

  /**
   * Load prior transaction modified IDs
   */
  private function loadModifiedIds(record: MigrationRecord) {
    if (record.AutoDelete) {
      var tid = record.MigrationEntityTransactionID
      var meis = Query.make(MigrationEntityID_Ext).compare(MigrationEntityID_Ext#TransactionID, Equals, tid).select()
      var result: Map<MigrationEntityIDDTO, List<MigrationEntityIDDTO>> = {}
      for (mei in meis) {
        var parentKey = new MigrationEntityIDDTO(mei.ParentEntityID, mei.ParentEntityType)
        var entityMap = result.get(parentKey)
        if (entityMap == null) {
          entityMap = {}
          result.put(parentKey, entityMap)
        }
        entityMap.add(new MigrationEntityIDDTO(mei.EntityID, mei.EntityType, mei.XMLModelType, mei.PropertyName))
      }
      record.MigrationEntityIDs = result
    } else if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "loadModifiedIds autoDelete disabled")
    }
  }

  /**
   * Clear modified IDS for the current transaction. Keeps table clean of unecessary entities
   */
  private function clearModifiedIds(record: MigrationRecord, bundle: Bundle) {
    var tid = record.MigrationEntityTransactionID
    var meis = Query.make(MigrationEntityID_Ext).compare(MigrationEntityID_Ext#TransactionID, Equals, tid).select()
    meis.each(\mei -> bundle.add(mei).remove())
  }

  /**
   * Store the migration entity public IDs
   */
  private function storeModifiedIds(record: MigrationRecord) {
    record.MigrationEntityIDs.eachKeyAndValue(\parent, entities -> {
      for (entity in entities) {
        if (entity.EntityID != null and record.MigrationEntityTransactionID != null) {
          var mei = new MigrationEntityID_Ext(){
              : TransactionID = record.MigrationEntityTransactionID,
              : ParentEntityID = parent.EntityID,
              : ParentEntityType = parent.EntityType as String,
              : EntityID = entity.EntityID,
              : EntityType = entity.EntityType as String,
              : XMLModelType = entity.XMLModelType as String,
              : PropertyName = entity.PropertyName
          }
        }
      }
    })
  }
}
