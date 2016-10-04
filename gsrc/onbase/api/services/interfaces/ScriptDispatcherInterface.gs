package onbase.api.services.interfaces

uses java.util.Hashtable

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/12/2015 - Daniel Q. Yu
 *     * Initial implementation.
 */
/**
 * Interface to call OnBase Script Dispatcher service.
 */
interface ScriptDispatcherInterface {
  /**
   * Dispatch a unity script in OnBase.
   *
   * @param scriptName The unity script name.
   * @param params The input parameters for the unity script.
   *
   * @return A hash table with unity script results.
   */
  public function dispatchScript(scriptName: String, params: Hashtable): Hashtable
}
