package gw.webservice.pc.pc800.job
uses gw.api.webservice.exception.EntityStateException
uses gw.plugin.policy.IPolicyPlugin
uses gw.transaction.Transaction
uses gw.plugin.Plugins
uses gw.webservice.SOAPUtil
uses gw.api.webservice.exception.RequiredFieldException
uses java.lang.Exception
uses gw.api.webservice.exception.BadIdentifierException
uses gw.api.webservice.exception.SOAPException
uses gw.xml.ws.annotation.WsiPermissions
uses gw.util.ILogger
uses una.logging.UnaLoggerCategory

@gw.xml.ws.annotation.WsiWebService( "http://guidewire.com/pc/ws/gw/webservice/pc/pc800/job/ReinstatementAPI" )
@Export
class ReinstatementAPI
{
  protected static final var LOGGER : ILogger = UnaLoggerCategory.UNA_REINSTATEMENT_API
  /**
   * Starts a PolicyCenter reinstatement job for the given policy. A reinstatement is used after
   * a policy has been canceled to put it back into effect. The reinstatement effective date will
   * always be equal to the cancellation date. To create a gap in coverage a rewrite should be
   * used instead.
   * 
   * @param policyNumber The number of the period that should be reinstated. Must not be null.
   * @param reinstateCode Typekey indicating the reason for the reinstatement. Must not be null.
   * @returns The unique job number for the started Reinstatement job.
   */
  @Throws(SOAPException, "If communication errors occur")  
  @Throws(RequiredFieldException, "If required field is missing")
  @Throws(BadIdentifierException, "If cannot find entity with given identifier")
  @Throws(EntityStateException, "If <code>policyNumber</code> cannot be found, or if the policy cannot be reinstated, or if any other error occurs.")
  @Param("policyNumber", "The number of the period that should be reinstated. Must not be null.")
  @Param("reinstateCode", "Typekey indicating the reason for the reinstatement. Must not be null.")
  @WsiPermissions({SystemPermissionType.TC_CREATEREINSTATE})
  @Returns("The unique job number for the started Reinstatement job.")
  function beginReinstatement(policyNumber : String, reinstateCode : ReinstateCode) : String {
    SOAPUtil.require(policyNumber, "policyNumber")
    SOAPUtil.require(reinstateCode, "reinstateCode")
    var cancellationPeriod = findCancellationPeriod(policyNumber)

    return startReinstatement(cancellationPeriod, reinstateCode).JobNumber
  }

  /**
   * Starts a PolicyCenter reinstatement job for the given policy. A reinstatement is used after
   * a policy has been canceled to put it back into effect. The reinstatement effective date will
   * always be equal to the cancellation date. To create a gap in coverage a rewrite should be
   * used instead.
   *
   * @param policyNumber The number of the period that should be reinstated. Must not be null.
   * @param reinstateCode Typekey indicating the reason for the reinstatement. Must not be null.
   * @returns The unique job number for the started Reinstatement job.
   */
  @Throws(SOAPException, "If communication errors occur")
  @Throws(RequiredFieldException, "If required field is missing")
  @Throws(BadIdentifierException, "If cannot find entity with given identifier")
  @Throws(EntityStateException, "If <code>policyNumber</code> cannot be found, or if the policy cannot be reinstated, or if any other error occurs.")
  @Param("policyNumber", "The number of the period that should be reinstated. Must not be null.")
  @Param("reinstateCode", "Typekey indicating the reason for the reinstatement. Must not be null.")
  @WsiPermissions({SystemPermissionType.TC_CREATEREINSTATE})
  @Returns("An error, if one occurred.")
  function reinstatePolicy(policyNumber : String, reinstateCode : ReinstateCode) : String {
    SOAPUtil.require(policyNumber, "policyNumber")
    SOAPUtil.require(reinstateCode, "reinstateCode")
    var result : String
    var cancellationPeriod = findCancellationPeriod(policyNumber)

    try{
      var reinstatement = startReinstatement(cancellationPeriod, reinstateCode)
      quote(reinstatement)

      if(!reinstatement.LatestPeriod.RiskIndicator_Ext){
        issueReinstatement(reinstatement)
      }
    }catch(e : Exception){
      LOGGER.error(e)
      result = "Unable to reinstate policy ${cancellationPeriod.PolicyNumber}"
    }

    return result
  }

  private function findCancellationPeriod(policyNumber : String) : PolicyPeriod{
    var result : PolicyPeriod

    result = Policy.finder.findMostRecentBoundPeriodByPolicyNumber(policyNumber)

    if (result == null) {
      throw new EntityStateException(displaykey.ReinstatementAPI.BeginReinstatement.Error.InvalidPolicyNumber(policyNumber))
    }

    return result
  }

  private function startReinstatement(cancellationPeriod : PolicyPeriod, reinstateCode : ReinstateCode) : Reinstatement{
    var reinstatement : Reinstatement

    Transaction.runWithNewBundle(\bundle -> {
      cancellationPeriod = bundle.add(cancellationPeriod)
      var error = Plugins.get(IPolicyPlugin).canStartReinstatement(cancellationPeriod)
      if (error != null) {
        throw new EntityStateException(displaykey.ReinstatementAPI.BeginReinstatement.Error(cancellationPeriod.PolicyNumber, error))
      }
      try {
        reinstatement = new Reinstatement(bundle)
        reinstatement.ReinstateCode = reinstateCode
        reinstatement.startJob(cancellationPeriod)
      } catch (e : Exception) {
        throw new EntityStateException(e.LocalizedMessage)
      }
    })

    return reinstatement
  }

  private function quote(reinstatement : Reinstatement){
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      reinstatement = bundle.add(reinstatement)
      reinstatement.PolicyPeriod.ReinstatementProcess.requestQuote()
    })
  }

  private function issueReinstatement(reinstatement : Reinstatement){
    gw.transaction.Transaction.runWithNewBundle(\ bundle ->{
      reinstatement = bundle.add(reinstatement)
      if(reinstatement.PolicyPeriod.Status == TC_QUOTED){
        reinstatement.PolicyPeriod.ReinstatementProcess.issueJob(true)
      }
    })
  }
}
