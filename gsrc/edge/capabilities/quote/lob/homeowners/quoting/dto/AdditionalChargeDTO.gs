package edge.capabilities.quote.lob.homeowners.quoting.dto

uses java.math.BigDecimal
uses edge.jsonmapper.JsonProperty

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/21/17
 * Time: 7:36 AM
 * To change this template use File | Settings | File Templates.
 */
class AdditionalChargeDTO {
  @JsonProperty
  var name : String as Name
  @JsonProperty
  var amount : BigDecimal as Amount
}