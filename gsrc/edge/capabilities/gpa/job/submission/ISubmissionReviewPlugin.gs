package edge.capabilities.gpa.job.submission

uses edge.capabilities.gpa.job.submission.dto.SubmissionReviewDTO
uses java.util.Queue
uses edge.PlatformSupport.Bundle

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 7/24/17
 * Time: 3:32 PM
 * To change this template use File | Settings | File Templates.
 */
interface ISubmissionReviewPlugin {
  public function createUWReviewActivity(activityPattern : ActivityPattern, submissionReviewDTO : SubmissionReviewDTO, submission : Submission) : Activity
  public function setAgentContactInfo(submissionReviewDTO : SubmissionReviewDTO, submission : Submission)
}