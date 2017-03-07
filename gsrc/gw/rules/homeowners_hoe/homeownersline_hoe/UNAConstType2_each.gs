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
class UNAConstType2_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowner : HomeownersLine_HOE) : RuleEvaluationResult {

//If Exterior Wall Construction = "Concrete Block", "Poured Concrete", "Solid Brick/Stone", "Fire Resistive", "Non Combustible", "Masonry Non Combustible"

    if(homeowner.Dwelling.ConstructionTypeOrOverride==typekey.ConstructionType_HOE.TC_CONCRETEBLOCK_EXT ||
        homeowner.Dwelling.ConstructionTypeOrOverride==typekey.ConstructionType_HOE.TC_POUREDCONCRETE_EXT ||
    homeowner.Dwelling.ConstructionTypeOrOverride==typekey.ConstructionType_HOE.TC_SOLIDBRICKSTONE_EXT ||
        homeowner.Dwelling.ConstructionTypeOrOverride==typekey.ConstructionType_HOE.TC_FIRERESISTIVE_EXT ||
        homeowner.Dwelling.ConstructionTypeOrOverride==typekey.ConstructionType_HOE.TC_SUPERIORNONCOMBUSTIBLE_EXT ||
        homeowner.Dwelling.ConstructionTypeOrOverride==typekey.ConstructionType_HOE.TC_CONCRETE_EXT  ||
        homeowner.Dwelling.ConstructionTypeOrOverride==typekey.ConstructionType_HOE.TC_CONCRETEANDMASONRY
    )

        return RuleEvaluationResult.execute()





    return RuleEvaluationResult.skip()

}
}