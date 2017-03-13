package una.integration.mapping.document

uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 3/1/17
 * Time: 11:43 AM
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
  final static var PRIORITY_INSPECTION_REVIEW_QUEUE = "Priority Inspection Review"
  final static var UW_INSPECTION_REVIEW_QUEUE = "UW Inspection Review"
  final static var CSR_INSPECTION_QUEUE = "CSR Inspection Queue"
  final static var SENIOR_UW_QUEUE = "Senior UW Queue"
  final static var ENDORSEMENTS_QUEUE = "Endorsements"
  final static var SPECIAL_HANDLING_QUEUE = "Special Handling"

  function mapDocActivity(document: Document, period: PolicyPeriod) {

    if(document.OnBaseDocumentType == typekey.OnBaseDocumentType_Ext.TC_IN_CORR)
      createInCorrespondenceDocActivity(document , period)

     }

  function createInCorrespondenceDocActivity(document: Document, period: PolicyPeriod) {
    switch (document.OnBaseDocumentSubtype) {

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_LETTER:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_INSURED_RETURNED_MAIL)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_MORTGAGE:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_MORTGAGEE_RETURNED_MAIL)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_MORTGAGE_FORWARDED:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_MORTGAGEE_RETURNED_MAIL)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_ADDITIONAL_INSURED:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_INSURED_RETURNED_MAIL)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_LIENHOLDER:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_MORTGAGEE_RETURNED_MAIL)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_RRLL_RISK_REPORT_AND_LARGE_LOSS:
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_RISK_AND_LARGE_LOSS_REPORTS)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(SENIOR_UW_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PHOTOS_REQUESTED:
      if(!DocumentActivityHelper.checkAgentNumber(document,period)){
        var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
        if(activity.canAssign()){
          ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
        }
      }
       break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_HAZARD_REMOVAL_FORM:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_INSPECTION_CONDITIONS:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_AFFINITY_DISCOUNT:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_HAIL_RESISTANT:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_INSURED_TENANT_CREDIT:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_MULTILINE_DISCOUNT:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROTECTIVE_DEVICE_CREDIT:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_WIND_MIT_CREDIT:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REQUEST_FOR_INFORMATION:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SPRINKLER_DOCUMENTATION:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_CONSENT_TO_RATE:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_OTHER_INCOMING:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ENDORSEMENT_REQUEST:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_AGE_CHANGE_REQUEST:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_MORTGAGE_CHANGE_REQUEST:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_COMPLAINT:
          var activity = ActivityUtil.createActivityAutomatically(period, SPECIAL_HANDLING)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(SPECIAL_HANDLING_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROTECTION_CLASS_DISPUTE:
          var activity = ActivityUtil.createActivityAutomatically(period, SPECIAL_HANDLING)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(SPECIAL_HANDLING_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_AIR_TESTING_CERTIFICATE:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_APPLIANCE_CERTIFICATION:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_APPRAISAL_FOR_SCHEDULED_PERSONAL_PROPERTY:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_EARTHQUAKE_RETROFIT_CERTIFICATION:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ELEVATION_CERTIFICATE:
          var activity = ActivityUtil.createActivityAutomatically(period, POLICY_DE_ENDORSEMENT_REQUEST)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_LETTER_OF_EXPERIENCE:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PRIOR_CLAIM_INFORMATION:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PRE_PURCHASE_INSPECTION:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_PRIOR_INSURANCE:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_REPAIRS:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REJECTION_OF_PERSONAL_PROPERTY_COVERAGE:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REJECTION_OF_WINDSTOM_COVERAGE:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REPLACEMENT_COST_ESTIMATOR:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_STATEMENT_OF_NO_LOSS:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_STATEMENT_OF_NO_LOSS:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SYSTEM_INSPECTION_FORM_4_POINT:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_WINDSTORM_HURRICANE_AND_HAIL_EXCLUSION:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_FAMILY_DAY_CARE_CERTFICATE:
        if(!DocumentActivityHelper.checkAgentNumber(document,period)){
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_AND_APPROVE_UW_ENDORSEMENT)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(ENDORSEMENTS_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
        }
          break
    }
  }



  function createInspectionsDocActivity(document: Document, period: PolicyPeriod) {
    switch (document.OnBaseDocumentSubtype) {

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_PRIORITY_PROPERTY_INSPECTION:
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_INSPECTION_PRIORITY)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(PRIORITY_INSPECTION_REVIEW_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_POLICY_REPORT_REVIEW:
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_INSPECTION_CS)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_INSPECTION_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_UW_INSPECTION:
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_INSPECTION_UW)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(UW_INSPECTION_REVIEW_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_WIND_MITIGATION_INSPECTION:
          var activity = ActivityUtil.createActivityAutomatically(period, VENDOR_WIND_MIT_INSPECTION)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(CSR_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_PRIORITY_PROPERTY_INSPECTION:
          var activity = ActivityUtil.createActivityAutomatically(period, REVIEW_INSPECTION_PRIORITY)
          if(activity.canAssign()){
            ActivityUtil.assignActivityToQueue(PRIORITY_INSPECTION_REVIEW_QUEUE, UNIVERSAL_INSURANCE_MANAGERS_GROUP,activity)
          }
          break

    }
  }

}