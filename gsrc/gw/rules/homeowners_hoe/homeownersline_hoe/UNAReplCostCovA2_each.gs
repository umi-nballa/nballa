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
class UNAReplCostCovA2_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {


    if(homeowner.Dwelling.HODW_Dwelling_Cov_HOEExists && homeowner.Dwelling.HODW_Dwelling_Cov_HOE.HasHODW_DwellingValuation_HOE_ExtTerm
    && typekey.ValuationMethod.TF_COVAFILTER.TypeKeys.contains(homeowner.Dwelling.HODW_Dwelling_Cov_HOE.HODW_DwellingValuation_HOE_ExtTerm)
    && Double.parseDouble(homeowner.Dwelling.CoverageAEstRepCostValue_Ext)>1.5*homeowner.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value.doubleValue())
        return RuleEvaluationResult.execute()



    return RuleEvaluationResult.skip()

  }
  }

















