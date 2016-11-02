package edge.servlet

uses gw.api.startable.IStartablePlugin
uses gw.api.startable.StartablePluginState
uses gw.api.startable.StartablePluginCallbackHandler
uses java.lang.Throwable

/**
 * Bootstrapper for the edge config.
 */
@Distributed
class EdgeJsonRpcBootstrapPlugin implements IStartablePlugin {
  private var _state = StartablePluginState.Stopped


  override function start(p0: StartablePluginCallbackHandler, p1: boolean) {
    _state = StartablePluginState.Started
    try {
      final var x = HandlerInfoLookup.Status
      if (x.isLeft) {
        for (err in x.left) {
          print("EDGE STARTUP ERROR: " + err)
        }
      }
    } catch(e : Throwable) {
      e.printStackTrace()
    }
  }

  override function stop(p0: boolean) {
    _state = StartablePluginState.Stopped
  }

  override property get State(): StartablePluginState {
    return _state
  }
}
