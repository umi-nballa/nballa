package gw.accelerator.ruleeng

uses gw.api.startable.IStartablePlugin
uses gw.api.startable.StartablePluginState
uses gw.api.startable.StartablePluginCallbackHandler


/**
 * RuleEntityGraphStartablePlugin dynamically rebuilds the entity graph based
 * on the data model on startup.
 */
class RuleEntityGraphStartablePlugin implements IStartablePlugin {
  /** The state of the plugin. */
  var _state = StartablePluginState.Stopped

  /** The callback handler provided to the start method. */
  var _callback : StartablePluginCallbackHandler

  override property get State() : StartablePluginState {
    return _state
  }

  /**
   * Rebuilds the rule entity graph.
   */
  override function start(callback : StartablePluginCallbackHandler,
                          serverStarting : boolean) {
    _callback = callback
    _callback.execute(\ -> {
        RuleEntityGraphBuilder.buildRuleGraph()
      }
    )
    _state = Started
    _callback.log("*** StartablePlugin RuleEntityGraph Started ***")
  }

  override function stop(serverShuttingDown : boolean) {
    if (State == Started) {
      _callback.log("*** StartablePlugin RuleEntityGraph stoped ***")
      _callback = null
      _state = Stopped
    }
  }

}
