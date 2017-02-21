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
class UNAUWSingleFamDuplex_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {



    if( homeowner.Dwelling.ResidenceType!=typekey.ResidenceType_HOE.TC_SINGLEFAMILY_EXT && homeowner.Dwelling.ResidenceType!=typekey.ResidenceType_HOE.TC_DUPLEX
    && ( homeowner.Dwelling.HOUWQuestions.exclusiveresi!=null && ! homeowner.Dwelling.HOUWQuestions.exclusiveresi)
        && !typekey.ConstructionType_HOE.TF_WOODFRAMECONSTRUCTIONTYPES.TypeKeys.contains( homeowner.Dwelling.ConstructionTypeOrOverride) )
      {
            return RuleEvaluationResult.execute()


       }
   return RuleEvaluationResult.skip()
  }


}