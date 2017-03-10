package onbase.plugin.messagebroker

uses gw.api.integration.inbound.CustomWorkAgent
uses gw.api.integration.inbound.Factory
uses gw.api.integration.inbound.work.Handler
uses gw.api.integration.inbound.work.WorkSetProcessor
uses gw.api.startable.StartablePluginCallbackHandler
uses gw.api.startable.StartablePluginState
uses gw.plugin.InitializablePlugin
uses gw.plugin.integration.inbound.InboundIntegrationStartablePlugin
uses onbase.api.Settings
uses org.slf4j.LoggerFactory

uses java.util.Map

/**
 * Hyland Build Version: 16.0.0.999
 *
 * Inbound integration for OnBase Message Broker
 *
 * Register as an InboundIntegrationStartablePlugin in the plugin registry.
 *
 * Plugin Parameters (Found in GWP file):
 *    - integrationservice : Name of the corresponding integration in inbound-integration-config.xml
 *
 * WorkAgent Parameters (Found in inbound-integration-config.xml):
 *    - PollingBatchSize : Maximum message count to receive for each polling operation
 */
class MessageBrokerInboundMessageReceiver implements InboundIntegrationStartablePlugin, InitializablePlugin, Factory {

  // Constant name used for logging start/stop
  static final var _name = "MessageBrokerInBoundMessageReceiver"

  /** Should run when server starts? */
  private static final var _RUN_ON_SERVER_START = "runOnServerStartup";

  var logger = LoggerFactory.getLogger('MessageBroker')

  // Name of the corresponding integration in inbound-integration-config.xml. This
  // will be read out of the plugin parameters.
  var _inboundIntegrationName : String = null

  // Startable plugin information.
  var _state = StartablePluginState.Stopped
  var _runOnServerStart: Boolean
  var _callback : StartablePluginCallbackHandler

  // Maximum message count per polling operation. This will be read out of
  // inbound-integration-config.xml
  var _pollingBatchSize : int = 1;

  /**
   * Receives plugin parameters from the plugin registry.
   *
   * Parameters:
   */
  override function setParameters(params: Map) {
    _inboundIntegrationName = params['integrationservice'] as String
    _runOnServerStart = (params[_RUN_ON_SERVER_START]?: false) as Boolean
  }

  override function start(callback: StartablePluginCallbackHandler, isStarting: boolean) {
    _callback = callback
    _callback.logStart(_name)
    if(!isStarting ||_runOnServerStart){
      start()
      _state = Started;
    }
  }

  override function stop(isStopping: boolean) {
    stop()
    _state = Stopped;

    _callback.logStop(_name)
    _callback = null
  }

  override property get State(): StartablePluginState {
    return _state
  }

  /**
   * Receives integration parameters configured in inbound-integration-config.xml
   */
  override function setup(properties: Map<String, Object>) {
    _pollingBatchSize = (properties['PollingBatchSize'] as String).toInt()
  }

  /**
   * Receives the pluginhandler for an inbound integration. Not used for
   * custom integrations.
   */
  override function setHandler(handler: Handler) {
    // Do nothing
  }

  override function teardown() {
    // Nothing to clean up
  }

  override function start() {
    if (_inboundIntegrationName.HasContent) {
      logger.info("Starting MessageBroker WorkAgent")
      CustomWorkAgent.startCustomWorkAgent(_inboundIntegrationName)
    }
  }

  override function stop() {
    if (_inboundIntegrationName.HasContent) {
      logger.info("Stopping MessageBroker WorkAgent")
      CustomWorkAgent.stopCustomWorkAgent(_inboundIntegrationName)
    }
  }

  override function transactional(): boolean {
    return false
  }

  override function factory(): Factory {
    return this
  }

  override function createWorkProcessor(): WorkSetProcessor {
    return new MessageBrokerWorkSetProcessor(_pollingBatchSize, Settings.MessageProcessors)
  }

}
