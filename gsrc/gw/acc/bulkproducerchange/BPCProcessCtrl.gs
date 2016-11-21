package gw.acc.bulkproducerchange

class BPCProcessCtrl {

  /**
   * Create a new policy period and a Policy Job tagged as "Producer Change"
   */
  public static function createPolicyPeriod(validations : BPCValidation, policy : Policy, effDate : DateTime) : PolicyPeriod {  
    if (policy == null) {
      validations.Result.addError(policy, ValidationLevel.TC_DEFAULT, "Policy with ID " + policy.PublicID + " not found")
      return null
    }
    var error = policy.canStartPolicyChange(effDate)
    if (error != null) {
      validations.Result.addError(policy, ValidationLevel.TC_DEFAULT, error)
      return null
    }
    var policyChangeJob = new PolicyChange()
    policyChangeJob.ProducerChangeSource_Ext = typekey.ProducerChangeSource_Ext.TC_PRODUCERCHANGE
    policyChangeJob.Description = policyChangeJob.ProducerChangeSource_Ext.DisplayName
    policyChangeJob.startJob(policy, effDate)

    if (policyChangeJob.Periods.length == 1) {
      var period = policyChangeJob.Periods[0]
      var ppcontext = period.validatePeriod(ValidationLevel.TC_DEFAULT)
      if (ppcontext.Result.Errors.Count > 0) {
        validations.Result.addError(period, ValidationLevel.TC_DEFAULT, "Failed default PolicyPeriod validation")
      }
      return period
    } else {
      validations.Result.addError(policy, ValidationLevel.TC_DEFAULT, "Error creating changed policy period")
      return null
    }
  }
  
  /**
   * Update Policy Periods with the new Producer Code
   */
  public static function updatePolicyPeriod(validations : BPCValidation, period : PolicyPeriod, record : BPCPolicyRecord_Ext) : PolicyPeriod {
    if (period.Job.Complete) {
      validations.Result.addError(period, ValidationLevel.TC_DEFAULT, "Cannot process PolicyPeriod. Job is already complete!")
      return period  
    }
    if (period.MinimumPremiumAmount == null) {
      period.MinimumPremiumAmount = 0
    }
    //Update ProducerCodes
    if (record.Batch.Type == BPCType_Ext.TC_RENEWAL) {
      updateProducerOfRecord(period, record.NewProducerCode)
    } else {
      updateProducerOfService(period, record.NewProducerCode)
    }
    var valCtx = period.validatePeriod(ValidationLevel.TC_QUOTABLE)
    validations.Result.add(valCtx.Result)
    return period 
  }
  
  /**
   * Update Policy Job after updating Producer Code on the period
   */
  public static function updateJob(validations : BPCValidation, period : PolicyPeriod) : PolicyPeriod {  
    var job = period.Job
    if (job == null or not (job typeis PolicyChange)) {
      validations.Result.addError( period, ValidationLevel.TC_DEFAULT, "BPC missing PolicyChange job data")
      return null      
    }         
    if (period.PolicyChange.Complete) {
      validations.Result.addError(period, ValidationLevel.TC_DEFAULT, "PolicyChange already complete!")
      return period
    }
    var cJob = job as PolicyChange
    period.PolicyChange.Description = cJob.Description
    job.remove()
    return period 
  }
  
  /**
   * Bind the updated policy with the new Producer Code
   */
  public static function executeWorkflow(period : PolicyPeriod) : PolicyPeriod {
    period.markValidQuote()
    period.PolicyChangeProcess.bind()  
    return period
  }
  
  /**
   * Update the producer of record for a given policy period
   * This will cause the producer(s) of service to be updated
   * @param period the policy period to be updated
   * @param newPC the new producer code to be populated on the period
   */
  public static function updateProducerOfRecord(period : PolicyPeriod, newPC : ProducerCode) {
    period.ProducerCodeOfRecord = newPC
    period.EffectiveDatedFields.ProducerCode = newPC
  }
  
  /**
   * Update only the producer of service for a given policy period
   * The producer of record will not be modified
   * @param period the policy period to be updated
   * @param newPC the new producer code to be populated on the period
   */
  public static function updateProducerOfService(period : PolicyPeriod, newPC : ProducerCode) {
    period.EffectiveDatedFields.ProducerCode = newPC
  }
}
