package edge.capabilities.quote.quoting

uses edge.capabilities.quote.draft.dto.DraftDataDTO
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/30/17
 * Time: 7:57 AM
 * To change this template use File | Settings | File Templates.
 */
interface UNAMultiVersionPlugin {
  public function createMultiVersion(period : PolicyPeriod, update : DraftDataDTO)
}