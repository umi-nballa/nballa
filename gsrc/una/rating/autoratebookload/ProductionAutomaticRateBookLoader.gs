package una.rating.autoratebookload

uses com.guidewire.pl.system.dependency.PLDependencies
uses gw.api.webservice.importTools.ImportToolsImpl
uses gw.util.StreamUtil
uses org.apache.commons.lang.StringUtils
uses org.slf4j.Logger

uses java.io.File
uses java.io.FileInputStream
uses java.lang.Exception

/**
 * Load Rate Book using essentially the same approach as the OOTB GUI screen.
 * This approach will only work when called from the GUI with a user session,
 * due to dependencies in the OOTB code.
 */
class ProductionAutomaticRateBookLoader extends AbstractBaseAutomaticRateBookLoader {
  construct() {
    super()
  }

  construct(useThisLogger: Logger) {
    super(useThisLogger)
  }

  construct(directoryContainingRateBookXmlFilesIn: File, useThisLogger: Logger) {
    super(directoryContainingRateBookXmlFilesIn, useThisLogger)
  }

  /**
   * This class' implementation is closest to the production GUI implementation.
   * But like the OOTB implementation, it will only work for a logged in user with
   * an HTML Session object.
   *
   * This implementation prevents the automatic rate book loader from attempting
   * to load rate books when called from web services, for instance. Expect the
   * policy migration plugin to fail to rate if rate books are not properly loaded
   * before it runs.
   */
  protected override function canLoadRateBooks(): boolean {
    return (PLDependencies.getWebController().Request.Request.Session != null)
  }

  /**
   * This leverages the OOTB implementation heavily.
   * Intentionally, as much as possible.
   *
   * The OOTB implementation will only work when a currently logged in user's web session is available.
   * (So it will not work, for example, in a web service or from a GUnit test.)
   */
  protected override function loadRateBook(javaFile: File): boolean {
    var successfulLoad = true
    //Commented out code below for GuideOne as it is used just to validate the implementation of the accelerator.
    /*var is = new FileInputStream(javaFile)
    var webFile = new MockWebFile(is)
    importer.import(webFile)*/

    var inputStream = new FileInputStream(javaFile)
    var byteContent = StreamUtil.getContent(inputStream)
    var importer = new ImportToolsImpl()
    //Commented out code below for GuideOne as the code is not needed for our implementation.
    //var previousProvider = ThreadLocalBundleProvider.get()
    try {
      gw.transaction.Transaction.runWithNewBundle(\bundle -> {
        var importResults = importer.importXmlDataAsByteArray(byteContent)

        if (importResults == null) {
          // Importer returns null if no import data was found in the file
          throw "No data found in Rate Book file: " + javaFile.Path
        }
        if (importResults.getErrorLog().length > 0) {
          var errorLogString = StringUtils.join(importResults.ErrorLog)
          //Send and email if there is an error embedded in the importResults
          if (errorLogString.contains("Error")) {
            successfulLoad = false
            _rfLogger.error("   Import Error: " + errorLogString)
          } else {
            _rfLogger.warn("    Import Warning: " + errorLogString)
          }
        }
      })
    } catch (ex: Exception) {
      _rfLogger.error("    Error occured while importing rate book : " + javaFile.Name + " : " + ex)
      successfulLoad = false
    } finally {
      //do nothing
    }
    return successfulLoad
  }
}
