package una.utils

uses gw.api.database.Query
uses una.integration.framework.exception.ExceptionUtil
uses una.integration.framework.exception.FieldErrorInformation
uses una.integration.util.propertyinspections.UnaErrorCode
uses una.integration.mapping.document.DocumentActivity
uses java.util.HashMap
uses com.google.gdata.util.common.base.Pair
uses una.config.ConfigParamsUtil

/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 01/23/17
 * Time: 4:10 PM
 */
class ActivityUtil {
  public enum ACTIVITY_QUEUE {
    NEW_BUSINESS("New Business (Other than Builder)"),
    BUILDER_ACCOUNTS("Builder Accounts"),
    GEICO("Geico"),
    UW_ENDORSEMENTS("UW Endorsements"),
    RENEWALS("Renewals"),
    UW_INSPECTION_REVIEW("UW Inspection Review"),
    PRIORITY_INSPECTION_REVIEW("Priority  Inspection Review"),
    JUNIOR_UW("Junior UW Queue"),
    SENIOR_UW("Senior UW Queue"),
    SPECIAL_HANDLING("Special Handling Queue"),
    CSR("CSR Queue"),
    CSR_INSPECTION("CSR Inspection Queue"),
    CSR_FOLLOW_UP("CSR Follow up Queue"),
    CL_UW("CL UW Queue"),
    CL_SR_UW("CL Sr UW Queue"),
    COMPLIANCE_OFAC("Compliance OFAC"),
    CSR_MANAGER("CSR Manager Queue"),
    CL_UW_FOLLOW_UP("CL UW Follow up Queue")

    private var _name : String as QueueName

    private construct(name : String){
      this._name = name
    }
  }

  //Function to check open activities
  public static function hasOpenActivity(period: PolicyPeriod, subject: String): Boolean {
    var openActivities = Activity.finder.findOpenActivitiesByPolicy(period.Policy)
    for (activity in openActivities) {
      if (activity.Subject?.equalsIgnoreCase(subject) and activity.Status == "Open")
        return true
    }
    return false
  }

  public static function createJobActivityIfNotExists(job : Job, patternCode : String, queue : ACTIVITY_QUEUE, associatedEntity : KeyableBean){
    if(!job.AllOpenActivities.hasMatch( \ activity -> activity.ActivityPattern.Code?.equalsIgnoreCase(patternCode))){
      var activity = createActivityAutomatically(job.LatestPeriod, patternCode)
      activity.AssociatedEntity = associatedEntity
      ActivityUtil.assignActivityToQueue(queue.QueueName, queue.QueueName, activity)
    }
  }

  public static function createDocumentRequestActivity(docType : DocumentRequestType_Ext, job : Job, associatedEntity : KeyableBean){
    var activityMetaData = ConfigParamsUtil.getPair<String, String>(TC_ActivityMetaDataPair, job.SelectedVersion.BaseState, docType.Code)

    if(activityMetaData != null){
	    //First is always the patterncode.  Second represents the Queue code in the ACTIVITY_QUEUE enum above
      createJobActivityIfNotExists(job, activityMetaData.First, ACTIVITY_QUEUE.AllValues.atMostOneWhere( \ queue -> queue.Code?.equalsIgnoreCase(activityMetaData.Second)), associatedEntity)
    }
  }

  public static function removeDocumentRequestActivityUnconditionally(docType : DocumentRequestType_Ext, job : Job, associatedEntity : KeyableBean){
    var activityMetaData = ConfigParamsUtil.getPair<String, ACTIVITY_QUEUE>(TC_ActivityMetaDataPair, job.SelectedVersion.BaseState, docType.Code)

    if(activityMetaData != null){
      var relatedActivities = job.AllOpenActivities.where(\ activity -> activity.ActivityPattern.Code?.equalsIgnoreCase(activityMetaData.First))
      var relatedActivity : Activity

      if(associatedEntity != null){
        relatedActivity = relatedActivities.firstWhere( \ activity -> activity.AssociatedEntity == associatedEntity)
      }else{
        relatedActivity = relatedActivities.first()
      }

      if(relatedActivity != null and relatedActivity.Bundle.ReadOnly){
        gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
          relatedActivity = bundle.add(relatedActivity)
          relatedActivity.remove()
        })
      }else{
        relatedActivity?.remove()
      }
    }
  }

  /**
   * The activity gets created automatically in the backend. The function calls the OOTB method for creating an activity
   *and passes the current bundle.
   */
  public static function createActivityAutomatically(policyPeriod: PolicyPeriod, patternCode: String): Activity
  {
    var activityPattern = ActivityPattern.finder.getActivityPatternByCode(patternCode)
    var activity: Activity = null
    if (activityPattern != null)
    {
      activity = activityPattern.createJobActivity(!policyPeriod.Bundle.ReadOnly ? policyPeriod.Bundle : gw.transaction.Transaction.getCurrent(), policyPeriod.Job, null, null, "", null, null, null, null)
    } else {
      var fieldError = new FieldErrorInformation()  {: FieldName = "Activity Pattern Code", : FieldValue = patternCode}
      ExceptionUtil.throwException(UnaErrorCode.PATTERN_CODE_NOT_PRESENT, {fieldError})
    }
    return activity
  }

  //Function to complete/close open activities

  public static function completeActivity(activity: Activity, note: Note, pp: PolicyPeriod) {
    gw.api.web.activity.ActivityUtil.completeActivity(activity, note);
    createHistoryEvent(pp, activity)
    activity.Bundle.commit()
  }

  /**
   * The Activity gets assigned to queue.  Takes queue name, group name and the activity as parameters
   */
  public static function assignActivityToQueue(queueName: String, groupName: String, activity: Activity) {
    var group = Query.make(Group).compare(Group#Name, Equals, groupName).select().AtMostOneRow
    if (group != null) {
      var assignableQueue = group.AssignableQueues.where(\elt -> elt.Name.equalsIgnoreCase(queueName.trim())).last()
      if (assignableQueue != null) {
        activity.assignActivityToQueue(assignableQueue, group)
      } else {
        var fieldError = new FieldErrorInformation()  {: FieldName = "Assignable Queue", : FieldValue = queueName}
        ExceptionUtil.throwException(UnaErrorCode.ASSIGNABLE_QUEUE_NOT_PRESENT, {fieldError})
      }
    } else {
      var fieldError = new FieldErrorInformation()  {: FieldName = "Group", : FieldValue = groupName}
      ExceptionUtil.throwException(UnaErrorCode.GROUP_NOT_PRESENT, {fieldError})
    }
  }

  // function to create ofac Activity

  public static function createOfacActivity(period: PolicyPeriod) {
    if (period.ofaccontact != null && period.ofaccontact?.atMostOneWhere(\elt -> elt.OverrideHit == false)?.OverrideHit != true)
    {
      var pattern = ActivityPattern.finder.findActivityPatternsByCode("OFAC1").atMostOne()
      if (pattern != null and period.Job.AllOpenActivities.firstWhere(\elt -> elt.ActivityPattern.Code == "OFAC1") == null)
      {
        var activity = pattern?.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
        assignActivityToQueue("CSR Queue", "CSR Queue", activity)
      }

      //create custom history event
      period.createCustomHistoryEvent(CustomHistoryType.TC_OFACSUBMITTEDTOCOMPLIANCE, \-> " identified on OFAC list and submitted to Compliance ")
    }
  }

  /**
  *     Create an history events need for the activity
  */
  private static function createHistoryEvent(period: PolicyPeriod, activity: Activity) {
    switch (activity.ActivityPattern.Code) {
      case DocumentActivity.VENDOR_WIND_MIT_INSPECTION:
          period.createCustomHistoryEvent(CustomHistoryType.TC_INSPECTIONREVACTIVITYCOMPLETED, \-> "Inspection review activity completed: " + activity.Subject)
          break;
    }
  }

}