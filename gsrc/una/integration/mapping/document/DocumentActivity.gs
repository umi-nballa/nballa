package una.integration.mapping.document

uses una.utils.ActivityUtil
uses gw.api.database.Query
uses una.logging.UnaLoggerCategory
uses onbase.api.application.DocumentLinking
uses onbase.api.Settings.DocumentLinkType
uses gw.transaction.AbstractBundleTransactionCallback
uses gw.pl.persistence.core.Bundle
uses java.lang.Exception

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 3/1/17
 * Time: 11:43 AM
 *
 * 03/30/2017 - Chris Mattox  - Refactored and added missing case for TC_INCORR_RETURNED_MAIL_WITH_FORWARDING_ORDER
 *
 */

/**
 *  Class to Map & create Doc activity
 *
 */

class DocumentActivity {

  final static var LOGGER = UnaLoggerCategory.INTEGRATION

  final static var UNIVERSAL_INSURANCE_MANAGERS_GROUP = "Universal Insurance Manager's Inc"

  public final static var POLICY_INSURED_RETURNED_MAIL: String = "policy_insured_returned_mail"
  public final static var POLICY_MORTGAGEE_RETURNED_MAIL: String = "policy_mortgagee_returned_mail"
  public final static var REVIEW_RISK_AND_LARGE_LOSS_REPORTS: String = "review_risk_and_large_loss_reports"
  public final static var REVIEW_AND_APPROVE_UW_ENDORSEMENT: String = "review_and_approve_uw_endorsement"
  public final static var POLICY_DE_ENDROSEMENT_REQUEST: String = "policy_de_endorsement_request"
  public final static var POLICY_DE_ENDORSEMENT_REQUEST: String = POLICY_DE_ENDROSEMENT_REQUEST
  public final static var SPECIAL_HANDLING: String = "special_handling"
  public final static var REVIEW_INSPECTION_PRIORITY: String = "review_inspection_priority"
  public final static var REVIEW_INSPECTION_CS: String = "review_inspection_cs"
  public final static var REVIEW_INSPECTION_UW: String = "review_inspection_uw"
  public final static var COMMERCIAL_INSPECTION: String = "commercial_rpt_inspection"
  public final static var VENDOR_WIND_MIT_INSPECTION: String = "vendor_wind_mit_inspection"

  //  Arpita added these. They were not in the document Bernie and Prathyush created. Commenting out for now, since they were added to
  // a switch that would never called.

//  public final static var AGENCY_POLICY_CHANGE_REQUEST: String = "agency_policy_change_request"
//  public final static var BOPCRP_RETURNED_EMAIL_ADD_INSD_INT: String = "BOPCRP_returned_mail_add_insd_int"
//  public final static var BOPCRP_RETURNED_MAIL_INSURED: String = "BOPCRP_returned_mail_insured"
//  public final static var BOPCRP_REVIEW_INSPECTION: String = "BOPCRP_review_inspection"
//  public final static var BOP_REVIEW_TENANT_INSP: String = "BOP_review_tenant_insp"
//  public final static var BOPCRP_CTR_RECEIVED: String = "BOPCRP_ctr_received"
//  public final static var BOPCRP_SPRINKLER_INSP_RECEIVED: String = "BOPCRP_sprinkler_insp_received"
//  public final static var AIR_CERTIFICATE_REQUIRED: String = "air_certificate_required"
//  public final static var PROTECTIVE_DEVICE_RECEIVED: String = "protective_device_received"
//  public final static var APPLIANCE_CERT_RECEIVED: String = "appliance_cert_received"
//  public final static var AFFINITY_DISCOUNT_RECEIVED: String = "affinity_discount_received"
//  public final static var APPRAISAL_FOR_SPP_RECEIVED: String = "appraisal_for_spp_received"
//  public final static var EARTHQUAKE_RETROFIT_CERTIFICATION_RECEIVED: String = "earthquake_retrofit_certification_received"
//  public final static var FLOOD_ELEVATION_CERTIFICATE: String = "flood_elevation_certificate_received"
//  public final static var FAMILY_DAY_CARE_CERTFICATE: String = "daycare_certificate_received"
//  public final static var HAZARD_REMOVAL_FORM_RECEIVED: String = "hazard_removal_form_received"
//  public final static var LETTER_OF_EXPERIENCE_RECEIVED: String = "letter_of_experience_received"
//  public final static var PHOTOS_REQUESTED_RECEIVED: String = "photos_requested_received"
//  public final static var PRE_PURCHASE_INSPECTION: String = "prepurchase_received"
//  public final static var PRIOR_CLAIM_INFORMATION_RECEIVED: String = "prior_claim_info_received"
//  public final static var PROOF_OF_PRIOR_INSURANCE_RECEIVED: String = "proof_of_prior_ins_received"
//  public final static var PROOF_OF_REPAIRS_RECEIVED: String = "proof_of_prior_repairs_received"
//  public final static var REPLACEMENT_COST_ESTIMATOR_RECEIVED: String = "replacement_cost_estimator_received"
//  public final static var REQUEST_FOR_INFORMATION_RECEIVED: String = "request_for_info_received"
//  public final static var SPRINKLER_DOCUMENTATION_RECEIVED: String = "sprinkler_doc_received"
//  public final static var STATEMENT_OF_NO_LOSS_RECEIVED: String = "stmt_no_loss_received"
//  public final static var SYSTEM_INSPECTION_FORM_4_POINT_RECEIVED: String = "system_insp_4pt_received"
//  public final static var WINDSTORM_HURRICANE_AND_HAIL_EXCLUSION_RECEIVED: String = "wind_hurricane_hail_rej_received"
//  public final static var OTHER_INCOMING_RECEIVED: String = "other_incoming_received"
//  public final static var INCORR_OTHER_INCOMING_RECEIVED: String = OTHER_INCOMING_RECEIVED
//  public final static var STATEMENT_OF_NO_LOSS: String = "BOPCRP_stmt_no_loss_received"

  // Queues
  public final static var UW_INSPECTION_REVIEW_QUEUE: String = "UW Inspection Review"
  public final static var ENDORSEMENTS_QUEUE: String = "Endorsements"
  public final static var SPECIAL_HANDLING_QUEUE: String = "Special Handling"
  
  static function mapDocActivity(document: Document, period: PolicyPeriod) {

    LOGGER.debug("Map Document to an Activity - Doc Type:{}, SubType:{}", document.OnBaseDocumentType, document.OnBaseDocumentSubtype)
    switch(document.OnBaseDocumentType) {
      
      // Incoming Correspondence documents
      case typekey.OnBaseDocumentType_Ext.TC_IN_CORR:
          createInCorrespondenceDocActivity(document , period)
      break
      // Inspection documents
      case typekey.OnBaseDocumentType_Ext.TC_INSPECTIONS:
          createInspectionsDocActivity(document , period)
      break
      
      case typekey.OnBaseDocumentType_Ext.TC_RISK_RPT_LRG_LOSS:
          //  Review Risk and  large loss reports
          if(document.OnBaseDocumentSubtype == typekey.OnBaseDocumentSubtype_Ext.TC_RRLL_RISK_REPORT_AND_LARGE_LOSS) {
            createActivityAndAssignToQueue(document, period, REVIEW_RISK_AND_LARGE_LOSS_REPORTS, ActivityUtil.ACTIVITY_QUEUE.SENIOR_UW)
          }
      break
    }
    
  }

  static function createInCorrespondenceDocActivity(document: Document, period: PolicyPeriod) {

    var patternCode: String = null
    var queue: String = null

    switch (document.OnBaseDocumentSubtype) {

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_LETTER:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_WITH_FORWARDING_ORDER:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_ADDITIONAL_INSURED:
        patternCode = POLICY_INSURED_RETURNED_MAIL
        queue = ActivityUtil.ACTIVITY_QUEUE.CSR
        break

      //  Mortgagee Returned mail
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_MORTGAGE:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_MORTGAGE_FORWARDED:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_LIENHOLDER:
        patternCode = POLICY_MORTGAGEE_RETURNED_MAIL
        queue = ActivityUtil.ACTIVITY_QUEUE.CSR
        break

        //  Policy DE Endorsement Request
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_AFFINITY_DISCOUNT:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_HAIL_RESISTANT:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_INSURED_TENANT_CREDIT:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_MULTILINE_DISCOUNT:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROTECTIVE_DEVICE_CREDIT:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_WIND_MIT_CREDIT:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SPRINKLER_DOCUMENTATION:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_CONSENT_TO_RATE:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_OTHER_INCOMING:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ENDORSEMENT_REQUEST:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_AGENT_CHANGE_REQUEST:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_MORTGAGE_CHANGE_REQUEST:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ELEVATION_CERTIFICATE:
          patternCode = POLICY_DE_ENDORSEMENT_REQUEST
          queue = ActivityUtil.ACTIVITY_QUEUE.CSR
          break


      //  Review and approve UW Endorsement
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PHOTOS_REQUESTED:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_HAZARD_REMOVAL_FORM:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_INSPECTION_CONDITIONS:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REQUEST_FOR_INFORMATION:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_AIR_TESTING_CERTIFICATE:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_APPLIANCE_CERTIFICATION:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_APPRAISAL_FOR_SCHEDULED_PERSONAL_PROPERTY:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_EARTHQUAKE_RETROFIT_CERTIFICATION:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_LETTER_OF_EXPERIENCE:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PRIOR_CLAIM_INFORMATION:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PRE_PURCHASE_INSPECTION:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_PRIOR_INSURANCE:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_REPAIRS:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REJECTION_OF_PERSONAL_PROPERTY_COVERAGE:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REJECTION_OF_WINDSTOM_COVERAGE:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REPLACEMENT_COST_ESTIMATOR:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_STATEMENT_OF_NO_LOSS:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SYSTEM_INSPECTION_FORM_4_POINT:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_WINDSTORM_HURRICANE_AND_HAIL_EXCLUSION:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_FAMILY_DAY_CARE_CERTFICATE:
          if(!DocumentActivityHelper.checkAgentNumber(document,period)){
            patternCode = REVIEW_AND_APPROVE_UW_ENDORSEMENT
            queue = ENDORSEMENTS_QUEUE
          }
       break

      //  Special Handling
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_COMPLAINT:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROTECTION_CLASS_DISPUTE:
          patternCode = SPECIAL_HANDLING
          queue = SPECIAL_HANDLING_QUEUE
          break
    }

    if(patternCode != null && queue != null) {
      createActivityAndAssignToQueue(document, period, patternCode, queue)
    }
  }

  static function createInspectionsDocActivity(document: Document, period: PolicyPeriod) {

    var patternCode: String = null
    var queue: String = null

    switch (document.OnBaseDocumentSubtype) {

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_PRIORITY_PROPERTY_INSPECTION:
          patternCode = REVIEW_INSPECTION_PRIORITY
          queue = ActivityUtil.ACTIVITY_QUEUE.PRIORITY_INSPECTION_REVIEW
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_POLICY_REPORT_REVIEW:
          patternCode = REVIEW_INSPECTION_CS
          queue = ActivityUtil.ACTIVITY_QUEUE.CSR_INSPECTION
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_UW_INSPECTION:
          patternCode = REVIEW_INSPECTION_UW
          queue = ActivityUtil.ACTIVITY_QUEUE.UW_INSPECTION_REVIEW
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_WIND_MITIGATION_INSPECTION:
          patternCode = VENDOR_WIND_MIT_INSPECTION
          queue = ActivityUtil.ACTIVITY_QUEUE.CSR
          //  Create a note. As per Gary London "Wind mitigation inspections are handled by Don Meyer Inspections, using the note title “DMI Wind Mit Insp Recd” should be acceptable."
          //  If the vendor changes, we should just remove the DMI prefix
          period.Policy.newDMIWindMitInspRecd_ExtNote().Body = "A new Wind Mitigation Inspection document has be received."
          break
      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_COMMERCIAL_REPORT:
          patternCode = COMMERCIAL_INSPECTION
          queue = ActivityUtil.ACTIVITY_QUEUE.CSR
          break
    }

    if(patternCode != null && queue != null) {
      createActivityAndAssignToQueue(document, period, patternCode, queue)
    }
  }

  private static function createActivityAndAssignToQueue(document: Document, period: PolicyPeriod, patternCode: String, queue: String) {
     try {

       var activity: Activity = null

       gw.transaction.Transaction.runWithNewBundle(\bun -> {
         activity = ActivityUtil.createActivityAutomatically(period, patternCode)

         // As the queue is mapped to different Groups
         var assignableQueue = Query.make(AssignableQueue).compare(AssignableQueue#Name, Equals, queue).select().AtMostOneRow
         if(assignableQueue!=null && activity.canAssign()){
           LOGGER.debug("Assign Activity:{} to Queue:{}", patternCode, queue)
           ActivityUtil.assignActivityToQueue(queue, (assignableQueue.Group) as String,activity)
         }
       })

       if(activity != null) {
         var docLinking = new DocumentLinking()
         docLinking.linkDocumentToEntity(activity, document, DocumentLinkType.activityid)
       }
     } catch(e: Exception) {

     }
  }

}