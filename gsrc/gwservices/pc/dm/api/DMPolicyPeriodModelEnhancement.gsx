package gwservices.pc.dm.api

uses gw.api.database.Query
uses gw.api.productmodel.Product
uses gw.api.productmodel.ProductLookup
uses gw.plugin.Plugins
uses gw.plugin.policy.IPolicyPlugin
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.MigrationRecord
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.types.complex.PolicyPeriod

uses java.util.Map

/**
 * Convenience functions for policy period
 */
enhancement DMPolicyPeriodModelEnhancement: PolicyPeriod {
  /**
   * Retrieve an existing account
   */
  property get AccountEntity(): Account {
    var anAccount = Account.finder.findAccountByAccountNumber(this.Policy.Account.AccountNumber)
    return anAccount
  }

  /**
   * Retrieve an existing policy
   */
  property get PolicyEntity(): Policy {
    return Policy.finder.findPolicyByPolicyNumber(this.PolicyNumber)
  }

  /**
   * Lookup the producer code
   */
  property get ProducerCodeEntity(): ProducerCode {
    var prodQuery = Query.make(ProducerCode).compare(ProducerCode#Code, Equals, this.ProducerCodeOfRecord.Code)
    return prodQuery.select().FirstResult
  }

  /**
   * Grab the product from the product model
   */
  property get ProductFromProductModel(): Product {
    return ProductLookup.getByCode(this.Policy.ProductCode)
  }

  /**
   * Validate some expectations on the model
   */
  function validate(record: MigrationRecord, validationCodes: DataMigrationNonFatalException.CODE[]) {
    var policyNumber = this.PolicyNumber
    var _validations: Map <CODE, block(): String> = {
        MISSING_ACCOUNT -> \-> {
          return this.AccountEntity == null ? "Policy Number ${policyNumber}" : null
        },
        MISSING_PRODUCT -> \-> {
          return this.ProductFromProductModel == null ? "Policy Number ${policyNumber}" : null
        },
        MISSING_PRODUCER -> \-> {
          return this.ProducerCodeEntity == null ? "Policy Number ${policyNumber}" : null
        },
        EXISTING_POLICY_FOUND -> \-> {
          var policy = this.PolicyEntity
          return policy != null and policy.LatestPeriod.Promoted ? "Policy Number ${policyNumber}" : null
        },
        MISSING_POLICY -> \-> {
          return this.PolicyEntity == null ? "Policy Number ${policyNumber}" : null
        },
        MISSING_EFFECTIVE_DATE -> \-> {
          return this.EditEffectiveDate == null ? "Policy Number ${policyNumber}" : null
        },
        INVALID_POLICY_STATE ->\-> {
          return validateProcessState(record)
        }
    }
    for (validationCode in validationCodes) {
      var validation = _validations.get(validationCode)
      if (validation == null) {
        var msg = "unsupported validation ${validationCode}"
        throw new DataMigrationNonFatalException(DataMigrationNonFatalException.CODE.UNSUPPORTED_OPERATION, msg)
      }
      var msg = validation()
      if (msg.HasContent) {
        throw new DataMigrationNonFatalException(validationCode, msg)
      }
    }
  }

  private function validateProcessState(record: MigrationRecord): String {
    var payloadType = record.PayloadType
    var policyPlugin = Plugins.get(IPolicyPlugin)
    var error: String = null
    switch (payloadType) {
      case "PolicyChange":
          return policyPlugin.canStartPolicyChange(this.PolicyEntity, this.EditEffectiveDate)
      case "StandardCancellation":
      case "InProgressCancellation":
          return policyPlugin.canStartCancellation(this.PolicyEntity, this.EditEffectiveDate)
      case "InProgressRenewal":
      case "StandardRenewal":
          if (this.Job.PublicID != null) {
            // if job publicID is set, assume a restart is possible
            return null
          } else {
            return policyPlugin.canStartRenewal(this.PolicyEntity)
          }
      case "FullTermRewrite":
      case "RemainderOfTermRewrite":
      case "NewTermRewrite":
          if (this.Job.PublicID != null) {
            // if job publicID is set, assume a restart is possible
            return null
          } else {
            var termType = this.TermType
            var existingPeriod = this.PolicyEntity.LatestPeriod
            var expirationTime = record.getExpirationDateTime(this.EditEffectiveDate, termType, existingPeriod)
            return policyPlugin.canStartRewrite(this.PolicyEntity, this.EditEffectiveDate, expirationTime)
          }
      case "Reinstatement":
          if (this.Job.PublicID != null) {
            // if job publicID is set, assume a restart is possible
            return null
          } else {
            var canceledPeriod = this.PolicyEntity.LatestPeriod
            return policyPlugin.canStartReinstatement(canceledPeriod)
          }
        //case "Audit":
        //TODO implement
        //return policyPlugin.canStartAudit(this.Policy, this.EffectiveDateTime)
    }
    return null
  }
}
