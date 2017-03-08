package una.utils

uses java.util.Queue
uses gw.api.database.Query
uses java.lang.Exception

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
    }
    return activity
  }


  //Function to complete/close open activities
  public static function completeActivity(activity:Activity, note:Note, pp:PolicyPeriod){
    gw.api.web.activity.ActivityUtil.completeActivity(activity, note);
    activity.Bundle.commit()
  }

  public static function assignActivityToQueue(queueName : String, groupName : String, activity : Activity){
    var group = Query.make(Group).compare(Group#Name, Equals, groupName).select().AtMostOneRow
    var assignableQueue= group.AssignableQueues.firstWhere( \ elt -> elt.Name==queueName)
    try {
      activity.assignActivityToQueue(assignableQueue,group)
    }  catch  (var e: Exception)  {
      e.printStackTrace()
    }
  }

}