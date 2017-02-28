package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult
uses una.lob.ho.HOE_UWConstant

/**
 * Created with IntelliJ IDEA.
 * User: parumugam
 * Date: 2/7/17
 * Time: 11:07 AM
 * To change this template use File | Settings | File Templates.
 */
class UWHOHazardScore4Above_each implements IRuleCondition<HomeownersLine_HOE>{
  override function evaluateRuleCriteria(homeowners : HomeownersLine_HOE) : RuleEvaluationResult {

    var hazardScore = homeowners.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext ? homeowners.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext : homeowners.Dwelling.HOLocation.FirelineAdjHaz_Ext
    var SHIA = homeowners.Dwelling.HOLocation.OverrideFirelineSHIA_Ext ? homeowners.Dwelling.HOLocation.FirelineSHIAOverridden_Ext : homeowners.Dwelling.HOLocation.FirelineSHIA_Ext

    var protectionClass = homeowners.Dwelling.HOLocation.OverrideDwellingPCCode_Ext  ?
        homeowners.Dwelling.HOLocation.DwellingPCCodeOverridden_Ext :  homeowners.Dwelling.HOLocation.DwellingPCCodeMatchLevel_Ext

    if(hazardScore != null &&  typekey.HOAdjustedHazardScore_Ext.TF_4ORMORE.TypeKeys.contains(hazardScore)
       && (SHIA.equalsIgnoreCase("yes") || (protectionClass != null && protectionClass == ProtectionClassCode_Ext.TC_9))
    || (homeowners.Dwelling.DPDW_Dwelling_Cov_HOEExists
        and homeowners.Dwelling.DPDW_Dwelling_Cov_HOE.DPDW_Dwelling_Limit_HOETerm?.Value < HOE_UWConstant.covALimit_1500000))
      {
        return RuleEvaluationResult.execute()
      }
   return RuleEvaluationResult.skip()
  }


}