package una.utils

uses java.util.Queue
uses gw.api.database.Query
uses java.lang.Exception
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.exception.FieldErrorInformation
uses una.integration.util.propertyinspections.UnaErrorCode

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 01/23/17
 * Time: 4:10 PM
 */
class ActivityUtil {


  //Function to check open activities
  public static function hasOpenActivity(period:PolicyPeriod ,subject :String):Boolean{

    var openActivities =Activity.finder.findOpenActivitiesByPolicy(period.Policy)
    for(activity in openActivities){
    if(activity.Subject?.equalsIgnoreCase(subject) and activity.Status=="Open")
      return true
    }
    return false
  }

 /**
  * The activity gets created automatically in the backend. The function calls the OOTB method for creating an activity
  *and passes the current bundle.
  */
  public static function createActivityAutomatically(policyPeriod:PolicyPeriod, patternCode:String):Activity
  {
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode(patternCode)
    var activity:Activity = null
    if(activityPattern != null)
    {
      activity = activityPattern.createJobActivity(gw.transaction.Transaction.getCurrent(),policyPeriod.Job,null,null,"",null,null,null,null)
    } else{
      var fieldError = new FieldErrorInformation()  {:FieldName = "Activity Pattern Code", :FieldValue = patternCode}
      ExceptionUtil.throwException(UnaErrorCode.PATTERN_CODE_NOT_PRESENT, {fieldError})
    }
    return activity
  }


  //Function to complete/close open activities
  public static function completeActivity(activity:Activity, note:Note, pp:PolicyPeriod){
    gw.api.web.activity.ActivityUtil.completeActivity(activity, note);
    activity.Bundle.commit()
  }

  /**
   * The Activity gets assigned to queue.  Takes queue name, group name and the activity as parameters
   */
  public static function assignActivityToQueue(queueName : String, groupName : String, activity : Activity){

      var group = Query.make(Group).compare(Group#Name, Equals, groupName).select().AtMostOneRow
      if(group != null){
        var assignableQueue= group.AssignableQueues.where( \ elt -> elt.Name == queueName).last()
        if(assignableQueue != null){
          activity.assignActivityToQueue(assignableQueue,group)
        } else{
          var fieldError = new FieldErrorInformation()  {:FieldName = "Assignable Queue", :FieldValue = queueName}
          ExceptionUtil.throwException(UnaErrorCode.ASSIGNABLE_QUEUE_NOT_PRESENT, {fieldError})
        }
      } else {
        var fieldError = new FieldErrorInformation()  {:FieldName = "Group", :FieldValue = groupName}
        ExceptionUtil.throwException(UnaErrorCode.GROUP_NOT_PRESENT, {fieldError})
      }
    }

  // function to create ofac Activity
  public static function createOfacActivity(period : PolicyPeriod){
    if(period.ofaccontact!= null && period.ofaccontact?.atMostOneWhere( \ elt -> elt.OverrideHit == false)?.OverrideHit != true)
    {
      var pattern = ActivityPattern.finder.findActivityPatternsByCode("OFAC1").atMostOne()
      var user = una.config.activity.OfacUtil.findUserByUsername("ofaccsr")
      if(user==null)
      {
        user = una.config.activity.OfacUtil.findUserByUsername("su")
      }
      //_branch.Job.createRoleActivity(typekey.UserRole.TC_CUSTOMERREP,pattern,"Ofac Check","Please check for OFAC hit",user)//,una.config.activity.OfacUtil.findUserByUsername("ofaccsr"))
      if(period.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="OFAC1")==null)
      {
        var activity =  pattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
        activity.assign(user.RootGroup,user)
      }

      //create custom history event
      period.createCustomHistoryEvent(CustomHistoryType.TC_OFACSUBMITTEDTOCOMPLIANCE,\->" identified on OFAC list and submitted to Compliance ")
    } //}

  }





  }