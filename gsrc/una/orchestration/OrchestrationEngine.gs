package una.orchestration

uses una.integration.service.gateway.plugin.GatewayPlugin
uses una.logging.UnaLoggerCategory
uses una.integration.service.gateway.tuna.TunaInterface

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 05/10/2016
 * Time: 11:46 AM
 * To change this template use File | Settings | File Templates.
 *
 */
class OrchestrationEngine {
  private var _newIntake: boolean
  private var _TUNAGateway = GatewayPlugin.makeTunaGateway()
  private var _logger = UnaLoggerCategory.UNA_DATAMAPPER

  construct() {
    _newIntake = true
  }


  property get TUNAGateway(): TunaInterface {
    return _TUNAGateway
  }


  function processAPPRequestData(appRequest : AppRequestData) : PolicyPeriod {

    return null
  }


}