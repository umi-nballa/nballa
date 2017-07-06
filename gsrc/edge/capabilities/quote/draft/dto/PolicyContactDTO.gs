package edge.capabilities.quote.draft.dto

uses edge.jsonmapper.JsonProperty
uses edge.capabilities.policycommon.accountcontact.dto.AccountContactDTO

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/30/17
 * Time: 8:47 AM
 * To change this template use File | Settings | File Templates.
 */
class PolicyContactDTO {
  @JsonProperty
  private var _accountContact : AccountContactDTO as Contact
}