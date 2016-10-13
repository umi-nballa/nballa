package una.rating.autoratebookload

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.api.system.PCLoggerCategory
uses gw.api.util.ConfigAccess
uses org.apache.commons.io.IOUtils
uses org.slf4j.Logger
uses org.xml.sax.InputSource
uses org.xml.sax.SAXException

uses javax.xml.parsers.SAXParserFactory
uses java.io.File
uses java.io.FileReader
uses java.lang.CharSequence
uses java.lang.Exception
uses java.lang.System
uses java.text.SimpleDateFormat
uses java.util.ArrayList
uses java.util.Map
uses java.util.TreeMap

/**
 * Abstract base class containing most of the functionality to check to see if any Rate Books need to be loaded or updated.
 * When 'run()' is called, it checks the tables against the files, and makes appropriate updates.
 * The calling code is expected to decide if and when it is appropriate to attempt an automatic update.
 */
abstract class AbstractBaseAutomaticRateBookLoader {
  protected var _rfLogger: Logger
  private var _directoryContainingRateBookXmlFiles: File as readonly DirectoryContainingRateBookXmlFiles
  private static final var MODULE_ROOT = "configuration"
  private static final var CONFIG_DIR = "config"
  private static final var CONTENT_DIR = "content"
  private static final var RATEBOOKS_DIR = "ratebooks"
  private final static var RATEBOOK_CODE = "RateBook Code"
  private final static var RATEBOOK_EDITION = "RateBook Edition"
  /**
   * Contains non-null status when automatic rate book loading is running.
   */
  private static var _currentStatus: String as readonly RateBookLoadingStatus = null
  construct() {
    this(getDefaultDirectoryForRateBookFiles(), PCLoggerCategory.RATEFLOW)
  }

  construct(final directoryContainingRateBookXmlFilesIn: File) {
    this(directoryContainingRateBookXmlFilesIn, PCLoggerCategory.RATEFLOW)
  }

  construct(final useThisLogger: Logger) {
    this(getDefaultDirectoryForRateBookFiles(), useThisLogger)
  }

  construct(final directoryContainingRateBookXmlFilesIn: File, final useThisLogger: Logger) {
    _directoryContainingRateBookXmlFiles = directoryContainingRateBookXmlFilesIn
    _rfLogger = useThisLogger
  }

  private static function getDefaultDirectoryForRateBookFiles(): File {
    final var configurationDirectory = ConfigAccess.getModuleRoot(MODULE_ROOT)
    var path = configurationDirectory.Path + File.separator + CONFIG_DIR + File.separator + CONTENT_DIR + File.separator + RATEBOOKS_DIR
    return new File(path)
  }

  /**
   * This is the entry point. Start the process by creating an instance of a subclass and calling this method.
   */
  public function run() {
    _rfLogger.info("AutomaticRateBookLoader checking Rate Book versions:")
    try {
      AutoLoadProfilerTag.AUTO_LOAD.execute(\-> {
        internalRun()
      })
    } catch (ex: Exception) {
      // Unexpected exceptions must not cause the rating plugin to fail. We log and continue.
      // Rating may or may not fail when this loading process fails. But we'll let that process
      // handle any such issues in its own way.
      _rfLogger.error("Unexpected exception while attempting automatic Rate Book loading.", ex)
    } finally {
      _currentStatus = null
    }
  }

  /**
   * This method exists so that the TestAutomaticRateBookLoader child class can capture exceptions
   * and pass them around the "run()" method above, to be thrown in the calling test context.
   */
  protected function internalRun() {
    testableRun()
  }

  /**
   * This method contains the main logic of automatic rate book loading.
   * (It is overriden only by testing mock subclasses that test error handling behavior by throwing exceptions.)
   */
  protected function testableRun() {
    // Find the exported Rate Book files in the 'PolicyCenter/modules/configuration/sampledata' directory.
    _currentStatus = "Examining rate book XML files in " + DirectoryContainingRateBookXmlFiles.CanonicalPath
    // (This status is replaced with another almost instantly.)
    final var mapOfRateBookCodesToFiles = buildMapOfRateBookCodesToFiles()

    var rateBooksProcessed = 0
    var rateBooksCount = mapOfRateBookCodesToFiles.Count
    // For each Rate Book Code...
    for (entry in mapOfRateBookCodesToFiles.entrySet()) {
      final var rateBookCode = entry.Key
      // For each Rate Book Edition...
      var successfulLoad: boolean
      for (rateBookPropertiesFromFile in entry.Value) {
        successfulLoad = true
        final var rateBookEdition = rateBookPropertiesFromFile.BookEdition
        final var rateBookDescription = "RateBook(code: " + rateBookCode + ", version: " + rateBookEdition + ")"
        // (same format as 'entity.RateBook.toString()' method.)
        _currentStatus = "Examining rate book file for " + rateBookDescription

        // Fetch this Edition of the Rate Book from the database (if it's there)
        var rateBookFromDatabase = Query.make(entity.RateBook)
            .compare(RateBook#BookCode, Relop.Equals, rateBookCode)
            .compare(RateBook#BookEdition, Relop.Equals, rateBookEdition as String)
            .select().FirstResult

        // Decide what to do:
        var deleteExistingRatebook = false
        var loadRatebookFromDisk = false
        final var hasWebSession = true
        //canLoadRateBooks()

        if (rateBookFromDatabase == null) {
          deleteExistingRatebook = false
          // does not exist in database; no delete needed
          loadRatebookFromDisk = true
          // Should load from disk.
          if (hasWebSession) {
            _rfLogger.info("  " + rateBookDescription + " is not in the database.  It will be loaded from disk.")
          } else {
            loadRatebookFromDisk = false
            // Do not load, as loading would fail. (...when called form web services or GUnit.)
            _rfLogger.warn("  " + rateBookDescription + " is not in the database.  It will NOT be loaded from disk because the current user does not have a web session.  It will need to be loaded by hand.")
          }
        } else {
          // This Rate Book Edition exists on the disk and in the database.
          // Read just the RateBook properties from the file.
          final var sdf = new SimpleDateFormat(RateBookXmlSaxContentHandler.RATE_BOOK_DATE_TIME_FORMAT)
          final var loadedDate = sdf.format(rateBookFromDatabase.LastStatusChangeDate)
          final var diskDate = sdf.format(rateBookPropertiesFromFile.LastStatusChangeDate)

          // If the file is newer than the database version, then delete and load:
          if (rateBookFromDatabase.LastStatusChangeDate.Time < rateBookPropertiesFromFile.LastStatusChangeDate.Time) {
            var reloadThisRateBook = true
            // The rate book in the database is older than the one on the disk; we should reload it.
            var currentStateMessage = "  " + rateBookFromDatabase.toString() + " from disk is newer than the version in the database.  (" + loadedDate + " < " + diskDate + ")"

            // But...
            if (rateBookFromDatabase.Status.Ordinal == typekey.RateBookStatus.TC_ACTIVE.Ordinal) {
              reloadThisRateBook = false
              // We will not delete Active rate books!
              currentStateMessage += "  We will NOT delete or load the new version because the edition in the database has the status '" + rateBookFromDatabase.Status.toString() + "'."
            }
            if (not hasWebSession) {
              reloadThisRateBook = false
              // Do not load, as loading would fail. (...when called form web services or GUnit.)
              currentStateMessage += "  We will NOT load the new version because the current user does not have a web session.  It will need to be loaded by hand."
            }

            // Set flags to reload or not:
            deleteExistingRatebook = reloadThisRateBook
            loadRatebookFromDisk = reloadThisRateBook
            if (reloadThisRateBook) {
              currentStateMessage += "  We will load the new version."
              _rfLogger.info(currentStateMessage)
            } else {
              _rfLogger.warn(currentStateMessage)
            }
          } else if (rateBookFromDatabase.LastStatusChangeDate.Time > rateBookPropertiesFromFile.LastStatusChangeDate.Time) {
            // The rate book in the database is NEWER than the on on the disk. (We must have updated it in the database.)
            _rfLogger.info("  " + rateBookFromDatabase.toString() + " in the database is newer than the version on the disk.  (" + loadedDate + " > " + diskDate + ")  This is the normal case while making changes locally before exporting and checking in the changes.")
          } else {
            // Database and disk match. No action needed.
            _rfLogger.info("  " + rateBookFromDatabase.toString() + " has the same LastStatusChangeDate in the database as on disk.  No action needed.")
          }
        }

        if (hasWebSession) {
          var actionDescription: String
          if (deleteExistingRatebook and rateBookFromDatabase != null) {
            actionDescription = "Deleting " + rateBookFromDatabase.toString() + " from system. (Newer version to be loaded from file system.)"
            _currentStatus = actionDescription
            _rfLogger.info("    " + actionDescription)
            AutoLoadProfilerTag.DELETE_RATE_BOOK.execute(\p -> {
              p.setPropertyValue(RATEBOOK_CODE, rateBookFromDatabase.BookCode)
              p.setPropertyValue(RATEBOOK_EDITION, rateBookFromDatabase.BookEdition)
              gw.transaction.Transaction.runWithNewBundle(\bundle -> {
                rateBookFromDatabase = bundle.add(rateBookFromDatabase)
                rateBookFromDatabase.removeRateBook()
                bundle.commit()
              })
            })
            rateBookFromDatabase = null
            // This 'entity.RateBook' object is no longer valid.
          }

          if (loadRatebookFromDisk) {
            actionDescription = "Loading " + rateBookDescription + " from disk into the database."
            _currentStatus = actionDescription
            _rfLogger.info("    " + actionDescription)
            final var startTime = System.currentTimeMillis()
            AutoLoadProfilerTag.LOAD_RATE_BOOK.execute(\p -> {
              p.setPropertyValue(RATEBOOK_CODE, rateBookPropertiesFromFile.BookCode)
              p.setPropertyValue(RATEBOOK_EDITION, rateBookPropertiesFromFile.BookEdition as CharSequence)
              successfulLoad = loadRateBook(rateBookPropertiesFromFile.JavaFile)
            })
            final var endTime = System.currentTimeMillis()
            final var durationInSeconds = (endTime - startTime) / 1000.0
            if (successfulLoad)
              actionDescription = "Successfully loaded " + rateBookDescription + " in " + durationInSeconds + " seconds."
            else
              actionDescription = "Error loading " + rateBookDescription + " in " + durationInSeconds + " seconds."
            _rfLogger.info("    " + actionDescription)
          }
        }
        if (successfulLoad)
          rateBooksProcessed++
      }
    }
    if (rateBooksProcessed != rateBooksCount) {
      _rfLogger.error("Automatic Ratebook Loader failed. Loaded " + rateBooksProcessed + " ratebooks out of " + rateBooksCount + " ratebooks.")
      _rfLogger.error((rateBooksCount - rateBooksProcessed) + " ratebooks failed to load. See log for details.")
    } else {
      _rfLogger.info("Successfully loaded all the " + rateBooksProcessed + " ratebooks.")
    }
  }

  /**
   * @return <code>true</code> if we are running in an environment where loading rate books should work.
   * <code>false</code> if rate book loading is likely to fail.
   */
  protected abstract function canLoadRateBooks(): boolean

  /**
   * Load the rate book in the given Java file into the database.
   */
  protected abstract function loadRateBook(final javaFile: File): boolean

  /**
   * Build a <code>Map</code> of
   *   Key = Rate Book Code,
   *   Value = <code>List</code> of <code>RateBookProperties</code> objects,
   *   ordered by <code>Edition</code>.
   *
   * [This method is 'protected' to give GUnit tests access to this functionality for related tests.]
   */
  protected final function buildMapOfRateBookCodesToFiles(): Map<String, List<RateBookProperties>> {
    // Find all rate book export files and do a quick parse of each:
    final var rateBookFileList = new ArrayList<RateBookProperties>()
    if (DirectoryContainingRateBookXmlFiles.exists()) {
      for (childFile in DirectoryContainingRateBookXmlFiles.Children) {
        if (childFile.Name.endsWith(".xml")) {
          final var rateBookProperties = readRateBookProperties(childFile)
          if (rateBookProperties != null) {
            // (Silently discard xml files that are not rate book exports.)
            rateBookFileList.add(rateBookProperties)
          }
        }
      }
    } else {
      _rfLogger.error(\-> "Directory where we expected to find rate books is missing: " + DirectoryContainingRateBookXmlFiles.AbsolutePath)
    }

    // Order and partition:
    final var mapOfRateBookCodesToFiles = new TreeMap<String, List<RateBookProperties>>(
        rateBookFileList
            .orderBy(\rateBookProperties -> rateBookProperties.BookEdition)
            .partition(\rateBookProperties -> rateBookProperties.BookCode))

    return mapOfRateBookCodesToFiles
  }

  /**
   * Read just the RateBook properties from the file -- by aborting SAX parsing by throwing
   * an exception when we get to the end of the first <RateBook ...> Element.
   */
  public function readRateBookProperties(final javaFile: File): RateBookProperties {
    final var factory = SAXParserFactory.newInstance()
    factory.NamespaceAware = true
    final var parser = factory.newSAXParser()
    final var xmlReader = parser.XMLReader

    final var saxContentHandler = new RateBookXmlSaxContentHandler(javaFile)
    // (Hint: Our Rate Book specific parsing logic is in this class.)
    xmlReader.ContentHandler = saxContentHandler

    final var reader = new FileReader(javaFile)
    final var source = new InputSource(reader)
    try {

      xmlReader.parse(source)
    } catch (ex: SufficientRateBookDataFound) {
      /**
       * This is the normal case for a successful *Ratabase Native XML* response.
       * We use this exception to abort the SAX message processing, as it would
       * be unnecessary and wasteful to parse the rest of the message.
       */
      return ex.RateBookProperties
      // Normal successful return point.
    } catch (saxEx: SAXException) {
      if (saxEx.Cause typeis NonRateBookGuidewireImportFileException) {
        return null
        // This is a Guidewire import file for some other tables. IE: It's NOT a rate book export file.
      } else {
        _rfLogger.error("Unexpected exception reading Rate Book XML file: " + javaFile.Path, saxEx)
      }
    } catch (ex: Exception) {
      _rfLogger.error("Unexpected exception reading Rate Book XML file: " + javaFile.Path, ex)
    } finally {
      IOUtils.closeQuietly(reader)
    }

    return null
    // FAILED to read file.
  }
}
