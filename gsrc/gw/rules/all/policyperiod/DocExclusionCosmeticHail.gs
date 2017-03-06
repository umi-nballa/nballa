
package gw.rules.all.policyperiod

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class DocExclusionCosmeticHail implements IRuleCondition<PolicyPeriod>{
  override function evaluateRuleCriteria(period : PolicyPeriod) : RuleEvaluationResult {

    var activityPattern = ActivityPattern.finder.getActivityPatternByCode("policy_hold_released")

    //  cosmetic_damage_follow_up

    if (period.HomeownersLine_HOEExists){
          if(period.BaseState.Code == typekey.State.TC_TX){

            for (ex in period.HomeownersLine_HOE.Dwelling.ExclusionsFromCoverable){
              print("ex" + ex.DisplayName)
              print("ex pattern" + ex.PatternCode)
            }         //HODW_CosmeticDamagebyHail_HOE_Ext
             if (period.HomeownersLine_HOE.Dwelling.HailResistantRoofCredit_Ext &&
                 period.HomeownersLine_HOE.AllExclusions.hasMatch( \ elt1 -> elt1.PatternCode=="HODW_CosmeticDamagebyHail_HOE_Ext"))  {
               var activity =  activityPattern.createJobActivity(period.Bundle, period.Job, null, null, null, null, null, null, null)
               var list = new AgentDocList_Ext(period)
               list.DocumentName = "Hail Resistant Roof Certificate/Exclusion of Cosmetic Damage to Roof"
               period.addToAgentDocs(list)
             }
            }
      }
   return RuleEvaluationResult.skip()
  }

}

