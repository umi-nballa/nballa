package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses gw.accelerator.ruleeng.IRuleAction
uses una.utils.ActivityUtil

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocExclusionCosmeticHail implements IRuleCondition<PolicyPeriod>, IRuleAction<PolicyPeriod, PolicyPeriod>{

  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {
    //  cosmetic_damage_follow_up
    if (period.HomeownersLine_HOEExists && period.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          if(period.BaseState.Code == typekey.State.TC_TX){
             if (period.HomeownersLine_HOE.Dwelling.HailResistantRoofCredit_Ext &&
                 period.HomeownersLine_HOE.AllExclusions.hasMatch( \ elt1 -> elt1.PatternCode=="HODW_CosmeticDamagebyHail_HOE_Ext"))  {
               return RuleEvaluationResult.execute()
             }
            }
      }
   return RuleEvaluationResult.skip()
  }
   override function satisfied(target: PolicyPeriod, context: PolicyPeriod, result: RuleEvaluationResult) {
     var activityPattern = ActivityPattern.finder.getActivityPatternByCode("cosmetic_damage_follow_up")
     var activity =  activityPattern.createJobActivity(target.Bundle, target.Job, null, null, null, null, null, null, null)
     ActivityUtil.assignActivityToQueue("CSR Follow up Queue", "Universal Insurance Manager's Inc", activity)

     var list = new AgentDocList_Ext(target)
     list.DocumentName = "Hail Resistant Roof Certificate/Exclusion of Cosmetic Damage to Roof"
     target.addToAgentDocs(list)
   }
}

