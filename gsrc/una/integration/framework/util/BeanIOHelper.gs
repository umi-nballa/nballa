package una.integration.framework.util

uses gw.api.util.ConfigAccess
uses org.beanio.BeanReaderErrorHandlerSupport
uses org.beanio.InvalidRecordException
uses org.beanio.StreamFactory
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.exception.FieldErrorInformation
uses una.integration.framework.file.inbound.model.BatchRecords
uses una.integration.framework.file.inbound.model.FileRecordInfo
uses una.integration.framework.file.inbound.model.FileRecords
uses una.logging.UnaLoggerCategory

uses java.io.File
uses java.lang.System
uses java.util.ArrayList
uses java.util.HashMap
uses java.util.Map

/**
 * Helper class for reading and writing file using BeanIO open source java framework.
 * Created By: vtadi on 5/18/2016
 */
final class BeanIOHelper {
  final static var _logger = UnaLoggerCategory.UNA_INTEGRATION
  final static var MAPPING_FILE_PATH = "file:" + ConfigAccess.getModuleRoot("configuration").Path + "/gsrc/" + PropertiesHolder.getProperty("beaniomappingfile")
  final static var ERROR_FILE_STREAM_NAME = "FailedRecordsFileMapping"

  final static var HEADER_RECORD_NAME = PropertiesHolder.getProperty("HeaderRecordName")
  final static var BATCH_HEADER_RECORD_NAME = PropertiesHolder.getProperty("BatchHeaderRecordName")
  final static var DETAIL_RECORD_NAME = PropertiesHolder.getProperty("DetailRecordName")
  final static var BATCH_TRAILER_RECORD_NAME = PropertiesHolder.getProperty("BatchTrailerRecordName")
  final static var TRAILER_RECORD_NAME = PropertiesHolder.getProperty("TrailerRecordName")

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
   * Reads the file with given file path using beanio framework with the file mapping defined for the given stream name.
   * @param streamName the beanio stream name from file mapping xml file to be used to read the file.
   * @param filePath the absolute path of the file.
   * @return FileRecords the beanio records created from the data records in the file.
   */
  static function readFile(streamName: String, filePath: String): FileRecords {
    initStreamFactory()

    var fileRecords = new FileRecords()
    var fileRecordInfo: FileRecordInfo
    var file = new File(filePath)
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
          fileRecordInfo.RecordLineNumber = context.LineNumber
          addFileRecord(beanReader.RecordName, fileRecordInfo, fileRecords)
          _logger.info("Error reading the record - ${fileRecordInfo.RecordText}")
        }
      }
      beanReader.setErrorHandler(invalidRecordErrorHandler)

      while ((record == null and totalLines == 0) or record != null) {
        record = beanReader.read() // since we have error handling for invalid record, this read will read till it finds the valid record
        if (beanReader.LineNumber == -1) {
          break
        }
        fileRecordInfo = new FileRecordInfo ()
        fileRecordInfo.RecordObject = record
        fileRecordInfo.RecordName = beanReader.RecordName
        fileRecordInfo.RecordText = beanReader.getRecordContext(0).RecordText
        fileRecordInfo.RecordLineNumber = beanReader.LineNumber
        addFileRecord(beanReader.RecordName, fileRecordInfo, fileRecords)
        totalLines++
      }
      _logger.debug("Number of lines in the file ${filePath} is ${totalLines}")
    } finally {
      beanReader.close()
    }
    return fileRecords
  }

  /**
   * Adds the new record details to the fileRecords object based on the record name.
   */
  private static function addFileRecord(recordName: String, fileRecordInfo: FileRecordInfo, fileRecords: FileRecords) {
    switch (recordName) {
      case HEADER_RECORD_NAME:
        fileRecords.HeaderRecord = fileRecordInfo
        break
      case BATCH_HEADER_RECORD_NAME:
        fileRecords.Batches.add(new BatchRecords())
        fileRecords.Batches.last().BatchHeaderRecord = fileRecordInfo
        break
      case DETAIL_RECORD_NAME:
        if (fileRecords.Batches.Empty) {
          fileRecords.Batches.add(new BatchRecords())
        }
        fileRecords.Batches.last().DetailRecords.add(fileRecordInfo)
        break
      case BATCH_TRAILER_RECORD_NAME:
        fileRecords.Batches.last()?.BatchTrailerRecord = fileRecordInfo
        break
      case TRAILER_RECORD_NAME:
        fileRecords.TrailerRecord = fileRecordInfo
        break
      default:
        var errorMessage = "The record name configured in BeanIOFileMapping is not one of the record names allowed."
        var fieldErrorInfo = new FieldErrorInformation(){:FieldName = "Record Name", :FieldValue = recordName, :ErrorMessage = errorMessage}
        ExceptionUtil.throwException(ErrorCode.INVALID_RECORD_NAME, {fieldErrorInfo}, null)
    }
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

  /**
   * Creates an error file with the records that can't be processed due to errors.
   * @param fileRecords all the records from the input file.
   * @param path the input file path
   */
  static function createFileWithErrorRecords(fileRecords: FileRecords, path: java.nio.file.Path) {
    if (fileRecords.Batches.hasMatch( \ batch -> batch.BatchHeaderRecord?.Failed or batch.DetailRecords.hasMatch( \ detailRecord -> detailRecord.Failed))) {
      var fileName = path.toAbsolutePath().getFileName() as String
      var fieldErrors = new ArrayList<FieldErrorInformation>()
      fieldErrors.add(new FieldErrorInformation(){:FieldName = "fileName", :FieldValue = fileName})

      var errorRecords = new ArrayList<Map<String,String>>()
      if (fileRecords.HeaderRecord != null) {
        errorRecords.add(new HashMap<String, String>(){"recordText"->fileRecords.HeaderRecord.RecordText})
      }
      fileRecords.Batches.where( \ batch -> batch.BatchHeaderRecord?.Failed or batch.DetailRecords.hasMatch( \ detailRecord -> detailRecord.Failed)).each( \ batch -> {
        if (batch.BatchHeaderRecord != null) {
          errorRecords.add(new HashMap<String, String>(){"recordText"->batch.BatchHeaderRecord.RecordText})
          if (batch.BatchHeaderRecord.Failed) {
            fieldErrors.add(batch.BatchHeaderRecord.FieldErrorInfo)
          }
        }
        batch.DetailRecords.each( \ detailRecord -> {
          if (batch.BatchHeaderRecord.Failed or detailRecord.Failed) {
            errorRecords.add(new HashMap<String, String>(){"recordText"->detailRecord.RecordText})
            if (detailRecord.Failed) {
              fieldErrors.add(detailRecord.FieldErrorInfo)
            }
          }
        })
      })
      // Logging the error details
      ExceptionUtil.suppressException(ErrorCode.ERROR_RECORD_FILE, fieldErrors, null)
      // Creating the error file with error records
      var errorFilePath = path.Parent.Parent.toAbsolutePath() + "/error/"
      var errorFileName = System.currentTimeMillis()+".RecordError."+ fileName
      BeanIOHelper.writeFile(ERROR_FILE_STREAM_NAME, errorFilePath + errorFileName, errorRecords)
    }
  }
}