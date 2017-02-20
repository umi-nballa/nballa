package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses java.lang.Integer

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWWindPoolWindCov2_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

         //43,63,554,34,38, or 715
    if(homeowner.Dwelling.HOLocation.WindPool_Ext!=null || homeowner.Dwelling.HOLocation.WindPoolOverridden_Ext!=null &&
    !homeowner.HODW_WindHurricaneHailExc_HOE_ExtExists &&
        homeowner.Dwelling.YearBuiltOrOverride<2002 && homeowner.Dwelling.FloorLocation_Ext!=null
        && homeowner.Dwelling.FloorLocation_Ext!="" && Integer.parseInt(homeowner.Dwelling.FloorLocation_Ext)<2
      && (homeowner.Dwelling.ConstructionTypeOrOverride!=typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT ||
            homeowner.Dwelling.ConstructionTypeOrOverride!=typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT ||
            homeowner.Dwelling.ConstructionTypeOrOverride!=typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT)

        )
    {
        return RuleEvaluationResult.execute()
    }

    return RuleEvaluationResult.skip()

}
}