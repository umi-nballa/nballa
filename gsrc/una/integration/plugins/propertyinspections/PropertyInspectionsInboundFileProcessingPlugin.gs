package una.integration.plugins.propertyinspections

uses gw.api.database.Query
uses gw.pl.persistence.core.Bundle
uses org.apache.commons.io.FilenameUtils
uses una.integration.framework.file.inbound.model.FileRecordInfo
uses una.integration.framework.file.inbound.plugin.InboundFileProcessingPlugin
uses una.integration.util.propertyinspections.PropertyInspectionsInboundUtil
uses una.logging.UnaLoggerCategory
uses una.model.PropertyInspectionsInboundData

uses java.text.SimpleDateFormat
uses java.util.Date
uses una.integration.framework.file.inbound.model.FileRecords
uses una.utils.ActivityUtil

/**
 * The InboundFileProcessingPlugin implementation to process Inspection Vendors inbound files
 * Created by : AChandrashekar on Date: 10/24/16
 */
class PropertyInspectionsInboundFileProcessingPlugin extends InboundFileProcessingPlugin {
   final static var BEAN_IO_STREAM_NAME = "PropertyInspectionsInboundFileMapping"
   final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION
   final static var POLICY_CHANGE_DESCRIPTION = "To add the data received from Inspection Vendors"
   final static var DATE_FORMAT_RECEIVED = "MMddyyyy"
   final static var LAST_INSPECTION_DATE_FORMAT = "yyyy-MM-dd"
   final static var NOTES_SUBJECT = "Inspection Vendors"
   var CLASS_NAME=PropertyInspectionsInboundFileProcessingPlugin.Type.DisplayName

  /**
   * The BeanIO Stream Name to read the inbound file
   */
  override property get BeanIOStream(): String {
    return BEAN_IO_STREAM_NAME
  }

  /**
   * Validates the fileName format for Property Inspections integration.
   */
  override function validateFile(fileName: String, fileRecords: FileRecords) {
    LOGGER.debug("Entering the function validateFile() of "+CLASS_NAME)
    // Validates the file name and extract required data from file name and add it to the header record.
    PropertyInspectionsInboundUtil.validateFileName(fileName)
    LOGGER.debug("Exiting the function validateFile() of "+CLASS_NAME)
  }


  /**
   * Processes the Inspection Vendors inbound file record and updates the last inspection date and Notes in PolicyCenter.
   * This function runs in a transaction
   */
  override function processDetailRecord(fileName: String, headerRecord: FileRecordInfo, batchHeaderRecord: FileRecordInfo, detailRecord: FileRecordInfo, bundle: Bundle) {
    LOGGER.debug("Entering the function processDetailRecord() of "+CLASS_NAME)

    // Retrieving required data from the Detail Record and processing the data
    var policyRecord = detailRecord.RecordObject as PropertyInspectionsInboundData
    var policyNumber = policyRecord.PolicyNumber

    if (policyNumber.Empty) {
      detailRecord.Failed = true
      detailRecord.RecordErrors = detailRecord.RecordErrors?:{}
      detailRecord.RecordErrors.add("Policy Number is required to Update the Last inspection date.")
    }

    var policyPeriod=Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, policyNumber).select().last()

    if(policyPeriod==null) {
      detailRecord.Failed=true
      detailRecord.RecordErrors= detailRecord.RecordErrors?:{}
      detailRecord.RecordErrors.add("Policy Number doesn't exists in the PolicyCenter")
    }else{
      LOGGER.debug("The Policy Change transaction Started : "+policyNumber)
      var formatter = new SimpleDateFormat(DATE_FORMAT_RECEIVED)
      var date = formatter.parse((FilenameUtils.removeExtension(fileName)).substring(17,25))
      var sdf= new SimpleDateFormat(LAST_INSPECTION_DATE_FORMAT)
      var lastInspectionDate : Date = (sdf.format(date)) as Date
      var policyChange = new PolicyChange()
      policyChange = bundle.add(policyChange)
      policyChange.Description = POLICY_CHANGE_DESCRIPTION
      var effectiveDate = gw.web.job.policychange.StartPolicyChangeUIHelper.applyEffectiveTimePluginForPolicyChange( policyPeriod, policyChange, policyPeriod.PeriodStart)
      policyChange.startJob(policyPeriod.Policy, effectiveDate)
      var policyChangePeriod = policyChange.Periods.length == 1 ? policyChange.Periods[0] : null
      policyChangePeriod.DateLastInspection_Ext= lastInspectionDate
      policyChangePeriod.addNote(NoteTopicType.TC_GENERAL, NOTES_SUBJECT,policyRecord.Notes)
      var activity=ActivityUtil.createActivityAutomatically(policyChangePeriod, "PIO")

      policyChangePeriod.PolicyChangeProcess.requestQuote()
      policyChangePeriod.markValidQuote()
      policyChangePeriod.PolicyChangeProcess.bind()

      LOGGER.debug("The Policy Change transaction successfully completed : "+policyNumber)
    }
    LOGGER.debug("Exiting the function processDetailRecord() of "+CLASS_NAME)
  }
}