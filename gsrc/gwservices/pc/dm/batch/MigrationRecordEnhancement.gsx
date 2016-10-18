package gwservices.pc.dm.batch

uses gw.api.util.DateUtil
uses gw.plugin.Plugins
uses gw.plugin.policyperiod.IEffectiveTimePlugin
uses gw.plugin.policyperiod.IPolicyTermPlugin
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.PolicyPeriod

uses java.lang.RuntimeException
uses java.lang.StringBuilder
uses java.util.Date

/**
 * Transaction record enhancements
 */
enhancement MigrationRecordEnhancement: gwservices.pc.dm.batch.MigrationRecord {
  /**
   * Print debugging statement for the record
   */
  property get DebugString(): String {
    var result = new StringBuilder()
    result.append("\nAccount = ${this.Account}")
    result.append("\nApplicationID = ${this.ApplicationID}")
    result.append("\nAutoDelete = ${this.AutoDelete}")
    result.append("\nID = ${this.ID}")
    //result.append("\nMigrationRecordEntities = ${this.MigrationEntityIDs.Count}")
    result.append("\nMigrationEntityTransactionID = ${this.MigrationEntityTransactionID}")
    result.append("\nPayloadType = ${this.PayloadType}")
    result.append("\nPolicyPeriod = ${this.PolicyPeriod}")
    result.append("\nSequenceNumber = ${this.SequenceNumber}")
    result.append("\nUpdatedXML = ${this.UpdatedXML}")
    return result.toString()
  }

  /**
   * Lookup effective time from plug-ins
   */
  function getEffectiveDateTime(model: PolicyPeriod, existingPeriod: entity.PolicyPeriod): Date {
    var effectiveTimePlugin = Plugins.get(IEffectiveTimePlugin)
    var effectiveDate = model.EditEffectiveDate
    var effectiveTime: Date
    switch (this.PayloadType) {
      case "Submission":
          effectiveTime = effectiveTimePlugin.getSubmissionEffectiveTime(effectiveDate, null, null)
          break
      case "PolicyChange":
          effectiveTime = effectiveTimePlugin.getPolicyChangeEffectiveTime(effectiveDate, null, null)
          break
      case "StandardCancellation":
      case "InProgressCancellation":
      case "RescindCancellation":
          var job = new Cancellation()
          job.CancelReasonCode = model.Job.entity_Cancellation.CancelReasonCode
          var method = model.RefundCalcMethod
          effectiveTime = effectiveTimePlugin.getCancellationEffectiveTime(effectiveDate, existingPeriod, job, method)
          job.remove()
          break
      case "ConversionOnRenewal":
      case "NewPolicyRenewal":
          effectiveTime = effectiveTimePlugin.getConversionRenewalEffectiveTime(effectiveDate, null)
          break
      case "StandardRenewal":
      case "InProgressRenewal":
          effectiveTime = effectiveTimePlugin.getRenewalEffectiveTime(effectiveDate, existingPeriod, null)
          break
      case "FullTermRewrite":
          effectiveDate = existingPeriod.PeriodStart
          effectiveTime = effectiveTimePlugin.getRenewalEffectiveTime(effectiveTime, existingPeriod, null)
          break
      case "NewTermRewrite":
          effectiveTime = effectiveTimePlugin.getRenewalEffectiveTime(effectiveTime, existingPeriod, null)
          break
      case "RemainderOfTermRewrite":
          effectiveDate = existingPeriod.CancellationDate
          effectiveTime = effectiveTimePlugin.getRenewalEffectiveTime(effectiveTime, existingPeriod, null)
          break
        default:
        throw new RuntimeException("effective date time not implemented for ${this.PayloadType}")
    }
    return DateUtil.mergeDateAndTime(effectiveDate, effectiveTime)
  }

  /**
   * Lookup expiration time from plug-ins
   */
  function getExpirationDateTime(effectiveDate: Date, termType: TermType, existing: entity.PolicyPeriod): Date {
    var policyTermPlugin = Plugins.get(IPolicyTermPlugin)
    var effectiveTimePlugin = Plugins.get(IEffectiveTimePlugin)
    var expirationDate = policyTermPlugin.calculatePeriodEnd(effectiveDate, termType, existing)
    var expirationTime: Date
    switch (this.PayloadType) {
      case "Submission":
          expirationTime = effectiveTimePlugin.getSubmissionExpirationTime(effectiveDate, expirationDate, null, null)
          break
      case "PolicyChange":
      case "StandardCancellation":
      case "InProgressCancellation":
      case "RescindCancellation":
          expirationTime = null
          break
      case "ConversionOnRenewal":
      case "NewPolicyRenewal":
          expirationTime = effectiveTimePlugin.getConversionRenewalExpirationTime(effectiveDate, expirationDate, null)
          break
      case "StandardRenewal":
      case "InProgressRenewal":
          expirationTime = effectiveTimePlugin.getRenewalExpirationTime(effectiveDate, expirationDate, null, null)
          break
      case "FullTermRewrite":
      case "RemainderOfTermRewrite":
      case "NewTermRewrite":
          if (this.PayloadType == "FullTermRewrite" or this.PayloadType == "RemainderOfTermRewrite") {
            // these will both end with the existing term
            expirationDate = existing.PeriodEnd
          }
          var job = new Rewrite()
          job.RewriteType = RewriteType
          expirationTime = effectiveTimePlugin.getRewriteExpirationTime(null, expirationDate, existing, job)
          job.remove()
          break;
        default:
        throw new RuntimeException("expiration date time not implemented for ${this.PayloadType}")
    }
    return DateUtil.mergeDateAndTime(expirationDate, expirationTime)
  }

  /**
   * Translate the rewrite type
   */
  property get RewriteType(): RewriteType {
    switch (this.PayloadType) {
      case "NewTermRewrite": return "RewriteNewTerm"
      case "RemainderOfTermRewrite": return "RewriteRemainderOfTerm"
      case "FullTermRewrite": return "RewriteFullTerm"
        default:
        var msg = "no corresponding RewriteType for ${this.PayloadType}"
        throw new DataMigrationNonFatalException(CODE.UNSUPPORED_REWRITE_TYPE, msg)
    }
  }
}
