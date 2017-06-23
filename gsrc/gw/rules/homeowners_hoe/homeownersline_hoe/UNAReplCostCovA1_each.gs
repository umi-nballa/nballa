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
class UNAReplCostCovA1_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {


    if(homeowner.Dwelling.HODW_Dwelling_Cov_HOEExists) {
        var covA = homeowner.Dwelling.HODW_Dwelling_Cov_HOE.HODW_Dwelling_Limit_HOETerm.Value.doubleValue()
        var replCost = homeowner.Dwelling.CoverageAEstRepCostValue_Ext?.toDouble()

        if((homeowner.Dwelling.HODW_Dwelling_Cov_HOE.HasHODW_DwellingValuation_HOE_ExtTerm
          && typekey.ValuationMethod.TF_COVAFILTER.TypeKeys.contains(homeowner.Dwelling.HODW_Dwelling_Cov_HOE.HODW_DwellingValuation_HOE_ExtTerm.Value))
        && ((covA < replCost) ||(covA > (replCost * 1.5)) )) {

            return RuleEvaluationResult.execute()
        }
    }

    return RuleEvaluationResult.skip()

  }
  }

















