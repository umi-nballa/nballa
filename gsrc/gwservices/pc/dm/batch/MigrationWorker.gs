package gwservices.pc.dm.batch

uses com.gwservices.pc.dm.data.access.SequenceRange
uses com.gwservices.pc.dm.exception.DAException
uses com.gwservices.pc.dm.util.PropertyHelper
uses gw.api.database.Query
uses gw.processes.WorkQueueBase
uses gw.transaction.Transaction
uses gwservices.pc.dm.util.DMLogger
uses gwservices.pc.dm.util.MigrationUtil

uses java.lang.System
uses java.util.Collections
uses java.util.Iterator
uses java.util.Map

/**
 * Distributed worker for migration
 */
abstract class MigrationWorker extends WorkQueueBase<MigrationWorkConfig_Ext, StandardWorkItem> {
  /// Logging ///
  private static final var _LOG_TAG = "${MigrationWorker.Type.RelativeName} - "
  private static final var _logger = DMLogger.General
  /// Data access configuration ///
  private static final var _CONFIG_FILE = "migration"
  private static final var _CONFIG_FILE_ACCTS = "migration_accts"
  private static final var _ENV_PROPERTY = "gw.pc.env"
  private static final var _SEQUENCES_DEFAULT = 5
  private static final var _SEQUENCES_PARAM = "SEQUENCES_PER_WORKITEM"
  /** Configuration helper */
  private var _propertyHelper: PropertyHelper
  construct(batchType: BatchProcessType) {
    super(batchType, StandardWorkItem, MigrationWorkConfig_Ext)
    if(batchType.Code == BatchProcessType.TC_DATAMIGRATIONPA_EXT)
    _propertyHelper = new PropertyHelper(_CONFIG_FILE, System.getProperty(_ENV_PROPERTY))
    if(batchType.Code == BatchProcessType.TC_DATAMIGRATIONPAACCT_EXT)
      _propertyHelper = new PropertyHelper(_CONFIG_FILE_ACCTS, System.getProperty(_ENV_PROPERTY))

  }

  /**
   * Configure line specific items
   */
  abstract function lineConfigure(helper: PropertyHelper)

  override function findTargets(): Iterator <MigrationWorkConfig_Ext> {
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "findTargets enter")
    }
    lineConfigure(_propertyHelper)
    var sequenceTotal = MigrationUtil.getIntParam(_propertyHelper, _SEQUENCES_PARAM, _SEQUENCES_DEFAULT)
    var inboundPlugin = MigrationUtil.loadDataAccessInbound(_propertyHelper)
    var sequenceRange: SequenceRange
    try {
      sequenceRange = inboundPlugin.SequenceRange
    } finally {
      inboundPlugin.closeConnection()
    }
    // no work items
    if (sequenceRange == null) {
      if (_logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "findTargets no sequences to process")
      }
      return Collections.emptyIterator()
    }
    if (_logger.InfoEnabled) {
      _logger.info(_LOG_TAG + "findTargets create items for range ${sequenceRange.Start} to ${sequenceRange.End}")
    }
    // return iterator. this has to handle multiple sub-sequence ranges
    return new Iterator<MigrationWorkConfig_Ext> () {
      private var _subSequences = sequenceRange.Subsequences.copy()
      private var _currentSubSequence: SequenceRange
      private var _workerCount: long
      private var _nextWorker: long
      private var _nextMin: long
      override function hasNext(): boolean {
        return Next or (hasMoreSubsequence() and Next)
      }

      override function next(): MigrationWorkConfig_Ext {
        var min = Min
        var max = Max
        if (_logger.InfoEnabled) {
          _logger.info(_LOG_TAG + "findTargets creating work item for range ${min} to ${max}")
        }
        _nextWorker++
        return createWorkItem(min, max)
      }

      override function remove() {
        throw new DAException("unimplemented")
      }

      private property get Next(): boolean {
        return _currentSubSequence != null and _nextWorker <= _workerCount and Min <= _currentSubSequence.End
      }

      private function hasMoreSubsequence(): boolean {
        if (_subSequences.Empty) {
          _currentSubSequence = null
          return false
        } else {
          _currentSubSequence = _subSequences.remove(0)
          _workerCount = _currentSubSequence.Range / sequenceTotal
          _nextWorker = 0
          _nextMin = 0
          return true
        }
      }

      private property get Min(): long {
        return _nextWorker * sequenceTotal + _currentSubSequence.Start
      }

      private property get Max(): long {
        return Min + sequenceTotal - 1
      }
    }
  }

  override function processWorkItem(workItem: StandardWorkItem) {
    var dmWorkItem = extractTarget(workItem)
    var parameters = dmWorkItem.Parameters
    var min = dmWorkItem.Parameters.singleWhere(\p -> p.PropName == MigrationUtil.SEQUENCE_MIN_PARAM)
    var max = dmWorkItem.Parameters.singleWhere(\p -> p.PropName == MigrationUtil.SEQUENCE_MAX_PARAM)
    if (findWorkItemOverlap(min.PropValue as long, max.PropValue as long, dmWorkItem)) {
      _logger.warn(_LOG_TAG + "createWorkItem overlap between min ${min.PropValue} and max ${max.PropValue}")
    } else {
      var params: Map <String, String> = {}
      dmWorkItem.Parameters.each(\param -> params.put(param.PropName, param.PropValue))
      if (_logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "parameters ${params}")
      }
      var migrationProcess = new DatabaseMigrationProcess(params)
      migrationProcess.executeMigration()
      Transaction.runWithNewBundle(\bundle -> {
        dmWorkItem = bundle.add(dmWorkItem)
        dmWorkItem.Attempted = migrationProcess.Attempted
        dmWorkItem.Successful = migrationProcess.Successful
      }, User.util.UnrestrictedUser)
    }
  }

  /**
   * Find properties with a particular prefix, remove prefix, and
   * set as base property
   * @param prefix
   * @param helper
   */
  protected function setPrefixedProperties(prefix: String, helper: PropertyHelper) {
    var updates: Map <String, String> = {}
    for (key in helper.AllProperties.Keys) {
      var strKey = key as String
      if (strKey.startsWith(prefix)) {
        var value = helper.getProperty(strKey)
        updates.put(strKey.replace(prefix, ""), value)
      }
    }
    for (key in updates.Keys) {
      if (_logger.InfoEnabled) _logger.info("${_LOG_TAG} override property [${key}] with [${updates[key]}]")
      helper.setProperty(key, updates[key])
    }
  }

  /**
   * Create a distributed workflow
   */
  private function createWorkItem(sequenceMin: long, sequenceMax: long): MigrationWorkConfig_Ext {
    if (_logger.DebugEnabled) {
      _logger.debug(_LOG_TAG + "createWorkItem enter")
    }
    var migrationConfig: MigrationWorkConfig_Ext
    Transaction.runWithNewBundle(\bundle -> {
      migrationConfig = new MigrationWorkConfig_Ext() {: SequenceMin = sequenceMin, : SequenceMax = sequenceMax }
      _propertyHelper.AllProperties.entrySet().each(\pr -> {
        var key = pr.Key as String
        var val = pr.Value as String
        if (key.HasContent and val.HasContent) {
          setParameterVal(migrationConfig, key, val)
        }
      })
      // override sequence minimum and maximum
      setParameterVal(migrationConfig, MigrationUtil.SEQUENCE_MIN_PARAM, sequenceMin as String)
      setParameterVal(migrationConfig, MigrationUtil.SEQUENCE_MAX_PARAM, sequenceMax as String)
      if (_logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "createWorkItem exit")
      }
    }, User.util.UnrestrictedUser)
    return migrationConfig
  }

  /**
   * Convenience
   */
  private function setParameterVal(migrationConfig: MigrationWorkConfig_Ext, propName: String, val: String) {
    var param = migrationConfig.Parameters.firstWhere(\param -> param.PropName == propName)
    if (param == null) {
      param = new MigrationWorkConfigParameter_Ext() {
          : PropName = propName, : PropValue = val, : MigrationWorkConfig = migrationConfig
      }
      migrationConfig.addToParameters(param)
    }
    param.PropValue = val
  }

  /**
   * Find existing open work item to void duplicate processing
   * @param wi current work item
   */
  private function findWorkItemOverlap(min: long, max: long, wi: MigrationWorkConfig_Ext): boolean {
    var wfQuery = Query.make(MigrationWorkConfig_Ext).compare(MigrationWorkConfig_Ext#PublicID, NotEquals, wi.PublicID)
    wfQuery.or(\orOp -> {
      orOp.between(MigrationWorkConfig_Ext#SequenceMin, min, max)
      orOp.between(MigrationWorkConfig_Ext#SequenceMax, min, max)
    })
    var wiQuery = Query.make(StandardWorkItem).compare(StandardWorkItem#Status, NotEquals, WorkItemStatusType.TC_FAILED)
    wfQuery.subselect(MigrationWorkConfig_Ext#ID, CompareIn, wiQuery, StandardWorkItem#Target)
    return wfQuery.select().HasElements
  }
}