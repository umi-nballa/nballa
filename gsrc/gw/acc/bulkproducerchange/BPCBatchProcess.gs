package gw.acc.bulkproducerchange

uses gw.api.database.Query
uses gw.api.util.DateUtil
uses gw.pl.persistence.core.Bundle
uses gw.processes.BatchProcessBase
uses gw.validation.ValidationUtil
uses org.slf4j.LoggerFactory

uses java.lang.Exception
uses java.util.Date

class BPCBatchProcess extends BatchProcessBase {

  private static final var LOGGER  = LoggerFactory.getLogger(BPCBatchProcess)
  private static final var SUPER_USER = ScriptParameters.BulkProducerChangeBatchProcessUser

  construct() {
    super(BatchProcessType.TC_BULKPRODUCERCHANGE_EXT)
  }

  /**
   * Process all BulkProducerChange batches that have a target date earlier than today
   */
  override function doWork() {
    LOGGER.info("-> BPC BulkProducerChange Batch Process - Start")
    var BPCBatchQuery = Query.make(BPCBatch_Ext)
        .compare(BPCBatch_Ext#Completed, Equals, false)
        .compare(BPCBatch_Ext#TargetDate, LessThan , DateUtil.currentDate())
    var batches = BPCBatchQuery.select()
    for (batch in batches) {   
      processBatch(batch)               
    }
    LOGGER.info("-> BPC BulkProducerChange Batch Process - End")
  }

  /**
   * Process one BulkProducerChange batch
   */
  private function processBatch (batch : BPCBatch_Ext) {
    LOGGER.info("-> BPC Batch #" + batch.BatchCode + " start")
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      batch = bundle.add(batch)
      var context = ValidationUtil.createContext(ValidationLevel.TC_DEFAULT)
      var validations = new BPCValidation(context)
      processPolicyRecords(batch.PolicyRecords, bundle, validations)
      processAccountRecords(batch.AccountRecords)
      if (isComplete(batch)) {
        batch.Completed = true
      }
      if (validations.Result.hasWarnings() or validations.Result.hasErrors()){
        LOGGER.error(" -> Errors for BPC Batch #" + batch.BatchCode)
        LOGGER.error(validations.Result.toPrettyString())
      }
    }, SUPER_USER)
    LOGGER.info("-> BPC Batch #" + batch.BatchCode + " end")
  }

  /**
   * Check whether the given batch can be marked as completed; i.e., the status != pending renewal or unprocessed
   */
  private function isComplete(batch : BPCBatch_Ext) : boolean {
    for (record in batch.PolicyRecords) {
      if (record.Status == BPCRecordStatus_Ext.TC_PENDINGRENEWAL or record.Status == BPCRecordStatus_Ext.TC_UNPROCESSED) {
        return false
      }
    }
    for (record in batch.AccountRecords) {
      if (record.Status == BPCRecordStatus_Ext.TC_PENDINGRENEWAL or record.Status == BPCRecordStatus_Ext.TC_UNPROCESSED) {
        return false
      }
    }
    return true
  }

  /**
   * Process Policy batch records at their specific target date or at renewal
   */
  private function processPolicyRecords(records : BPCPolicyRecord_Ext [], bundle : Bundle, validations : BPCValidation) {
    //process only records which weren't manually canceled
    for (record in records.where(\ rec -> rec.Status != BPCRecordStatus_Ext.TC_CANCELED)) {
      var polNum = record.Policy.Periods.first().PolicyNumber
      LOGGER.info("-> BPC Policy # " + polNum)
      if (record.Status == BPCRecordStatus_Ext.TC_UNPROCESSED and record.canProcessPolicy(validations)) {
        //process this transaction
        switch(record.Batch.Type) {
          case BPCType_Ext.TC_DATE:
              processAtSpecificDate(record, record.Batch.TargetDate, bundle, validations)
              processFutureBoundRenewals(record, bundle, validations)
              moveActivities(record, bundle)
              break
          case BPCType_Ext.TC_RENEWAL:
              processAtRenewal(record, bundle)
              break
            default:
            break
        }
        processOpenRenewals(record, bundle, validations)
      } else {
        validations.Result.addError(record.Policy, ValidationLevel.TC_DEFAULT, "pol:" + polNum + ": " + record.Reason + " " + record.Jobtype + " (" + record + ")")
      }
      if (record.Status == BPCRecordStatus_Ext.TC_UNPROCESSED) {
        record.Status = BPCRecordStatus_Ext.TC_FAILED
        record.Message = "Processing Error"
        record.Reason = BPCReason_Ext.TC_PROCESSINGERROR
      }
    }
    var currentDate = DateUtil.currentDate()
    //finish renewal transactions
    var BPCPolicyRecordQuery =  Query.make(BPCPolicyRecord_Ext)
        .compare(BPCPolicyRecord_Ext#Status, Equals, BPCRecordStatus_Ext.TC_PENDINGRENEWAL)
        .compare(BPCPolicyRecord_Ext#ProcessDate, LessThan , currentDate)
    var pendingRenewals = BPCPolicyRecordQuery.select()
    for (record in pendingRenewals) {
      gw.transaction.Transaction.runWithNewBundle(\ b -> {
        bundle = b
        record = bundle.add(record)
        var policyPeriod = Policy.finder.findPolicyPeriodByPolicyAndAsOfDate(record.Policy, currentDate)
        if (policyPeriod != null) {
          policyPeriod = policyPeriod.getSlice(currentDate)
        }
        if (policyPeriod != null and policyPeriod.ProducerCodeOfRecord != record.NewProducerCode) {
          if (policyPeriod.Canceled) {
            record.Status = BPCRecordStatus_Ext.TC_SKIPPED
            record.Reason = BPCReason_Ext.TC_CANCELLED
          } else {
            record.Status = BPCRecordStatus_Ext.TC_SKIPPED
          }
        } else if (record.Policy.NewProducerCode_Ext == null){
          record.Status = BPCRecordStatus_Ext.TC_SKIPPED
        } else {
          completeRenewal(record, b)
          moveActivities(record, b)
        }
      }, SUPER_USER)
    }
  }

  /**
   * Upon renewal completion, update the record status to "Processed"
   */
  private function completeRenewal(record : BPCPolicyRecord_Ext, bundle : Bundle) {
    try {
      record.Policy = bundle.add(record.Policy)
      record.Policy.NewProducerCode_Ext = null
      record.Status = BPCRecordStatus_Ext.TC_PROCESSED
    } catch(ex : Exception) {
      handleException(ex, null, record)
    }
  }

  /**
   * Process Policy batch records upon renewal
   */
  private function processAtRenewal(record : BPCPolicyRecord_Ext, bundle : Bundle) {
    try {
      record.Policy = bundle.add(record.Policy)
      record.Policy.NewProducerCode_Ext = record.NewProducerCode
      var currentPeriod = Policy.finder.findPolicyPeriodByPolicyAndAsOfDate(record.Policy, record.Batch.TargetDate)
      record.Status = BPCRecordStatus_Ext.TC_PENDINGRENEWAL
      record.ProcessDate = currentPeriod.PeriodEnd
    } catch(ex : Exception) {
      handleException(ex, null, record)
    }
  }

  /**
   * Process Account batch records
   */
  private function processAccountRecords(records : BPCAccountRecord_Ext []) {
    //process only records which weren't manually canceled
    for(record in records.where(\ rec -> rec.Status != BPCRecordStatus_Ext.TC_CANCELED)) {
      var accNum = record.Account.AccountNumber
      LOGGER.info("-> BPC Account # " + accNum)
      var oldProdCode = record.OldProducerCode
      var newProdCode = record.NewProducerCode
      var account = record.Account
      if (not account.containsProducerCode(oldProdCode)) {
        record.Status = BPCRecordStatus_Ext.TC_SKIPPED
        record.Reason = BPCReason_Ext.TC_VALIDATIONFAILURE
      } else if (account.calculateDesiredProducerCodes().contains(oldProdCode)) {
        record.Status = BPCRecordStatus_Ext.TC_FAILED
        record.Reason = BPCReason_Ext.TC_VALIDATIONFAILURE
      } else if (account.containsProducerCode(newProdCode)) {
        account.removeProducerCode(oldProdCode)
        record.Status = BPCRecordStatus_Ext.TC_PROCESSED
      } else {
        account.changeProducerCode(oldProdCode, newProdCode)
        record.Status = BPCRecordStatus_Ext.TC_PROCESSED
      }
    }
  }

  /**
   * Start a custom Policy Change Job, where the only thing that changes is the producer code.
   */
  private function processAtSpecificDate(record : BPCPolicyRecord_Ext, effDate : DateTime, bundle : Bundle, validations : BPCValidation) {
    var period : PolicyPeriod = null
    try {
      var context = ValidationUtil.createContext(ValidationLevel.TC_DEFAULT)
      var processValidation = new BPCValidation(context)

      period = createSpecificDatePeriod(record, effDate, bundle, processValidation)
      updateSpecificDatePeriodCode(period, record, processValidation)
      bindSpecificDatePeriod(period, record, processValidation)

      if (processValidation.Result.hasErrors()) {
        validations.Result.addError(record.Policy, ValidationLevel.TC_DEFAULT, record.Reason)
      }
    } catch (ex : Exception) {
      handleException(ex, period, record)
    }
  }

  /**
   * Step 1 create policyperiod and policychangejob
   */
  private function createSpecificDatePeriod(record : BPCPolicyRecord_Ext, effDate : DateTime, bundle : Bundle, validations : BPCValidation) : PolicyPeriod{
    var period : PolicyPeriod = null
    if (record.Policy != null and record.Policy.Bundle.ReadOnly) {
      bundle.add(record.Policy)
    }
    period = BPCProcessCtrl.createPolicyPeriod(validations, record.Policy, effDate)
    validations.Context.raiseExceptionIfErrorsFound()
    LOGGER.info("Period = " + period)
    return period
  }

  /**
   *  Step 2 Do updates producercode and create custom history
   */
  private function updateSpecificDatePeriodCode(period : PolicyPeriod, record : BPCPolicyRecord_Ext, validations : BPCValidation) {
    if (not period.Slice) {
      period = period.getSlice(period.getEditEffectiveDate())
    }
    period = BPCProcessCtrl.updatePolicyPeriod(validations, period, record)
    validations.Context.raiseExceptionIfErrorsFound()
    period.Job.createCustomHistoryEvent(CustomHistoryType.TC_DATACHANGE, \ -> displaykey.Accelerator.BulkProducerChange.SystemProducerCodeChange)
  }

  /**
   * Step 3 Bind
   */
  private function bindSpecificDatePeriod(period : PolicyPeriod, record : BPCPolicyRecord_Ext, validations : BPCValidation) {
    period = BPCProcessCtrl.executeWorkflow(period)
    validations.Context.raiseExceptionIfErrorsFound()
    record.Status = BPCRecordStatus_Ext.TC_PROCESSED
  }

  /**
   * Exception Handler for validation failure
   */
  protected function handleException(ex : Exception, period : PolicyPeriod, record : BPCPolicyRecord_Ext) {
    LOGGER.error("-> BPC ERROR: " + ex.Message, ex)
    if (record.Reason == null) {
      record.Reason = typekey.BPCReason_Ext.TC_VALIDATIONFAILURE
    }
    record.Status = BPCRecordStatus_Ext.TC_FAILED
  }

  /**
   * Update future bound Renewals, using the same custom Policy Change job above.
   */
  private function processFutureBoundRenewals(record : BPCPolicyRecord_Ext, bundle : Bundle, validations : BPCValidation) {
    var newestPeriod = Policy.finder.findMostRecentBoundPeriodByPolicy(record.Policy)
    if (newestPeriod.EditEffectiveDate.after(DateUtil.currentDate()) and newestPeriod.Job.Subtype == typekey.Job.TC_RENEWAL) {
      processAtSpecificDate(record, newestPeriod.EditEffectiveDate, bundle, validations)
    }
  }

  /**
   * Move open activities to a queue associated with the new producer.
   */
  private function moveActivities(record : BPCPolicyRecord_Ext, bundle : Bundle) {
    try {
      var newQueue = BPCUtils.getProducerQueue(record.NewProducerCode)
      if (newQueue != null) {  //In practice this should never happen
        bundle.add(newQueue)
        for (act in record.Policy.AllOpenActivities) {
          if (act.AssignedQueue != null and BPCUtils.isProducer(act.AssignedQueue.Group)) {
            bundle.add(act).assignActivityToQueue(newQueue, newQueue.Group)
          }
        }
      }
    } catch (e : Exception) {
      LOGGER.error("-> Error moving activities for BPC run")
      LOGGER.error(e.StackTraceAsString)
    }
  }

  /**
   * If there is an open renewal, update it with the new producer of record
   */
  private function processOpenRenewals(record : BPCPolicyRecord_Ext, bundle : Bundle, validations : BPCValidation) {
    var openRenewal = record.Policy.OpenRenewalJob
    if (openRenewal != null) {
      var period = openRenewal.LatestPeriod
      try {
        if (not period.Locked) { //not withdrawn
          period = period.getSlice(period.EditEffectiveDate)
          period = bundle.add(period)
          BPCProcessCtrl.updateProducerOfRecord(period, record.NewProducerCode)
          period.Job.createCustomHistoryEvent(CustomHistoryType.TC_DATACHANGE, \ -> displaykey.Accelerator.BulkProducerChange.SystemProducerCodeChange)
        }
      } catch(ex : Exception) {           
        handleException(ex, period, record)
      }        
    } else {
      processFutureBoundRenewals(record, bundle, validations)
    }
  }
}
