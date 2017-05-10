package una.config.activity

uses una.utils.ActivityUtil
uses java.util.Map
uses gw.api.email.EmailContact
uses gw.api.email.EmailUtil

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 12/20/16
 * Time: 3:11 PM
 * To change this template use File | Settings | File Templates.
 *
 * TLV - refactored 5/9/17  (renamed from OFACUtil.gs to OFACWorkController.gs)
 */
class OFACWorkController {
  private static final var OFAC_ACTIVITY_PATTERN_CODES_TO_QUEUE : Map<String, String> = {"OFAC1" -> "CSR Queue", "OFAC2" -> "Compliance OFAC", "OFAC3" -> "CSR Manager Queue"}
  private static final var ACTIVITY_PATTERN_KEYS = {"OFAC1", "OFAC2", "OFAC3"}
  private static final var NUM_STEPS = ACTIVITY_PATTERN_KEYS.size()
  private static final var OFAC_COMPLIANCE_EMAIL = "Compliance@uihna.com"

  public function beginWorkItemFlow(branch : PolicyPeriod, ofacContact : OfacContact_Ext){
    advanceWorkItemFlow(null, ofacContact)
  }

  public function advanceWorkItems(activities : Activity[]){
    activities?.each( \ activity -> {
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
          activity = bundle.add(activity)
          advanceWorkItemFlow(activity, activity.AssociatedEntity as OfacContact_Ext)
        }, User.util.CurrentUser)
      })
  }

  private function getNextPatternCode(completedActivityPattern : String) : String{
    var result : String

    if(completedActivityPattern == null){
      result = ACTIVITY_PATTERN_KEYS.first()
    }else{
      var nextActivityPlace = ACTIVITY_PATTERN_KEYS.indexOf(completedActivityPattern) + 1

      if(nextActivityPlace < NUM_STEPS){
        result = ACTIVITY_PATTERN_KEYS.get(nextActivityPlace)
      }
    }

    return result
  }

  private function advanceWorkItemFlow(completedActivity : Activity, ofacContact : OfacContact_Ext){
    var nextPatternCode = getNextPatternCode(completedActivity.ActivityPattern.Code)

    if(nextPatternCode != null){
      var pattern = ActivityPattern.finder.findActivityPatternsByCode(nextPatternCode).single()
      var queue = OFAC_ACTIVITY_PATTERN_CODES_TO_QUEUE.get(nextPatternCode)

      var nextActivity = pattern.createJobActivity(gw.transaction.Transaction.Current, ofacContact.Branch.Job, null, null, null, null, null, null, null)

      nextActivity.AssociatedEntity = ofacContact

      if(nextActivity != null){
        ActivityUtil.assignActivityToQueue(queue, queue, nextActivity)
      }

      if(completedActivity.ActivityPattern.Code == "OFAC1"){
        sendEmail(completedActivity)
      }
    }
  }

  private function sendEmail(completedActivity : Activity){
    var template =  gw.plugin.Plugins.get(gw.plugin.email.IEmailTemplateSource).getEmailTemplate("OFACComplianceEmail.gosu")
    var csrContact = completedActivity.UpdateUser.Contact
    var ofacContact = completedActivity.AssociatedEntity as OfacContact_Ext

    var emailTemplateArgsMap = {"csrName" -> csrContact.DisplayName, "csrEmail" -> csrContact.EmailAddress1 == null ? "No Email On File" : csrContact.EmailAddress1, "ofacAlertContactName" -> ofacContact.Contact.DisplayName, "accountNumber" -> ofacContact.Branch.Policy.Account.AccountNumber}

    var email = new gw.api.email.Email()
    var emailContact = new EmailContact(){:EmailAddress = "Compliance@uihna.com"}
    email.addToRecipient(emailContact)
    email.Html = true

    email.useEmailTemplate(template, emailTemplateArgsMap)

    EmailUtil.sendEmailWithBody(null, email)
  }
}