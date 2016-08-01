package gwservices.pc.dm.batch

uses gw.api.startable.IStartablePlugin
uses gw.api.startable.StartablePluginCallbackHandler
uses gw.api.startable.StartablePluginState
uses gw.lang.reflect.TypeSystem
uses gw.plugin.InitializablePlugin
uses gw.processes.BatchProcess
uses gw.processes.WorkQueueBase
uses gwservices.pc.dm.util.DMLogger

uses java.lang.Integer
uses java.lang.Thread
uses java.lang.Throwable
uses java.util.Map

/**
 * Execute the data migration repeatedly
 */
class MigrationStartablePlugin implements IStartablePlugin, InitializablePlugin {
  /** Work item class */
  private static final var _MIGRATION_WORK_QUEUE_CLASS = "workQueueClass";
  /** Should run when server starts? */
  private static final var _RUN_ON_SERVER_START = "runOnServerStartup";
  /** How long should the thread sleep */
  private static final var _SLEEP_TIME = "sleepTimeInSeconds";
  /** Should start thread on startup? */
  private var _runOnServerStart = false
  /** Work item class name */
  private var _workItemClass: String
  /** How many seconds to sleep between executions */
  private var _sleepTimeInSeconds: int = 60
  override function setParameters(map: Map) {
    _runOnServerStart = Boolean.parseBoolean(map.get(_RUN_ON_SERVER_START) as String)
    var sleepTime = map.get(_SLEEP_TIME) as String
    if (sleepTime.HasContent) {
      _sleepTimeInSeconds = Integer.parseInt(sleepTime)
    }
    _workItemClass = map.get(_MIGRATION_WORK_QUEUE_CLASS) as String
  }

  override function start(callbackHandler: StartablePluginCallbackHandler, serverStarting: boolean) {
    if ((!serverStarting || _runOnServerStart) and not ScriptParameters.PauseMigration_Ext and not WorkerThread.Running) {
      var workQueueClass = TypeSystem.getByFullName(_workItemClass)
      var constructor = workQueueClass.TypeInfo.Constructors.firstWhere(\i -> i.Parameters.Count == 0)
      var workQueue = constructor.Constructor.newInstance(null) as WorkQueueBase
      WorkerThread.Running = true
      var thread = new WorkerThread(workQueue) {: Sleep = _sleepTimeInSeconds * 1000}
      thread.Daemon = true
      thread.start()
    }
  }

  override function stop(serverStopping: boolean) {
    WorkerThread.Running = false
  }

  override property get State(): StartablePluginState {
    return WorkerThread.Running ? Started : Stopped
  }

  private static class WorkerThread extends Thread {
    /** Should threads keep running? */
    private static var _running: boolean as Running = false
    /** Sleep time */
    private var _sleep: int as Sleep = 60000
    private var _batchProcess: BatchProcess
    construct(workQueue: WorkQueueBase) {
      _batchProcess = workQueue.createBatchProcess(null);
    }

    override function run() {
      while (Running and not ScriptParameters.PauseMigration_Ext) {
        try {
          _batchProcess.run()
          this.sleep(_sleep)
        } catch (e: Throwable) {
          DMLogger.General.warn("migration processing failed", e)
          Running = false
        }
      }
    }
  }
}