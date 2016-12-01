package una.config

uses java.util.ArrayList
/**
 * Created with IntelliJ IDEA.
 * User: sgopal
 * Date: 11/16/16
 * Time: 1:17 PM
 * To change this template use File | Settings | File Templates.
 */
class TunaCodesBO {

  private var _bcegCodes : List<TunaCodesDTO>

  construct(){
    _bcegCodes = new ArrayList<TunaCodesDTO>()
  }

  property get BCEGValues() : List<TunaCodesDTO> {
    return this._bcegCodes
  }

  property set BCEGValues(bcegCodes : List<TunaCodesDTO>) {
    this._bcegCodes = bcegCodes

  }

}