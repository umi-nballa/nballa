package edge.capabilities.gpa.job.submission

uses edge.capabilities.gpa.job.submission.dto.SubmissionReviewDTO
uses edge.capabilities.quote.quoting.util.QuoteUtil
uses edge.di.annotations.ForAllGwNodes
uses edge.exception.EntityNotFoundException
uses gw.api.database.Query
uses gw.transaction.Transaction
uses una.config.ConfigParamsUtil
uses edge.PlatformSupport.Bundle

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 7/25/17
 * Time: 10:02 AM
 * To change this template use File | Settings | File Templates.
 */
class DefaultSubmissionReviewPlugin implements ISubmissionReviewPlugin {
  @ForAllGwNodes
  construct() {

  }

  override function createUWReviewActivity(activityPattern: ActivityPattern, submissionReviewDTO : SubmissionReviewDTO){
    var bundle = Bundle.getCurrent().PlatformBundle
    var submission = bundle.add(getSubmissionByJobNumber(submissionReviewDTO.QuoteID))
    var activity = activityPattern.createJobActivity(bundle,submission,null,null,null,null,null,null,null)
    var groupAndQueueName = ConfigParamsUtil.getString(TC_SubmitForReviewActivityQueue, null, activityPattern.Code)
    var group = gw.api.database.Query.make(entity.Group).compare(Group#Name.PropertyInfo.Name, Equals,groupAndQueueName).select().FirstResult
    activity.assignActivityToQueue(group.getQueue(groupAndQueueName),group)
    submissionReviewDTO.ActivityStatus = activity.Status
  }

  /**
   * Fetches a submission by its number.
   */
  private function getSubmissionByJobNumber(jobNumber : String) : Submission {
    final var foundSubmission = Query.make(Submission).compare("JobNumber", Equals, jobNumber).select().FirstResult
    if (foundSubmission == null  ){
      throw new EntityNotFoundException() {: Message = "Submission not found" }
    }
    return foundSubmission
  }
}