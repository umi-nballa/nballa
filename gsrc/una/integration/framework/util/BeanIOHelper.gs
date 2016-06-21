package una.integration.framework.util

uses una.integration.framework.file.inbound.model.FileRecordInfo
uses una.logging.UnaLoggerCategory
uses org.beanio.BeanReaderErrorHandlerSupport
uses org.beanio.InvalidRecordException
uses org.beanio.StreamFactory

uses java.io.File
uses java.util.ArrayList
uses gw.api.util.ConfigAccess

/**
 * Helper class for reading and writing file using BeanIO open source java framework.
 * Created By: vtadi on 5/18/2016
 */
final class BeanIOHelper {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  final static var MAPPING_FILE_PATH = "file:" + ConfigAccess.getModuleRoot("configuration").Path + "/gsrc/" + PropertiesHolder.getProperty("beaniomappingfile")

  static var _streamFactory: StreamFactory

  private construct() {}

  /*
    Initializes the BeanIO StreamFactory and loads all stream mappings from the mapping file.
   */
  private static function initStreamFactory() {
    if (_streamFactory == null) {
      _streamFactory = StreamFactory.newInstance()
      _streamFactory.loadResource(MAPPING_FILE_PATH)
      _logger.debug("BeanIO StreamFactory is initialized.")
    }
  }

  /**
   * Reads the file with given file name including path using beanio framework with the file mapping defined for the given stream name.
   * @param streamName the beanio stream name from file mapping xml file to be used to read the file.
   * @param fileName the name of the file including the absolute path of the file.
   * @return List<FileRecordInfo> the beanio records created from the data records in the file.
   */
  static function readFile(streamName: String, fileName: String): List< FileRecordInfo > {
    initStreamFactory()

    var fileRecords = new ArrayList< FileRecordInfo >()
    var fileRecordInfo: FileRecordInfo
    var file = new File(fileName)
    var record: Object = null
    var totalLines = 0
    var beanReader = _streamFactory.createReader(streamName, file)

    try {
      // Creating and setting error handling implementation for invalid records
      var invalidRecordErrorHandler = new BeanReaderErrorHandlerSupport() {
        override function invalidRecord(ex: InvalidRecordException) {
          var context = beanReader.getRecordContext(0)
          fileRecordInfo = new FileRecordInfo ()
          fileRecordInfo.Failed = true
          fileRecordInfo.RecordText = context.RecordText
          fileRecordInfo.RecordErrors = context.RecordErrors
          fileRecordInfo.FieldErrors = context.FieldErrors
          fileRecords.add(fileRecordInfo)
          _logger.info("Error reading the record - ${fileRecordInfo.RecordText}")
        }
      }
      beanReader.setErrorHandler(invalidRecordErrorHandler)

      while ((record == null and totalLines == 0) or record != null) {
        record = beanReader.read() // since we have error handling for invalid record, this read will read till it finds the valid record
        fileRecordInfo = new FileRecordInfo ()
        if (beanReader.LineNumber == -1) {
          break
        }
        fileRecordInfo.RecordObject = record
        fileRecordInfo.RecordName = beanReader.RecordName
        fileRecordInfo.RecordLineNumber = beanReader.LineNumber

        fileRecords.add(fileRecordInfo)
        totalLines++
      }
      _logger.debug("Number of lines in the file ${fileName} is ${fileRecords.Count}")
    } finally {
      beanReader.close()
    }
    return fileRecords
  }

  /**
   * Creates a file with given fileName and records based on the given stream name and corresponding mapping in the file mapping.
   * @param streamName the name of the stream in the mapping file corresponding to the input file
   * @param fileName absolute path of the file name.
   * @param records the list of records in the order to be written to the file.
   */
  static function writeFile(streamName: String, fileName: String, records: List<Object>) {
    initStreamFactory()

    // If directory doesn't exist, then create it.
    if (fileName != null) {
      fileName = fileName.replaceAll("\\\\", "/")
      if (fileName.contains("/")) {
        var destDir = fileName.substring(0, fileName.lastIndexOf("/"))
        new File(destDir).mkdirs()
      }
    }
    var file = new File(fileName)

    var beanWriter = _streamFactory.createWriter(streamName, file)
    try {
      records.each( \ record -> {
        beanWriter.write(record)
      })
      beanWriter.flush()
      _logger.debug("${records.Count} records written to the file ${fileName}")
    } finally {
      beanWriter.close()
    }
  }
}