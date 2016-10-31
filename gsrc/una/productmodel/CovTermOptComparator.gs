package una.productmodel

uses java.util.Comparator
uses gw.api.productmodel.CovTermOpt

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 10/7/16
 * Time: 2:02 PM
 *
 * This was added to help control the order in which cov term options are displayed because Product Designer displays it as-added in the UI
 * and default sorts do not account for excluded and decimals are less than whole numbers, which is the opposite of how we want to display.
 */
class CovTermOptComparator implements Comparator<gw.api.productmodel.CovTermOpt> {
  private var _overrideLogic : block(option1 : CovTermOpt, option2 : CovTermOpt):int

  construct(){

  }

  construct(overrideLogic : block(option1 : CovTermOpt, option2 : CovTermOpt) : int){
    _overrideLogic = overrideLogic
  }

  override function compare(option1 : CovTermOpt, option2 : CovTermOpt): int {
    var result : int

    if(_overrideLogic != null){
      result = _overrideLogic(option1, option2)
    }else{
      result = standardCompare(option1, option2)
    }

    return result
  }

  private function standardCompare(option1 : CovTermOpt, option2 : CovTermOpt) : int{
    var result : int

    if(option1.Value < 0 or option1.Value < 1 and option2.Value > 1){//option 1 is 'special - excluded or not applicable', or option 1 is a percentage value and option 2 isn't
      result = 1
    }else if(option1.Value > 1 and option2.Value > 1 or option1.Value < 1 and option2.Value < 1){//options are at the same "level" either percentage or whole value
      if(option1.Value < option2.Value){
        result = -1
      }else if(option1.Value > option2.Value){
        result = 1
      }else{
        result = 0
      }
    }else if(option1.Value > 1 and option2.Value < 1){
      result = -1
    }

    return result
  }
}