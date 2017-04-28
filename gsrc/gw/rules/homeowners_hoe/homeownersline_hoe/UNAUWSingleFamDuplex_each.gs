package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.utils.UNAProductModelUtil.DwellingUWQuestionCodes

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UNAUWSingleFamDuplex_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {
    var result : RuleEvaluationResult
    var isUsedForResidentialPurposesOnly = homeowner.Branch.getAnswerForQuestionCode(DwellingUWQuestionCodes.USED_EXCLUSIVELY_FOR_RESIDENTIAL_PURPOSES_DF.QuestionCode).BooleanAnswer

    if( homeowner.Dwelling.ResidenceType != typekey.ResidenceType_HOE.TC_SINGLEFAMILY_EXT and homeowner.Dwelling.ResidenceType != typekey.ResidenceType_HOE.TC_DUPLEX
    and isUsedForResidentialPurposesOnly != null
    and !isUsedForResidentialPurposesOnly
    and !typekey.ConstructionType_HOE.TF_WOODFRAMECONSTRUCTIONTYPES.TypeKeys.contains( homeowner.Dwelling.ConstructionTypeOrOverride)){
      result = RuleEvaluationResult.execute()
    }else{
      result = RuleEvaluationResult.skip()
    }

    return result
  }


}