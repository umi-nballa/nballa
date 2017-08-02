package edge.capabilities.gpa.job.submission.dto

uses edge.aspects.validation.annotations.Required
uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Phone
uses edge.aspects.validation.annotations.Size
uses edge.aspects.validation.annotations.Email

/**
 * Created with IntelliJ IDEA.
 * User: dthao
 * Date: 7/24/17
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */
class SubmissionReviewDTO {
  @JsonProperty @Required
  var _quoteID : String as QuoteID

  @JsonProperty @Required
  var _producerContactName : String as ProducerContactName

  @JsonProperty @JsonProperty @Size(0, 30) @Phone
  var _contactPhoneNumber : String as ContactPhoneNumber

  @JsonProperty @Required
  var _extension : String as Extension

  @JsonProperty @Required @Email
  var _contactEmail : String as ContactEmail

  @JsonProperty @Required
  var _agentCode : String as AgentCode

  @JsonProperty
  var _activityStatus : ActivityStatus as ActivityStatus

}