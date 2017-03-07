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

  function mapDocActivity(document: Document, period: PolicyPeriod) {

    if(document.OnBaseDocumentType == typekey.OnBaseDocumentType_Ext.TC_IN_CORR)
      createInCorrespondenceDocActivity(document , period)

     }


  function createInCorrespondenceDocActivity(document: Document, period: PolicyPeriod) {
    switch (document.OnBaseDocumentSubtype) {

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_LETTER:
          ActivityUtil.createActivityAutomatically(period, "policy_insured_returned_mail")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_MORTGAGE:
          ActivityUtil.createActivityAutomatically(period, "policy_mortgagee_returned_mail")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_MORTGAGE_FORWARDED:
          ActivityUtil.createActivityAutomatically(period, "policy_mortgagee_returned_mail")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_ADDITIONAL_INSURED:
          ActivityUtil.createActivityAutomatically(period, "policy_insured_returned_mail")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_RETURNED_MAIL_LIENHOLDER:
          ActivityUtil.createActivityAutomatically(period, "policy_mortgagee_returned_mail")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_RRLL_RISK_REPORT_AND_LARGE_LOSS:
          ActivityUtil.createActivityAutomatically(period, "review_risk_and_large_loss_reports")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PHOTOS_REQUESTED:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_HAZARD_REMOVAL_FORM:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_INSPECTION_CONDITIONS:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_AFFINITY_DISCOUNT:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_HAIL_RESISTANT:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_INSURED_TENANT_CREDIT:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_MULTILINE_DISCOUNT:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROTECTIVE_DEVICE_CREDIT:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_WIND_MIT_CREDIT:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REQUEST_FOR_INFORMATION:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SPRINKLER_DOCUMENTATION:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_CONSENT_TO_RATE:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_OTHER_INCOMING:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ENDORSEMENT_REQUEST:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_AGE_CHANGE_REQUEST:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_MORTGAGE_CHANGE_REQUEST:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_COMPLAINT:
          ActivityUtil.createActivityAutomatically(period, "special_handling")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROTECTION_CLASS_DISPUTE:
          ActivityUtil.createActivityAutomatically(period, "special_handling")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_AIR_TESTING_CERTIFICATE:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_APPLIANCE_CERTIFICATION:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_APPRAISAL_FOR_SCHEDULED_PERSONAL_PROPERTY:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_EARTHQUAKE_RETROFIT_CERTIFICATION:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_ELEVATION_CERTIFICATE:
          ActivityUtil.createActivityAutomatically(period, "policy_de_endorsement_request")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_LETTER_OF_EXPERIENCE:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PRIOR_CLAIM_INFORMATION:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PRE_PURCHASE_INSPECTION:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_PRIOR_INSURANCE:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_PROOF_OF_REPAIRS:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REJECTION_OF_PERSONAL_PROPERTY_COVERAGE:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REJECTION_OF_WINDSTOM_COVERAGE:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_REPLACEMENT_COST_ESTIMATOR:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_STATEMENT_OF_NO_LOSS:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_STATEMENT_OF_NO_LOSS:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_SYSTEM_INSPECTION_FORM_4_POINT:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_WINDSTORM_HURRICANE_AND_HAIL_EXCLUSION:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INCORR_FAMILY_DAY_CARE_CERTFICATE:
          ActivityUtil.createActivityAutomatically(period, "review_and_approve_uw_endorsement")
          break
    }
  }



  function createInspectionsDocActivity(document: Document, period: PolicyPeriod) {
    switch (document.OnBaseDocumentSubtype) {

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_PRIORITY_PROPERTY_INSPECTION:
          ActivityUtil.createActivityAutomatically(period, "review_inspection_priority")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_POLICY_REPORT_REVIEW:
          ActivityUtil.createActivityAutomatically(period, "rreview_inspection_cs")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_UW_INSPECTION:
          ActivityUtil.createActivityAutomatically(period, "review_inspection_uw")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_WIND_MITIGATION_INSPECTION:
          ActivityUtil.createActivityAutomatically(period, "vendor_wind_mit_inspection")
          break

      case typekey.OnBaseDocumentSubtype_Ext.TC_INSP_PRIORITY_PROPERTY_INSPECTION:
          ActivityUtil.createActivityAutomatically(period, "review_inspection_priority")
          break



    }
  }
}