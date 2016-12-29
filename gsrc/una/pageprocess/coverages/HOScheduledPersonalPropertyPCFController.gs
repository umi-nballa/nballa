package una.pageprocess.coverages
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 12/28/16
 * Time: 6:33 PM
 * To change this template use File | Settings | File Templates.
 */
class HOScheduledPersonalPropertyPCFController {
  private var _schedule : Coverage
  private var _dwelling : Dwelling_HOE

  construct(schedule : Coverage){
    this._schedule = schedule
    this._dwelling = _schedule.OwningCoverable as Dwelling_HOE
  }

  property get ScheduleTypeRange() : List<ScheduleType_HOE>{
    var results = ScheduleType_HOE.getTypeKeys(false).where( \ key -> key.hasCategory(_dwelling.HOLine.BaseState))

    if(!_dwelling.HODW_Dwelling_Cov_HOE.HODW_ExecutiveCov_HOE_ExtTerm.Value){
      results.removeAll(ScheduleType_HOE.TF_EXECUTIVEENDORSEMENTONLYTYPES.TypeKeys)
    }

    return results
  }
}