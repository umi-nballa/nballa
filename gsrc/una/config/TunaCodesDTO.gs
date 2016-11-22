package una.config
/**
 * Created with IntelliJ IDEA.
 * User: sgopal
 * Date: 11/16/16
 * Time: 1:05 PM
 * To change this template use File | Settings | File Templates.
 */
class TunaCodesDTO {

  private var _code : String
  private var _matchPercentage : String

  property set Code(value : String) {
    _code = value
  }

  property get Code() : String {
    return _code
  }

  property set MatchPercentage(value : String) {
    _matchPercentage = value
  }

  property get MatchPercentage() : String {
    return _matchPercentage
  }

}