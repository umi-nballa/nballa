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
class UNAUWPropQuestions1_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

         //43,63,554,34,38, or 715
    if(homeowner.Dwelling.BarrierIsland_Ext  || homeowner.Dwelling.FloodZoneOrOverride==typekey.FloodZoneOverridden_Ext.TC_V ||
        homeowner.Dwelling.PropertyLocatedIn_Ext &&
           ( ((homeowner.Dwelling.HOLocation.DistToCoast_Ext!=null
      && typekey.DistToCoastOverridden_Ext.TF_LESSTHAN2500FEET.TypeKeys.contains(homeowner.Dwelling.HOLocation.DistToCoast_Ext) && homeowner.Dwelling.HOLocation?.DistBOWNamedValue_Ext?.contains("Gulf")) ||
        (typekey.DistToCoastOverridden_Ext.TF_LESSTHAN2500FEET.TypeKeys.contains(homeowner.Dwelling.HOLocation.DistToCoastOverridden_Ext)
             && homeowner.Dwelling.HOLocation?.DistBOWNVOverridden_Ext?.contains("Gulf")) )
      ||
        ((homeowner.Dwelling.HOLocation.DistToCoast_Ext!=null
            && typekey.DistToCoastOverridden_Ext.TF_LESSTHAN1000FEET.TypeKeys.contains(homeowner.Dwelling.HOLocation.DistToCoast_Ext) && homeowner.Dwelling.HOLocation?.DistBOWNamedValue_Ext?.contains("Atlantic")) ||
            (typekey.DistToCoastOverridden_Ext.TF_LESSTHAN1000FEET.TypeKeys.contains(homeowner.Dwelling.HOLocation.DistToCoastOverridden_Ext)
                && homeowner.Dwelling.HOLocation?.DistBOWNVOverridden_Ext?.contains("Atlantic")) ) )
   )


    {
        return RuleEvaluationResult.execute()
    }

    return RuleEvaluationResult.skip()

}
}