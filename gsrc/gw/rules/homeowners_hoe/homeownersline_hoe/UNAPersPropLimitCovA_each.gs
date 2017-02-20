package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses java.lang.Double

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/8/17
 * Time: 6:02 PM
 * To change this template use File | Settings | File Templates.
 */
class UNAPersPropLimitCovA_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {


    if(homeowner.Dwelling.HODW_Personal_Property_HOEExists && homeowner.Dwelling.HODW_Personal_Property_HOE.HasHODW_PersonalPropertyLimit_HOETerm
        && homeowner.Dwelling.HODW_Personal_Property_HOE.HODW_PersonalPropertyLimit_HOETerm.Value.doubleValue()>0.5*Double.parseDouble(homeowner.Dwelling.CoverageALimitValue_Ext))
        return RuleEvaluationResult.execute()



    return RuleEvaluationResult.skip()

  }
  }

















