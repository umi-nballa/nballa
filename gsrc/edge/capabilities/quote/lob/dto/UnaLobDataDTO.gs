package edge.capabilities.quote.lob.dto

uses edge.jsonmapper.JsonProperty
/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 5/9/17
 * Time: 2:15 PM
 * To change this template use File | Settings | File Templates.
 */
abstract class UnaLobDataDTO {

  @JsonProperty
  var _policyType : String as PolicyType
}