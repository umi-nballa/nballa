package edge.capabilities.reports.dto.clue

uses edge.jsonmapper.JsonProperty
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/8/17
 * Time: 4:18 PM
 * To change this template use File | Settings | File Templates.
 */
class PriorLossDTO {
  @JsonProperty
  private var _description : String as Description

  @JsonProperty
  private var _lossLocation : String as LossLocation

  @JsonProperty
  private var _lossDate : Date as DateOfLoss

  @JsonProperty
  private var _catCode : String as CATCode

  @JsonProperty
  private var _status : Status_Ext as Status

  @JsonProperty
  private var _claimPayments : List<ClaimPaymentDTO> as ClaimPayments

  @JsonProperty
  private var _source : Source_Ext as Source
}