package una.integration.mapping.document

uses una.utils.ActivityUtil
uses gw.api.database.Query

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

  final static var UNIVERSAL_INSURANCE_MANAGERS_GROUP = "Universal Insurance Manager's Inc"
  final static var POLICY_INSURED_RETURNED_MAIL = "policy_insured_returned_mail"
  final static var POLICY_MORTGAGEE_RETURNED_MAIL = "policy_mortgagee_returned_mail"
  final static var REVIEW_RISK_AND_LARGE_LOSS_REPORTS = "review_risk_and_large_loss_reports"
  final static var REVIEW_AND_APPROVE_UW_ENDORSEMENT = "review_and_approve_uw_endorsement"
  final static var POLICY_DE_ENDROSEMENT_REQUEST = "policy_de_endorsement_request"
  final static var POLICY_DE_ENDORSEMENT_REQUEST = POLICY_DE_ENDROSEMENT_REQUEST
  final static var SPECIAL_HANDLING = "special_handling"
  final static var REVIEW_INSPECTION_PRIORITY = "review_inspection_priority"
  final static var REVIEW_INSPECTION_CS = "review_inspection_cs"
  final static var REVIEW_INSPECTION_UW = "review_inspection_uw"
  final static var VENDOR_WIND_MIT_INSPECTION = "vendor_wind_mit_inspection"
  final static var CSR_QUEUE="CSR Queue"
  final static var PRIORITY_INSPECTION_REVIEW_QUEUE = "Priority  Inspection Review"
  final static var UW_INSPECTION_REVIEW_QUEUE = "UW Inspection Review"
  final static var CSR_INSPECTION_QUEUE = "CSR Inspection Queue"
  final static var SENIOR_UW_QUEUE = "Senior UW Queue"
  final static var ENDORSEMENTS_QUEUE = "Endorsements"
  final static var SPECIAL_HANDLING_QUEUE = "Special Handling"
  final static var AGENCY_POLICY_CHANGE_REQUEST = "agency_policy_change_request"
  final static var CL_UW_QUEUE = "CL UW Queue"
  final static var BOPCRP_RETURNED_EMAIL_ADD_INSD_INT = "BOPCRP_returned_mail_add_insd_int"
  final static var BOPCRP_RETURNED_MAIL_INSURED = "BOPCRP_returned_mail_insured"
  final static var BOPCRP_REVIEW_INSPECTION = "BOPCRP_review_inspection"
  final static var BOP_REVIEW_TENANT_INSP = "BOP_review_tenant_insp"
  final static var BOPCRP_CTR_RECEIVED = "BOPCRP_ctr_received"
  final static var BOPCRP_SPRINKLER_INSP_RECEIVED = "BOPCRP_sprinkler_insp_received"
  final static var AIR_CERTIFICATE_REQUIRED = "air_certificate_required"
  final static var PROTECTIVE_DEVICE_RECEIVED = "protective_device_received"
  final static var APPLIANCE_CERT_RECEIVED = "appliance_cert_received"
  final static var AFFINITY_DISCOUNT_RECEIVED = "affinity_discount_received"
  final static var APPRAISAL_FOR_SPP_RECEIVED = "appraisal_for_spp_received"
  final static var EARTHQUAKE_RETROFIT_CERTIFICATION_RECEIVED = "earthquake_retrofit_certification_received"
  final static var FLOOD_ELEVATION_CERTIFICATE = "flood_elevation_certificate_received"
  final static var FAMILY_DAY_CARE_CERTFICATE = "daycare_certificate_received"
  final static var HAZARD_REMOVAL_FORM_RECEIVED = "hazard_removal_form_received"
  final static var LETTER_OF_EXPERIENCE_RECEIVED = "letter_of_experience_received"
  final static var PHOTOS_REQUESTED_RECEIVED = "photos_requested_received"
  final static var PRE_PURCHASE_INSPECTION = "prepurchase_received"
  final static var PRIOR_CLAIM_INFORMATION_RECEIVED = "prior_claim_info_received"
  final static var PROOF_OF_PRIOR_INSURANCE_RECEIVED = "proof_of_prior_ins_received"
  final static var PROOF_OF_REPAIRS_RECEIVED = "proof_of_prior_repairs_received"
  final static var REPLACEMENT_COST_ESTIMATOR_RECEIVED = "replacement_cost_estimator_received"
  final static var REQUEST_FOR_INFORMATION_RECEIVED = "request_for_info_received"
  final static var SPRINKLER_DOCUMENTATION_RECEIVED = "sprinkler_doc_received"
  final static var STATEMENT_OF_NO_LOSS_RECEIVED = "stmt_no_loss_received"
  final static var SYSTEM_INSPECTION_FORM_4_POINT_RECEIVED = "system_insp_4pt_received"
  final static var WINDSTORM_HURRICANE_AND_HAIL_EXCLUSION_RECEIVED = "wind_hurricane_hail_rej_received"
  final static var OTHER_INCOMING_RECEIVED = "other_incoming_received"
  final static var INCORR_OTHER_INCOMING_RECEIVED = OTHER_INCOMING_RECEIVED
  final static var STATEMENT_OF_NO_LOSS = "BOPCRP_stmt_no_loss_received"
  function mapDocActivity(document: Document, period: PolicyPeriod) {

    if(document.OnBaseDocumentType == typekey.OnBaseDocumentType_Ext.TC_IN_CORR){
      createInCorrespondenceDocActivity(document , period)
    }
  }

  function createInCorrespondenceDocActivity(document: Document, period: PolicyPeriod) {

    var patternCode: String = null
    var queue: String = null

    switch (document.OnBaseDocumentSubtype) {

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_LETTER:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_WITH_FORWARDING_ORDER:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_ADDITIONAL_INSURED:
        patternCode = POLICY_INSURED_RETURNED_MAIL
        queue = CSR_QUEUE
        break

      //  Mortgagee Returned mail
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_MORTGAGE:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_MORTGAGE_FORWARDED:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_LIENHOLDER:
        patternCode = POLICY_MORTGAGEE_RETURNED_MAIL
        queue = CSR_QUEUE
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
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_AGE_CHANGE_REQUEST:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_MORTGAGE_CHANGE_REQUEST:// fall through
      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ELEVATION_CERTIFICATE:
          patternCode = POLICY_DE_ENDORSEMENT_REQUEST
          queue = CSR_QUEUE
          break

      //  Review Risk and  large loss reports
      case typekey.OnBaseDocumentSubtype_Ext.TC_RRLL_RISK_REPORT_AND_LARGE_LOSS:
          patternCode = REVIEW_RISK_AND_LARGE_LOSS_REPORTS
          queue = SENIOR_UW_QUEUE
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
      createActivityAndAssignToQueue(period, patternCode, queue)
    }
  }

  function createInspectionsDocActivity(document: Document, period: PolicyPeriod) {

    var patternCode: String = null
    var queue: String = null

    switch (document.OnBaseDocumentSubtype) {

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_PRIORITY_PROPERTY_INSPECTION:
          patternCode = REVIEW_INSPECTION_PRIORITY
          queue = PRIORITY_INSPECTION_REVIEW_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_POLICY_REPORT_REVIEW:
          patternCode = REVIEW_INSPECTION_CS
          queue = CSR_INSPECTION_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_UW_INSPECTION:
          patternCode = REVIEW_INSPECTION_UW
          queue = UW_INSPECTION_REVIEW_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_WIND_MITIGATION_INSPECTION:
          patternCode = VENDOR_WIND_MIT_INSPECTION
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_ENDREQ_AGENT_CHANGE_REQUEST:
          patternCode = AGENCY_POLICY_CHANGE_REQUEST
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ENDORSEMENT_REQUEST:
          patternCode = POLICY_DE_ENDROSEMENT_REQUEST
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_RETMAIL_RETURNED_MAIL_LETTER:
          patternCode = POLICY_INSURED_RETURNED_MAIL
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_WIND_MITIGATION_INSPECTION:
          patternCode = VENDOR_WIND_MIT_INSPECTION
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_ADDITIONAL_INSURED:
          patternCode = BOPCRP_RETURNED_EMAIL_ADD_INSD_INT
          queue = CL_UW_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_ADDITIONAL_INSURED:
          patternCode = BOPCRP_RETURNED_MAIL_INSURED
          queue = CL_UW_QUEUE
          break


      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_POLICY_REPORT_REVIEW:
          patternCode = BOPCRP_REVIEW_INSPECTION
          queue = CL_UW_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_INSURED_TENANT_CREDIT:
          patternCode = BOP_REVIEW_TENANT_INSP
          queue = CL_UW_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_CONSENT_TO_RATE:
          patternCode = BOPCRP_CTR_RECEIVED
          queue = CL_UW_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SPRINKLER_DOCUMENTATION:
          patternCode = BOPCRP_SPRINKLER_INSP_RECEIVED
          queue = CL_UW_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_AIR_TESTING_CERTIFICATE:
          patternCode = AIR_CERTIFICATE_REQUIRED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROTECTIVE_DEVICE_CREDIT:
          patternCode = PROTECTIVE_DEVICE_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_APPLIANCE_CERTIFICATION:
          patternCode = APPLIANCE_CERT_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_AFFINITY_DISCOUNT:
          patternCode = AFFINITY_DISCOUNT_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_APPRAISAL_FOR_SCHEDULED_PERSONAL_PROPERTY:
          patternCode = APPRAISAL_FOR_SPP_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_EARTHQUAKE_RETROFIT_CERTIFICATION:
          patternCode = EARTHQUAKE_RETROFIT_CERTIFICATION_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ELEVATION_CERTIFICATE:
          patternCode = FLOOD_ELEVATION_CERTIFICATE
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_FAMILY_DAY_CARE_CERTFICATE:
          patternCode = FAMILY_DAY_CARE_CERTFICATE
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_HAZARD_REMOVAL_FORM:
          patternCode = HAZARD_REMOVAL_FORM_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_LETTER_OF_EXPERIENCE:
          patternCode = LETTER_OF_EXPERIENCE_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PHOTOS_REQUESTED :
          patternCode = PHOTOS_REQUESTED_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PRE_PURCHASE_INSPECTION :
          patternCode = PRE_PURCHASE_INSPECTION
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PRIOR_CLAIM_INFORMATION:
          patternCode = PRIOR_CLAIM_INFORMATION_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_PRIOR_INSURANCE:
          patternCode = PROOF_OF_PRIOR_INSURANCE_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_REPAIRS:
          patternCode = PROOF_OF_REPAIRS_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REPLACEMENT_COST_ESTIMATOR:
          patternCode = REPLACEMENT_COST_ESTIMATOR_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REQUEST_FOR_INFORMATION:
          patternCode = REQUEST_FOR_INFORMATION_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REQUEST_FOR_INFORMATION:
          patternCode = REQUEST_FOR_INFORMATION_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SPRINKLER_DOCUMENTATION:
          patternCode = SPRINKLER_DOCUMENTATION_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_STATEMENT_OF_NO_LOSS:
          patternCode = STATEMENT_OF_NO_LOSS_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SYSTEM_INSPECTION_FORM_4_POINT:
          patternCode = SYSTEM_INSPECTION_FORM_4_POINT_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_WINDSTORM_HURRICANE_AND_HAIL_EXCLUSION:
          patternCode = WINDSTORM_HURRICANE_AND_HAIL_EXCLUSION_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_OTHER_INCOMING:
          patternCode = INCORR_OTHER_INCOMING_RECEIVED
          queue = CSR_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_OTHER_INCOMING:
          patternCode = OTHER_INCOMING_RECEIVED
          queue = CL_UW_QUEUE
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_STATEMENT_OF_NO_LOSS:
          patternCode = STATEMENT_OF_NO_LOSS
          queue = CL_UW_QUEUE
          break


    }

    if(patternCode != null && queue != null) {
      createActivityAndAssignToQueue(period, patternCode, queue)
    }
  }

  private function createActivityAndAssignToQueue(period: PolicyPeriod, patternCode: String, queue: String) {
    var activity = ActivityUtil.createActivityAutomatically(period, patternCode)
    // As the queue is mapped to different Groups
    var assignableQueue = Query.make(AssignableQueue).compare(AssignableQueue#Name, Equals, queue).select().AtMostOneRow
    if(assignableQueue!=null && activity.canAssign()){
      ActivityUtil.assignActivityToQueue(queue, (assignableQueue.Group) as String,activity)
    }
  }

}