package edge.capabilities.policy.coverages

uses edge.jsonmapper.JsonProperty
uses edge.aspects.validation.annotations.Required

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 5/25/17
 * Time: 6:03 AM
 * To change this template use File | Settings | File Templates.
 */
class UNACoverageDTO {
  @JsonProperty @Required
  var _patternCode : String as Code

  @JsonProperty
  var _coverageTerms : List<UNACoverageTermDTO> as CoverageTerms

  @JsonProperty
  var _scheduledItems : List<UNAScheduledItemDTO> as ScheduledItems
}