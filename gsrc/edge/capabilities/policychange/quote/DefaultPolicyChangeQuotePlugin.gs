package edge.capabilities.policychange.quote

uses edge.di.annotations.ForAllGwNodes
uses gw.api.util.Logger
uses java.lang.Exception
uses edge.capabilities.policychange.exception.PolicyChangeUnderwritingException
uses edge.security.authorization.Authorizer
uses edge.security.authorization.IAuthorizerProviderPlugin
uses gw.api.util.Math

/**
 * Default implementation of quoting plugin.
 */
class DefaultPolicyChangeQuotePlugin implements IPolicyChangeQuotePlugin {
  /**
   * The PolicyPeriod authorizer used to check access to a policy period.
   */
  var _policyPeriodAuthorizer : Authorizer<PolicyPeriod> as readonly PolicyPeriodAuthorize

  private static final var LOGGER = Logger.forCategory(DefaultPolicyChangeQuotePlugin.Type.QName)
  
  @ForAllGwNodes
  construct(authorizerProvider:IAuthorizerProviderPlugin) {
    _policyPeriodAuthorizer = authorizerProvider.authorizerFor(PolicyPeriod)
  }

  override function quote(policyChange : PolicyChange) {
    doQuote(policyChange)
  }

  /**
   * Performs the quoting process.
   */
  protected function doQuote(policyChange : PolicyChange) {
    quoteSinglePeriod(policyChange.LatestPeriod)

    if (policyChange.LatestPeriod.Status != PolicyPeriodStatus.TC_QUOTED) {
      throw new PolicyChangeUnderwritingException() {
          :Message = "Unable to create any quote offerings"
      }
    }
  }

  /**
   *  Quotes a single policy period.
   */
  protected function quoteSinglePeriod(period : PolicyPeriod) {
    calculateDriverPercentages(period.PersonalAutoLine)
    var policyChangeProcess = period.PolicyChangeProcess
    var jobConditions = policyChangeProcess.canRequestQuote()

    if (jobConditions.Okay) {
      try {
        policyChangeProcess.requestQuote()

      } catch (e : Exception) {
        LOGGER.error("Exception occured while quoting period", e)
        throw new PolicyChangeUnderwritingException(e)
      }
    } else {    
      LOGGER.error("Could not quote for the following reasons : " + jobConditions.Message)
      throw new PolicyChangeUnderwritingException()
    }
  }

  private static function calculateDriverPercentages(paLine: PersonalAutoLine) {
    for (vehicle in paLine.Vehicles) {
      if (!vehicle.Drivers.IsEmpty) {
        var newDrivers = vehicle.Drivers.where( \ d -> d.PercentageDriven == 0)
        var sum = vehicle.Drivers*.PercentageDriven.sum()
        if (sum < 100){
          var excess = 100 - sum
          var redistribution : int
          var remainder : int
          if (newDrivers.length > 0) {
            redistribution = (excess/newDrivers.length) as int
            remainder = excess % newDrivers.length
            newDrivers.eachWithIndex( \ d, index -> {
              d.PercentageDriven =  index < newDrivers.length -1 ? redistribution : redistribution + remainder
            })
          } else if ( sum < 100 ) {
            redistribution = (excess/vehicle.Drivers.length) as int
            remainder = excess % vehicle.Drivers.length
            vehicle.Drivers.eachWithIndex( \ d, index -> {
              d.PercentageDriven += index < vehicle.Drivers.length -1 ? redistribution : redistribution + remainder
            })
          }
        }
      }
    }
  }
}
