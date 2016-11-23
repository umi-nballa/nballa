package gw.acc.bulkproducerchange

uses gw.api.database.Query
uses gw.api.system.database.SequenceUtil
uses gw.api.util.DateUtil
uses gw.api.util.DisplayableException
uses org.apache.commons.lang.StringUtils

uses java.lang.Integer
uses java.util.ArrayList
uses java.util.Date

/**
 * Helper class for Bulk Producer Code Change
 */
class BPCAdminHelper {

  private static final var COMMA_SEPARATOR = ","
  private static final var BATCH = "Batch"
  private var _accountNumbers : String as AccountNumbers
  private var _producerCodeToAdd : ProducerCode as ProducerCodeToAdd
  private var _policyRecords : BPCPolicyRecord_Ext[]
  private var _accountRecords : BPCAccountRecord_Ext[]
  private var _batch : BPCBatch_Ext as Batch

  public var batchNum : java.lang.Integer
  public var batchDate : DateTime

  /**
   *  Return Accounts Records for the Bulk Produce Change Batch Job
   */
  property get AccountRecords() : BPCAccountRecord_Ext[] {
    if (_batch != null) {
      return _batch.AccountRecords
    }
    return _accountRecords
  }
  
  /**
   *  Return Policy Records for the Bulk Produce Change Batch Job
   */
  property get PolicyRecords() : BPCPolicyRecord_Ext[] {
    if (_batch != null) {
      return _batch.PolicyRecords
    }
    return _policyRecords
  }

  /**
   * Search for batch records based on helper data
   * If no batch number is specified, return all records
   */
  final function searchBPCRecords(targets : BPCTargets_Ext) {
    _policyRecords = null
    _accountRecords = null
    _batch = null
    if (batchNum != null) {
      _batch = Query.make(BPCBatch_Ext).compare(BPCBatch_Ext#BatchCode, Equals, batchNum).compare(BPCBatch_Ext#Targets, Equals, targets).select().FirstResult
      _batch = gw.transaction.Transaction.getCurrent().add(_batch)
    } else if (batchDate != null) {
      var min = batchDate.trimToMidnight()
      var max = batchDate.trimToMidnight().addDays(1)
      var policyRecordQuery = Query.make(BPCPolicyRecord_Ext)
          .compare(BPCPolicyRecord_Ext#CreateTime, GreaterThan, min)
          .compare(BPCPolicyRecord_Ext#CreateTime, LessThan, max)
      policyRecordQuery.join(BATCH).compare(BPCBatch_Ext#Targets, Equals, targets)
      _policyRecords = policyRecordQuery.select().toTypedArray()
      var accountRecordQuery = Query.make(BPCAccountRecord_Ext)
          .compare(BPCAccountRecord_Ext#CreateTime, GreaterThan, min)
          .compare(BPCAccountRecord_Ext#CreateTime, LessThan, max)
      accountRecordQuery.join(BATCH).compare(BPCBatch_Ext#Targets, Equals, targets)
      _accountRecords = accountRecordQuery.select().toTypedArray()
    } else {
      var policyRecordQuery = Query.make(BPCPolicyRecord_Ext)
      policyRecordQuery.join(BATCH).compare(BPCBatch_Ext#Targets, Equals, targets)
      _policyRecords = policyRecordQuery.select().toTypedArray()
      var accountRecordQuery = Query.make(BPCAccountRecord_Ext)
      accountRecordQuery.join(BATCH).compare(BPCBatch_Ext#Targets, Equals, targets)
      _accountRecords = accountRecordQuery.select().toTypedArray()
    }
  }

  function reset() {
    batchNum = null
    batchDate = null
    _policyRecords = null
    _accountRecords = null
    AccountNumbers = null
    ProducerCodeToAdd = null
  }

  function cancelBatch() {
    _batch.cancel()
  }

  function reOpenBatch() {
    _batch.open()
  }

  function cancelRecord(record : BPCRecord_Ext) {
    record.cancel()
  }

  function uncancelRecord(record : BPCRecord_Ext) {
    record.uncancel()
  }

  /**
   * Validate creation of new accounts-only BPC batch
   * @param oldProducerCode the old producer code
   * @param newProducerCode the new producer code
   * @param theBatch the batch entity to be created
   * @param accountList a list of accounts to be modified
   */
  function beforeCommit(oldProducerCode : ProducerCode , newProducerCode : ProducerCode , theBatch : BPCBatch_Ext , accountList : ArrayList<Account>, invalidAccountList : ArrayList<String>) {
    if (invalidAccountList.size() > 0) {
      throw new DisplayableException(displaykey.Accelerator.BulkProducerChange.Error.InvalidAccounts(invalidAccountList.join(", ")))
    }

    if (oldProducerCode == newProducerCode) {
      throw new DisplayableException(displaykey.Accelerator.BulkProducerChange.Error.ConflictingProducerCodes)
    }
    theBatch.BatchCode = SequenceUtil.next(1, BPCBatch_Ext as java.lang.String) as Integer
    if(theBatch.TargetDate == null) {
      theBatch.TargetDate = DateUtil.currentDate().addDays(1)
    }
    theBatch.TargetDate = theBatch.TargetDate.trimToMidnight().addMinutes(1)
    if(accountList.Empty) {
      throw new DisplayableException(displaykey.Accelerator.BulkProducerChange.Error.NoAccountsExist)
    }
    theBatch.Targets = BPCTargets_Ext.TC_ACCOUNTS
    theBatch.generateBatchRecords(accountList as entity.Account[], newProducerCode, oldProducerCode)
    theBatch.Bundle.commit()
    batchNum = theBatch.BatchCode
    batchDate = null
    searchBPCRecords(BPCTargets_Ext.TC_ACCOUNTS)
  }
  
  /**
   * Validate creation of policies-only BPC batch
   * @param oldProducerCode the old producer code
   * @param oldProducerGroup the group/branch associated with the old producer code
   * @param newProducerCode the new producer code
   * @param theBatch the batch entity to be created
   * @param policyList a list of policies to be modified
   */
  function beforeCommit(oldProducerCode : ProducerCode , oldProducerGroup : Group , newProducerCode : ProducerCode , theBatch : BPCBatch_Ext , policyList : List<Policy>, oldProducerPolicies : ArrayList<BPCOldProducerPolicy>, invalidPoliciesList : ArrayList<String>) {
    if (invalidPoliciesList.size() > 0) {
      throw new DisplayableException(displaykey.Accelerator.BulkProducerChange.Error.InvalidPolicies(invalidPoliciesList.join(", ")))
    }

    theBatch.BatchCode = SequenceUtil.next(1, BPCBatch_Ext as java.lang.String) as Integer
    if (theBatch.TargetDate == null || theBatch.Type == BPCType_Ext.TC_RENEWAL) {
      theBatch.TargetDate = DateUtil.currentDate().addDays(1)
    }
    theBatch.TargetDate = theBatch.TargetDate.trimToMidnight().addMinutes(1)
    theBatch.Targets = BPCTargets_Ext.TC_POLICIES
    if (theBatch.Source == BPCSource_Ext.TC_OFFICE) {
      var result = theBatch.getPolicyListFromOldProducer(oldProducerCode, oldProducerGroup)
      if (result != null) {
        theBatch.generateBatchRecords(result, newProducerCode)

      } else {
        throw new DisplayableException(displaykey.Accelerator.BulkProducerChange.Error.NoPoliciesExist)
      }
    } else if (theBatch.Source == BPCSource_Ext.TC_PRODUCERCODE) {
      var result = new ArrayList<Policy>()
      for(p in oldProducerPolicies) {
        if (p.Checked) {
          result.add(p.Policy)
        }
      }

      theBatch.generateBatchRecords(result, newProducerCode)
    } else {
      theBatch.generateBatchRecords(policyList, newProducerCode)
    }

    theBatch.Bundle.commit()
    batchNum = theBatch.BatchCode
    batchDate = null
    searchBPCRecords(BPCTargets_Ext.TC_POLICIES)
  }

  /**
   * Validate creation of an accounts+policies BPC batch
   * @param oldProducerCode the old producer code
   * @param newProducerCode the new producer code
   * @param theBatch the batch entity to be created
   */
  function beforeCommit(oldProducerCode : ProducerCode, newProducerCode : ProducerCode, theBatch : BPCBatch_Ext) { 
    if (oldProducerCode == newProducerCode) {
      throw new DisplayableException(displaykey.Accelerator.BulkProducerChange.Error.ConflictingProducerCodes)
    }
    theBatch.BatchCode = SequenceUtil.next(1, BPCBatch_Ext as java.lang.String) as java.lang.Integer
    if(theBatch.TargetDate == null) {
      theBatch.TargetDate = DateUtil.currentDate().addDays(1)
    }
    theBatch.TargetDate = theBatch.TargetDate.trimToMidnight().addMinutes(1)
    theBatch.Targets = BPCTargets_Ext.TC_ALL
    theBatch.generateBatchRecords(newProducerCode, oldProducerCode)
    theBatch.Bundle.commit()
    batchNum = theBatch.BatchCode
    batchDate = null  
    searchBPCRecords(BPCTargets_Ext.TC_ALL) 
  }

  /**
   * Find all accounts that are in the parsed list
   * @param accountNumberList the account numbers to to find
   * @param accountList the valid Account entities found
   * @param invalidAccountList the invalid Account entities found
   */
  function getInputAccounts(accountNumberList : String, validAccountList : ArrayList<Account>, invalidAccountList : ArrayList<String>) {
    validAccountList.clear()
    invalidAccountList.clear()

    var inputAccountStrings = StringUtils.splitByWholeSeparator(accountNumberList, COMMA_SEPARATOR)
    for (s in inputAccountStrings) {
      var theAcct = Query.make(Account).compare(Account#AccountNumber, Equals, s.trim()).select().getAtMostOneRow()
      if(theAcct != null) {
        validAccountList.add(theAcct)
      } else {
        invalidAccountList.add(s)
      }

    }
  }

  /**
   * Find all policies that are in the parsed list
   * @param policyNumberList the policy numbers to to find
   * @param policyList the valid Policy entities found
   * @param invalidPolicyList the invalid Policy entities found
   */
  function getInputPolicies(policyNumberList : String, policyList : ArrayList<Policy>, invalidPolicyList : ArrayList<String>) {
    policyList.clear()
    invalidPolicyList.clear()

    var inputPolicyStrings = StringUtils.splitByWholeSeparator(policyNumberList, COMMA_SEPARATOR)
    for (s in inputPolicyStrings) {
      var thePolicy = Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, s.trim()).select().getAtMostOneRow()

      if (thePolicy.Policy != null) {
        policyList.add(thePolicy.Policy)
      } else {
        invalidPolicyList.add(s)
      }
    }
  }

  /**
   * Validate a user-entered list of policies to be affected by a policies-only BPC batch
   * @param pols the list of policies to be checked
   * @param theBatch the batch entity to be created
   */
  function validatePolicyList(pols : Policy[] , theBatch : BPCBatch_Ext) : String {
    var lastWrittenPeriod : PolicyPeriod
    var firstOrg = pols.first().Periods.orderBy(\ p -> p.WrittenDate).last().ProducerCodeOfRecord.Organization
    for (pol in pols) {
      lastWrittenPeriod = pol.Periods.orderBy(\ p -> p.WrittenDate).last()
      if (lastWrittenPeriod.ProducerCodeOfRecord.Organization != firstOrg and theBatch.Type == BPCType_Ext.TC_DATE) {      
        return displaykey.Accelerator.BulkProducerChange.Error.PolicyListOrg(lastWrittenPeriod.PolicyNumber, lastWrittenPeriod.ProducerCodeOfRecord.Organization, firstOrg)
      }
    }
    return null
  }

  /**
   * This function is used to query database to find all policies associated to the old producer code.
   */
  function getOldProducerPolicies(oldProducerCode : ProducerCode) : ArrayList<BPCOldProducerPolicy> {
    var queryObj = Query.make(Policy).compare(Policy#ProducerCodeOfService, Equals, oldProducerCode)
    var policies = queryObj.select()

    var oldProducerPolicies = new ArrayList<BPCOldProducerPolicy>()

    for(p in policies) {
      var newPolicy = new BPCOldProducerPolicy();
      newPolicy.Policy = p
      newPolicy.Checked = true

      oldProducerPolicies.add(newPolicy)
    }

    return oldProducerPolicies
  }

  function displayAccounts(accounts : Account[]) : String {
    return accounts.join(",")
  }

  function displayPolicies(policyArray : Policy[]) : String {
    return policyArray.join(",")
  }
}