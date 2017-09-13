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

    //US4846.BR.32	If there are multiple values returned for BCEG with the GetPropertyInformationComplete call, then there will be an activity post binding for UW review.
    if(gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.BCEGGrade).size()>1)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_MultipleBCEGFound")

      if(activityPattern!=null && holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_MultipleBCEGFound")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }

    //US4846.BR.33	If there are no values for BCEG returned after the GetPropertyInformationISOLookUpOnly call is made, then create an activity post binding for an UW to review
    if(gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.BCEGGrade)==null || gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.BCEGGrade).size()==0)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_NoBCEGFound")

      if(activityPattern!=null && holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_NoBCEGFound")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }

    //US4846.BR.32	If there are multiple values returned for Distance To Coast with the GetPropertyInformationComplete call and the risk location is in HI, then there will be an activity post binding for UW review.
    if(gw.lob.ho.HODwellingUtil_HOE.getTunaCodes(tunaAppResponse.DistanceToCoast).size()>1 && holine.HOLocation.PolicyLocation.State.Code=="HI")
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_MultipleDistanceToCoastFound")

      if(activityPattern!=null && holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_MultipleDistanceToCoastFound")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }

    //1
    //US4846.BR.20	If there is a change to the Base Flood Elevation field and flood coverage is selected, then create a post binding activity.

    if(holine.Dwelling.OverrideBaseFloodElVal_Ext && holine.Dwelling.FloodCoverage_Ext)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_BaseFloodElevationChanged")

      if(activityPattern!=null && holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_BaseFloodElevationChanged")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }

    //2
    //US4846.BR.27	If there is a change to the Type Of Construction field and flood coverage is selected, then create a post binding activity.
    if(holine.Dwelling.OverrideConstructionType_Ext && holine.Dwelling.FloodCoverage_Ext)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_ConstructionTypeChanged")

      if(activityPattern!=null && holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_ConstructionTypeChanged")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }
    //3
    //US4846.BR.31	If there is a change to the Roof Shape field and the risk location is in FL or SC, then create a post binding activity.
    if(holine.Dwelling.OverrideRoofShape_Ext && (holine.HOLocation.PolicyLocation.State.Code=="FL" || holine.HOLocation.PolicyLocation.State.Code=="SC")  )
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_RoofShapeChanged")


      if(activityPattern!=null && holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_RoofShapeChanged")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }
    //5
    //US4846.BR.23	If there is no Year Built returned in the GetPropertyInformationComplete call then prompt the user to enter the Year Built Value. Message Display for users:
    // "enter year built to continue" upon entering year built (the sq. ft. field must also be filled), make calls to the following methods: GetPropertyInformationISOLookUpOnly &
    // GetPropertyInformation360ValueLookUpOnly (including square ft. and year built) - (just for BCEG and estimated replacement cost)

    //If the return is Null  then activity for post bind to validate year built.

    if(holine.Dwelling.YearBuilt==null)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_YearBuiltWasNullFromTuna")


      if(activityPattern!=null && holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_YearBuiltWasNullFromTuna")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }
    //6
    //US4846.BR.24	If there is a change to the Year Built, then call the GetPropertyInformationLookUpOnly for a new BCEG value and create post binding activity.
    if(holine.Dwelling.OverrideYearbuilt_Ext)
    {
      var activityPattern = ActivityPattern.finder.getActivityPatternByCode("TUNA_YearBuiltWasChanged")


      if(activityPattern!=null && holine.AssociatedPolicyPeriod.Job.AllOpenActivities.firstWhere( \ elt -> elt.ActivityPattern.Code=="TUNA_YearBuiltWasChanged")==null)
      {
        var activity =  activityPattern.createJobActivity(holine.AssociatedPolicyPeriod.Bundle, holine.AssociatedPolicyPeriod.Job, null, null, null, null, null, null, null)
      }
    }


    return RuleEvaluationResult.skip()

  }

}