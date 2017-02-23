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
class UNAUWWindPoolWindCov_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

         //43,63,554,34,38, or 715
    if(homeowner.Dwelling.HOLocation.WindPool_Ext!=null || homeowner.Dwelling.HOLocation.WindPoolOverridden_Ext!=null &&
    !homeowner.HODW_WindHurricaneHailExc_HOE_ExtExists &&
        (homeowner.Dwelling.HOLocation.territoryCodeOrOverride!="43" &&
            homeowner.Dwelling.HOLocation.territoryCodeOrOverride!="63" &&
            homeowner.Dwelling.HOLocation.territoryCodeOrOverride!="554" &&
            homeowner.Dwelling.HOLocation.territoryCodeOrOverride!="34" &&
            homeowner.Dwelling.HOLocation.territoryCodeOrOverride!="38" &&
            homeowner.Dwelling.HOLocation.territoryCodeOrOverride!="715" )
        )
    {
        return RuleEvaluationResult.execute()
    }

    return RuleEvaluationResult.skip()

}
}