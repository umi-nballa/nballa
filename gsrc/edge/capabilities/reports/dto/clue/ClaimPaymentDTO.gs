package edge.capabilities.reports.dto.clue

uses edge.jsonmapper.JsonProperty
uses java.lang.Double

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/23/17
 * Time: 4:19 PM
 * To change this template use File | Settings | File Templates.
 */
class ClaimPaymentDTO {
  @JsonProperty
  private var _lossType : String as LossType

  @JsonProperty
  private var _amount : Double as Amount

  @JsonProperty
  private var _catIndicator : Boolean as CATIndicator
}