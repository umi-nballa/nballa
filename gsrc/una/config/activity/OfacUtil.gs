package una.config.activity

uses gw.api.database.Query
uses gw.api.email.Email
uses gw.api.email.EmailContact
uses gw.api.email.EmailUtil
uses java.lang.StringBuffer

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 12/20/16
 * Time: 3:11 PM
 * To change this template use File | Settings | File Templates.
 */
class OfacUtil {

  static function createPostCompleteActivityForOfac(activity:Activity[]):boolean
  {
    activity.each( \ elt -> createPostCompleteActivityForOfac(elt))
    return true
  }

  static function createPostCompleteActivityForOfac(activity:Activity):boolean
  {
    var csrowner = activity.AssignedUser.Contact as Person
    var period = activity.PolicyPeriod
    if(activity.ActivityPattern.Code.equalsIgnoreCase("ofac_csr"))
    {
      var pattern = ActivityPattern.finder.findActivityPatternsByCode("ofac_compliance").atMostOne()//ompliance").atMostOne()
      var user = una.config.activity.OfacUtil.findUserByUsername("compuser")
      //print("compliance user is "+ user)
      if(user==null)
      {
        user = una.config.activity.OfacUtil.findUserByUsername("su")
      }

      if(period.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="ofac_compliance")==null)
      {
      var cactivity = pattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
      cactivity.assign(user.RootGroup,user)
       }

      sendEmailForActivity(activity, csrowner, "csrtocomp")
    }

    if(activity.ActivityPattern.Code.equalsIgnoreCase("ofac_compliance"))
      {
          {

            var pattern = ActivityPattern.finder.findActivityPatternsByCode("ofac_uw").atMostOne()
            var user = activity.Job.Underwriter
            //print("uwreview activity user is "+ user)

            if(user==null)
            {
              user = una.config.activity.OfacUtil.findUserByUsername("su")
            }
            if(period.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="ofac_uw")==null)
            {

              var cactivity = pattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
            cactivity.assign(user.RootGroup,user)
            }

            sendEmailForActivity(activity, findUserByUsername("compuser").Contact,"comptouw")
          }
      }

    return true
  }

  static function findUserByUsername(username:String):User
  {
    var q = new Query<User>(User)
    q.join("Credential").compare("UserName",Equals,username)
    var results = q.select()
    return results.atMostOne()
  }

  static function sendEmailForActivity(activity:Activity, owner:Person, emailtype:String)
  {
   // print("activity user email " + activity.AssignedUser.Contact.EmailAddress1)
    //if(activity.AssignedUser.Contact.EmailAddress1!=null)
      {
        var email = new Email()
        var body = new StringBuffer()
        body.append("Email Content :")
        if(emailtype.equalsIgnoreCase("csrtocomp"))
          {
            email.setSubject("Upload ofac documents")
            activity.PolicyPeriod.ofaccontact.each( \ elt ->
            {
              body.append(elt.Contact.Name + "\\n")
              body.append(activity.Job.JobNumber + "\\n")
              body.append("CSR Name " + owner.FirstName + ":" + owner.LastName + "\\n")
              body.append("CSR EMAIL " + owner.EmailAddress1 + "\\n")
            }
            )
            var toemail = new EmailContact()
            toemail.setEmailAddress("skashyap@uihna.com")//setEmailAddress(activity.AssignedUser.Contact.EmailAddress1)
            email.addToRecipient(toemail)
          }

        if(emailtype.equalsIgnoreCase("comptouw"))
        {
          email.setSubject("Attempt Binding Again")
          activity.PolicyPeriod.ofaccontact.each( \ elt ->
          {
            body.append(elt.Contact.Name + "\\n")
            body.append(activity.Job.JobNumber + "\\n")
            body.append("UW Name " + owner.FirstName + ":" + owner.LastName + "\\n")
            body.append("UW EMAIL " + owner.EmailAddress1 + "\\n")
          }
          )
          var toemail = new EmailContact()
          toemail.setEmailAddress("skashyap@uihna.com")//setEmailAddress(activity.Job.Underwriter.Contact.EmailAddress1)
          email.addToRecipient(toemail)
        }

        if(emailtype.equalsIgnoreCase("rejected"))
        {
          email.setSubject("Ofac rejection")
          activity.PolicyPeriod.ofaccontact.each( \ elt ->
          {
            body.append(elt.Contact.Name + "\\n")
            body.append(activity.Job.JobNumber + "\\n")
            body.append("UW Name " + owner.FirstName + ":" + owner.LastName + "\\n")
            body.append("UW EMAIL " + owner.EmailAddress1 + "\\n")
          }
          )
          var toemail = new EmailContact()
          toemail.setEmailAddress("skashyap@uihna.com")//activity.AssignedUser.Contact.EmailAddress1)
          email.addToRecipient(toemail)
        }

        email.setBody(body)

        EmailUtil.sendEmailWithBody(activity, email)
      }
  }

}