package una.integration.plugins.propertyinspections


uses gw.plugin.integration.inbound.InboundIntegrationHandlerPlugin
uses gw.plugin.Plugins
uses gw.plugin.document.IDocumentContentSource
uses gw.transaction.Transaction

uses java.io.File
uses una.model.DocumentDTO
uses una.utils.DocumentUtil
uses gw.api.database.Query
uses una.utils.ActivityUtil
uses java.lang.Exception
uses una.integration.framework.exception.FieldErrorInformation
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.util.propertyinspections.UnaErrorCode
uses una.logging.UnaLoggerCategory

/**
* The InboundFileProcessingPlugin implementation to process Inspection Reports
 * User: AChandrashekar :: Date: 2/24/17 :: Time: 2:37 AM
 */
class PropertyInspectionsReportsInboundFileProcessingPlugin implements InboundIntegrationHandlerPlugin {
  final static var LOGGER = UnaLoggerCategory.UNA_INTEGRATION
  final static var UNIVERSAL_INSURANCE_MANAGERS_GROUP = "Universal Insurance Manager's Inc"
  final static var PRIORITY_INSPECTION_REVIEW_QUEUE = "Priority Inspection Review"
  final static var UW_INSPECTION_REVIEW_QUEUE = "UW Inspection Review"
  final static var CSR_INSPECTION_QUEUE = "CSR Inspection Queue"
  final static var REVIEW_INSPECTION_PRIORITY_PATTERN_CODE = "review_inspection_priority"
  final static var REVIEW_INSPECTION_UW_PATTERN_CODE = "review_inspection_uw"
  final static var REVIEW_INSPECTION_CS_PATTERN_CODE = "review_inspection_cs"
  final static var SUPER_USER = "su"
  final static var MAJOR_ISSUES_FOLDER = "Major UW Inspection Issues"
  final static var MINOR_ISSUES_FOLDER = "Minor UW Inspection Issues"
  final static var RATING_OR_COVERAGE_ISSUES_FOLDER = "Rating or Coverage Issues"
  final static var INSPECTION_ORDERED = "Inspection Ordered"
  var CLASS_NAME=PropertyInspectionsReportsInboundFileProcessingPlugin.Type.DisplayName

  /**
   * This function reads the Inspections ordered report from the different folder and process it and upload the report to Onbase
   * Once the upload of the document is done , it will create the activity and assign it to the specified queues
   */
  override function process(data: Object) {
    LOGGER.info("Entering process() of "+CLASS_NAME)
    var fileName = (data as java.nio.file.Path ).toAbsolutePath().getFileName() as String
    var policyNumber = fileName.substring(0,14)
    var policyPeriod = Query.make(PolicyPeriod).compare(PolicyPeriod#PolicyNumber, Equals, policyNumber).select().last()
    uploadDocumentOnbase(data,fileName)
    gw.transaction.Transaction.runWithNewBundle(\bundle ->{
      bundle.add(policyPeriod)
      var filePath = (data as java.nio.file.Path ).toAbsolutePath() as String
      policyPeriod.addNote(NoteTopicType.TC_GENERAL, "inspection has been received","inspection has been received")

      if(filePath.containsIgnoreCase(MAJOR_ISSUES_FOLDER)){
        var activity = ActivityUtil.createActivityAutomatically(policyPeriod, REVIEW_INSPECTION_PRIORITY_PATTERN_CODE)
        if(activity.canAssign()){
          ActivityUtil.assignActivityToQueue(PRIORITY_INSPECTION_REVIEW_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
        }
      } else if(filePath.containsIgnoreCase(MINOR_ISSUES_FOLDER)){
        var activity = ActivityUtil.createActivityAutomatically(policyPeriod, REVIEW_INSPECTION_UW_PATTERN_CODE)
        if(activity.canAssign()){
          ActivityUtil.assignActivityToQueue(UW_INSPECTION_REVIEW_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
        }
      } else if(filePath.containsIgnoreCase(RATING_OR_COVERAGE_ISSUES_FOLDER)){
        var activity = ActivityUtil.createActivityAutomatically(policyPeriod, REVIEW_INSPECTION_CS_PATTERN_CODE)
        if(activity.canAssign()){
          ActivityUtil.assignActivityToQueue(CSR_INSPECTION_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
        }
      }
      completeActivity(policyPeriod)
      bundle.commit()
    }, SUPER_USER)

  }

  /**
   * This function upload the file received from Inspections vendors to Onbase
   */
  private static function uploadDocumentOnbase(data : Object, fileName : String){
    LOGGER.info("Entering uploadDocumentOnbase() of PropertyInspectionsReportsInboundFileProcessingPlugin")
    var docContentSource =  Plugins.get("IDocumentContentSource") as IDocumentContentSource
    var documentDTO = new DocumentDTO()
    try{
      if(Policy.finder.findPolicyByPolicyNumber(fileName.substring(0,14))!=null){
        documentDTO.Policy = Policy.finder.findPolicyByPolicyNumber(fileName.substring(0,14))
        documentDTO.Description = "Inspection Report Received"
        var filePath = (data as java.nio.file.Path ).toAbsolutePath()
        var file = new File(filePath as String)
        documentDTO.File = file
        documentDTO.OnBaseDocumentType = typekey.OnBaseDocumentType_Ext.TC_OUT_CORR
        documentDTO.OnBaseDocumentSubype = typekey.OnBaseDocumentSubtype_Ext.TC_OUTCORR_PRIOR_CARRIER
        DocumentUtil.createDocument(documentDTO)
        LOGGER.info("Document upload is done :: "+fileName.substring(0,14))
      }
    } catch(ex : Exception)  {
      var fieldError = new FieldErrorInformation()  {:FieldName = "document upload", :FieldValue = fileName.substring(0,14)}
      ExceptionUtil.throwException(UnaErrorCode.DOCUMENT_UPLOAD_FAILURE, {fieldError}, ex)
    }
    LOGGER.debug("Entering uploadDocumentOnbase() of PropertyInspectionsReportsInboundFileProcessingPlugin")
  }

  /**
   * This function Complete the activity for that policy which was created when the Inspection was ordered
   */
  private static function completeActivity(policyPeriod : PolicyPeriod){
    LOGGER.debug("Entering completeActivity() of PropertyInspectionsReportsInboundFileProcessingPlugin")
    if(ActivityUtil.hasOpenActivity(policyPeriod, INSPECTION_ORDERED)){
      var openActivityList = Activity.finder.findOpenActivitiesByPolicy(policyPeriod.Policy)
      var activity= openActivityList.where( \ elt -> elt.Subject== INSPECTION_ORDERED).last()
      var notes : Note
      gw.transaction.Transaction.runWithNewBundle(\newBundle ->{
        newBundle.add(activity)
        notes = activity.newNote()
        notes.Author =  User.util.CurrentUser
        newBundle.commit()
      })
     ActivityUtil.completeActivity(activity,notes,policyPeriod)
    }
    LOGGER.debug("Existing completeActivity() of PropertyInspectionsReportsInboundFileProcessingPlugin")
  }
}