package onbase.api.application

uses gw.api.util.Logger
uses onbase.api.Settings
uses onbase.api.services.ServicesManager

uses java.io.File
uses java.io.FileInputStream
uses java.io.FileOutputStream
uses java.lang.Exception
uses java.util.Hashtable
uses java.util.Properties

/**
 *
 * Hyland Build Version: 16.0.0.999
 *
 * Last Changes:
 *   01/16/2015 - Daniel Q. Yu
 *     * Initial implementation, refactored code from OnBaseKeywordMapping class.
 *
 *   11/13/2015 - Clayton Sandham
 *     * Set ID to -1 on miss so there is not a keyword conflict if there are >=999 keywords. 
 *     * Also fixed bug so that obmapping.properties cache works correctly.
 */
/**
 * Keyword Mapping application.
 */
class KeywordMapping {
  /** Logger. */
  private var logger = Logger.forCategory(Settings.ApplicationLoggerCategory)
  /** Keyword map property object. */
  private var keywordMap = new Properties()
  /** Services Manager  */
  private var servicesManager = new ServicesManager()
  /**
   * Get keyword name from keyword id.
   *
   * @param name The keyword name.
   *
   * @return The keyword id.
   */
  public function getKeywordIdFromName(name: String): String {
    // Load cached properties file.
    if (keywordMap.size() == 0) {
      var file = new File(Settings.keywordFile)
      if (file.exists()) {
        var fileInput: FileInputStream
        try {
          fileInput = new FileInputStream(file)
          keywordMap.load(fileInput)
        } catch (ex: Exception) {
        } finally {
          if (fileInput != null) {
            try {
              fileInput.close()
            } catch (ex2: Exception) {
            }
          }
        }
      }
    }
    if (keywordMap.getProperty(name) == null) {
      // load keyword id from name
      var params = new Hashtable()
      params.put("Keyword Name", name)
      try {
        var result = servicesManager.dispatchScript("KeywordMapping", params)
        keywordMap.setProperty(name, result.get("Keyword Id") as String)
      } catch (ex: Exception) {
        logger.error("Unable to find id for keyword " + name)
        keywordMap.setProperty(name, "-1")
      }
      // save properties file.
      var fileOutput: FileOutputStream
      try {
        fileOutput = new FileOutputStream(Settings.keywordFile)
        keywordMap.store(fileOutput, "Keyword name to id mapping")
        fileOutput.close()
      } catch (ex: Exception) {
      } finally {
        if (fileOutput != null) {
          try {
            fileOutput.close()
          } catch (ex2: Exception) {
          }
        }
      }
    }
    return keywordMap.getProperty(name)
  }
}
