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
  final static var POLICY_DE_ENDORSEMENT_REQUEST = "policy_de_endorsement_request"
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