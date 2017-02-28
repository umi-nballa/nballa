package gw.rules.homeowners_hoe.homeownersline_hoe

uses gw.accelerator.ruleeng.IRuleCondition
uses gw.accelerator.ruleeng.RuleEvaluationResult

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 2/8/17
 * Time: 6:02 PM
 * To change this template use File | Settings | File Templates.
 */
class UNATunaReturnActivity_each implements IRuleCondition<HomeownersLine_HOE> {

  override function evaluateRuleCriteria(holine : HomeownersLine_HOE) : RuleEvaluationResult {

    var tunaAppResponse = new una.pageprocess.PropertyInformationCompletePluginImpl().getTunaInformation(holine.AssociatedPolicyPeriod)

    if(gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.BCEGGrade).size()>1)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_MultipleBCEGFound")

      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_MultipleBCEGFound")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }

    if(gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.BCEGGrade)==null || gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.BCEGGrade).size()==0)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_NoBCEGFound")

      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_NoBCEGFound")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }

    if(gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.DistanceToCoast).size()>1 && holine.HOLocation.PolicyLocation.State.Code=="HI")
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_MultipleDistanceToCoastFound")

      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_MultipleDistanceToCoastFound")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }

    //1
    if(holine.Dwelling.OverrideBaseFloodElVal_Ext && holine.Dwelling.FloodCoverage_Ext)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_BaseFloodElevationChanged")

      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_BaseFloodElevationChanged")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }

    //2
    if(holine.Dwelling.OverrideConstructionType_Ext && holine.Dwelling.FloodCoverage_Ext)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_ConstructionTypeChanged")

      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_ConstructionTypeChanged")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }
    //3
    if(holine.Dwelling.OverrideRoofShape_Ext && (holine.HOLocation.PolicyLocation.State.Code=="FL" || holine.HOLocation.PolicyLocation.State.Code=="SC")  )
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_RoofShapeChanged")


      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_RoofShapeChanged")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }
    //5
    if(holine.Dwelling.YearBuilt==null)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_YearBuiltWasNullFromTuna")


      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_YearBuiltWasNullFromTuna")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }
    //6
    if(holine.Dwelling.OverrideYearbuilt_Ext)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_YearBuiltWasChanged")


      if(holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_YearBuiltWasChanged")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }


    return RuleEvaluationResult.skip()

  }

}