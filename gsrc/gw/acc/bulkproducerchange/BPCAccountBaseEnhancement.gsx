package gw.acc.bulkproducerchange

uses gw.api.util.DisplayableException

uses java.util.HashSet

enhancement BPCAccountBaseEnhancement : Account {

  /**
   * Remove a given producer code from the account level if:
   * (1) the producer code is not in use on any policy periods associated with the acct
   * (2) there is at least one producer code on the account
   *  @param apc the account-level producer code to be removed
   */
  function removeAccountProducerCode_Ext(apc : AccountProducerCode) {
    if (this.ProducerCodes.length <= 1) {
      throw new DisplayableException(displaykey.Accelerator.BulkProducerChange.Error.ProducerCodeRequired(apc.ProducerCode.Code))
    }
    var desiredProducerCodes = this.calculateDesiredProducerCodes()
    if (desiredProducerCodes.contains(apc.ProducerCode)) {
      throw new DisplayableException(displaykey.Accelerator.BulkProducerChange.Error.ProducerCodeLinked(apc.ProducerCode.Code))
    }
    this.removeFromProducerCodes(apc)
  }

  /**
   * Returns a list of producer codes (producers of service only) for each policy period related to the account
   */
  function calculateDesiredProducerCodes() : HashSet<ProducerCode> {
    var desiredProdCodes = new HashSet<ProducerCode>()
    for (policy in this.IssuedPolicies) {
      var pc = policy.ProducerCodeOfService
      if (pc != null) {
        desiredProdCodes.add(pc)
      }
    }
    for (job in this.getAllJobs(false, null, null, null)) {
      var period = job.LatestPeriod
      var pc = period.Policy.ProducerCodeOfService
      if (pc != null) {
        desiredProdCodes.add(pc)
      }
    }
    return desiredProdCodes
  }

  function containsProducerCode(prodCode : ProducerCode) : boolean {
    return this.ProducerCodes.hasMatch(\ pc -> pc.ProducerCode == prodCode)
  }

  function removeProducerCode(prodCode : ProducerCode) {
    var accProdCode = this.ProducerCodes.firstWhere(\ pc -> pc.ProducerCode == prodCode)
    this.removeFromProducerCodes(accProdCode)
  }

  /**
   * Replaces the account level producer code
   * @param oldProdCode the producer code to be removed
   * @param newProdCode the producer code to be added in its place
   */
  function changeProducerCode(oldProdCode : ProducerCode, newProdCode : ProducerCode) {
    this.addProducerCode(newProdCode)
    this.removeProducerCode(oldProdCode)
  }
}
