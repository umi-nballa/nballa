package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAScheduledPersProp12_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {


    if( homeowner.Dwelling.HODW_ScheduledProperty_HOEExists )
    {

      homeowner.Dwelling.HODW_ScheduledProperty_HOE.ScheduledItems.each( \ elt ->
      {
        if((elt.ScheduleType==typekey.ScheduleType_HOE.TC_GOLFEQUIPMENT_EXT ||
            elt.ScheduleType==typekey.ScheduleType_HOE.TC_SILVERWAREEXCLUDEPENPENSILS_EXT ||
            elt.ScheduleType==typekey.ScheduleType_HOE.TC_POSTAGESTAMPS ||
            elt.ScheduleType==typekey.ScheduleType_HOE.TC_RARECURRENTCOINS
        )&& elt.ExposureValue.intValue()>2500)
          return RuleEvaluationResult.execute()

      }
      )
    }
     return RuleEvaluationResult.skip()

}
}