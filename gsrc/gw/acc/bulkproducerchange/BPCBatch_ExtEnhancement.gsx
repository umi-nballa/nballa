package gw.acc.bulkproducerchange

uses gw.api.database.IQueryBeanResult

uses java.util.ArrayList

enhancement BPCBatch_ExtEnhancement : entity.BPCBatch_Ext{

  /**
   * Get a list of policies from the previous producer code
   */
  function getPolicyListFromOldProducer(oldProducerCode : ProducerCode, oldProducerGroup : Group) : IQueryBeanResult<entity.Policy> {
    switch (this.Source) {
     case BPCSource_Ext.TC_OFFICE :
      return BPCUtils.getPoliciesForCodes(oldProducerGroup.ProducerCodes)
     case BPCSource_Ext.TC_PRODUCERCODE :
       return BPCUtils.getPoliciesForCodes({oldProducerCode})
     default :
       return null
    }
  }

  /**
   * Generate new batch records to be processed (for Policy) from given list
   */
  public function generateBatchRecords(recordPolicies : List<entity.Policy>, newProducerCode : ProducerCode) {
    for (pol in recordPolicies) {
      generateBatchRecordForPolicy(pol, newProducerCode)
    }
  }

  /**
   * Generate new batch records to be processed (for Policy) from query result
   */
  public function generateBatchRecords(recordPolicies : IQueryBeanResult<entity.Policy>, newProducerCode : ProducerCode) {
    for (pol in recordPolicies) {
      generateBatchRecordForPolicy(pol, newProducerCode)
    }
  }

  /**
   * Generate new batch records to be processed (for Policy)
   */
  public function generateBatchRecordForPolicy(policyRecord : Policy, newProducerCode : ProducerCode) {
    var BPCRecord = new BPCPolicyRecord_Ext(this.Bundle)
    BPCRecord.Policy = policyRecord
    BPCRecord.OldProducerCode = policyRecord.ProducerCodeOfService
    BPCRecord.NewProducerCode = newProducerCode
    BPCRecord.ProcessDate = this.TargetDate
    BPCRecord.Batch = this
    BPCRecord.Status = BPCRecordStatus_Ext.TC_UNPROCESSED
    this.addToPolicyRecords(BPCRecord)
  }

  /**
   * Generate new batch records to be processed (for Accounts)
   */
  public function generateBatchRecords(accounts : Account[], newProducerCode : ProducerCode, oldProducerCode : ProducerCode) {
    for (acc in accounts) {   
      var record = new BPCAccountRecord_Ext(this.Bundle)
      record.Account = acc
      record.OldProducerCode = oldProducerCode
      record.NewProducerCode = newProducerCode
      record.ProcessDate = this.TargetDate
      record.Status = BPCRecordStatus_Ext.TC_UNPROCESSED
      this.addToAccountRecords(record)
      record.Batch = this         
    }
  }
  
  /**
   * Generate new batch records to be processed (for All)
   */
  public function generateBatchRecords(newProducerCode : ProducerCode, oldProducerCode : ProducerCode) {
    for (policy in  BPCUtils.getPoliciesForCodes({oldProducerCode})) {
      var record = generatePolicyRecord(policy, newProducerCode, oldProducerCode)
      this.addToPolicyRecords(record)
    }
    for (account in BPCUtils.getAccountsWithCode(oldProducerCode)) {
      var record = generateAccountRecord(account, newProducerCode, oldProducerCode)
      this.addToAccountRecords(record)
    }
  } 
  
  /**
   * Generate new Policy batch records to be processed
   */
  private function generatePolicyRecord(policy : Policy, newProducerCode : ProducerCode, oldProducerCode : ProducerCode) : BPCPolicyRecord_Ext {
    var record = new BPCPolicyRecord_Ext()
    record.Policy = policy
    record.OldProducerCode = oldProducerCode
    record.NewProducerCode = newProducerCode
    record.ProcessDate = this.TargetDate
    record.Batch = this
    record.Status = BPCRecordStatus_Ext.TC_UNPROCESSED
    return record
  }
   
  /**
   * Generate new Account batch records to be processed
   */
  private function generateAccountRecord(account: Account, newProducerCode : ProducerCode, oldProducerCode : ProducerCode) : BPCAccountRecord_Ext {
    var record = new BPCAccountRecord_Ext()
    record.Account = account
    record.OldProducerCode = oldProducerCode
    record.NewProducerCode = newProducerCode
    record.ProcessDate = this.TargetDate
    record.Batch = this
    record.Status = BPCRecordStatus_Ext.TC_UNPROCESSED
    return record
  }
  
  function cancel() {
    for (record in this.PolicyRecords) {
      record.cancel()
    }
    this.Completed = true
  }
  
  function open() {
    this.Completed = false
  }
  
  /**
   * Validation method to ensure the given batch has a valid, associated 'source' to populate the policy list
   * @param oldProducerCode the old producer code
   * @param oldProducerGroup the group/branch associated with the old producer code
   * @param policyList a list of policies to be modified by the given batch
   */
  function checkHasSource(oldProducerCode : ProducerCode , oldProducerGroup : Group , policyList : ArrayList<Policy>) : boolean {
    switch (this.Source) {
      case BPCSource_Ext.TC_OFFICE:
        return oldProducerGroup != null
      case BPCSource_Ext.TC_POLICYLIST:
        return (policyList != null and policyList.Count > 0)
      case BPCSource_Ext.TC_PRODUCERCODE:
        return oldProducerCode != null
      default:
        return false
    }
  }      
}