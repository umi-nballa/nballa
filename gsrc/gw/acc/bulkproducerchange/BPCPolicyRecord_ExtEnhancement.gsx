package gw.acc.bulkproducerchange

enhancement BPCPolicyRecord_ExtEnhancement : entity.BPCPolicyRecord_Ext{

   /**
    * Validate the following conditions for this policy
    *  the policy is in force
    *  the billing method on the policy is still OK for the target producer
    *  no open jobs other than 1 open renewal job
    *  no future bound periods that aren't renewal
    */
  public function canProcessPolicy(validations : BPCValidation) : boolean {
    //make sure the policy is in force
    var record = this
    var policyPeriod = Policy.finder.findPolicyPeriodByPolicyAndAsOfDate(record.Policy, record.Batch.TargetDate)
    if (policyPeriod == null or policyPeriod.Canceled) {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        bundle.add(record)
        if (policyPeriod == null) {
          record.Reason = BPCReason_Ext.TC_EXPIRED
        } else {
          record.Reason = BPCReason_Ext.TC_CANCELLED
        }
        record.Status = BPCRecordStatus_Ext.TC_SKIPPED
      })
      return false
    }

    //open jobs prevent processing (we'll allow 1 open renewal job)    
    var openjobs = record.Policy.OpenJobs
    if (openjobs.Count > 0 and not((openjobs.Count == 1 and openjobs[0].Subtype == typekey.Job.TC_RENEWAL))) {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        bundle.add(record)
        record.Reason = BPCReason_Ext.TC_OPENJOB
        var job = openjobs.firstWhere(\ j -> j.Subtype != typekey.Job.TC_RENEWAL)
        record.Jobtype = job.Subtype
        if (record.Jobtype == null) {
          record.Jobtype = openjobs.first().Subtype
        }
        record.Status = BPCRecordStatus_Ext.TC_FAILED
      })
      return false
    }
    
    //if there are future bound periods that aren't renewal. give error
    var today = gw.api.util.DateUtil.currentDate()
    var futureBoundNonRenewal = record.Policy.BoundPeriods.firstWhere(\ p -> p.EditEffectiveDate>today && p.Job.Subtype != typekey.Job.TC_RENEWAL )
    if (futureBoundNonRenewal != null) {
      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        bundle.add(record)
        record.Reason = BPCReason_Ext.TC_FUTUREBOUNDJOB
        record.Jobtype = futureBoundNonRenewal.Job.Subtype
        record.Status = BPCRecordStatus_Ext.TC_FAILED
      })
      return false
    }
   return true
  } 
}