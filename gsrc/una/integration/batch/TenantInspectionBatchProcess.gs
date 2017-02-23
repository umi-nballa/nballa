package una.integration.batch

uses gw.api.database.Query
uses java.lang.Exception
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/2/16
 * Time: 11:11 AM
 * To change this template use File | Settings | File Templates.
 */
class TenantInspectionBatchProcess extends AbstractPolicyPeriodBatchProcess {
  static final var ACTIVITY_PATTERN : String = "BOP_order_tenant_insp"

  construct(){
    super(TC_TenantInspection)
  }

  override function findEligiblePolicyPeriods(): List<PolicyPeriod> {
    var currentDate = java.util.Date.CurrentDate.trimToMidnightPlusOne()
    var bopBranchIDs = Query.make(BP7BusinessOwnersLine).select(\ resultRow -> {return resultRow.Branch.ID})?.toList()

    var policyPeriodResults =  Query.make(PolicyPeriod)
                                    //this chunk filters for periods that are bound and not yet cancelled
                                    //where the current date falls within an active current term
                                    .compare(PolicyPeriod#PeriodEnd, GreaterThan, currentDate)
                                    .compare(PolicyPeriod#PeriodStart, LessThan, currentDate)
                                    .compare(PolicyPeriod#Status, Equals, PolicyPeriodStatus.TC_BOUND)
                                    .compare(PolicyPeriod#CancellationDate, Equals, null)
                                    .compareIn(PolicyPeriod#ID, bopBranchIDs)
                                    //this chunk filters for tenant report received dates that
                                    //are older than 1 year old or are null.
                                    .or(\ orCriteria -> {
                                      orCriteria.compare(PolicyPeriod#DateLastInspection_Ext, Equals, null)
                                      orCriteria.compare(PolicyPeriod#DateLastInspection_Ext, LessThan, currentDate.addYears(-1))
                                    }).select()?.toList()

    policyPeriodResults.removeWhere( \ policyPeriod -> policyPeriod.Policy.AllOpenActivities?.hasMatch( \ activity -> activity.ActivityPattern.Code == ACTIVITY_PATTERN)
                                                   or  policyPeriod.Policy.LatestBoundPeriod != policyPeriod
                                                   or  !policyPeriod.BP7Line.AllExclusions.hasMatch( \ exclusion -> exclusion.PatternCode == "BP7ExclusionProductsCompletedOpernsUnrelatedtoBuilOwners_EXT"))

    return policyPeriodResults
  }

  override property get PerPolicyExceptionBlock(): block(PolicyPeriod, Exception): String {
    return \ period, e -> "An exception occurred while attempting to create an 'order tenant inspection activity' for policy ${period.PolicyNumber}.  Exception = ${e} \n ${e.StackTraceAsString}"
  }

  override property get ExecutionUserName(): String {
    return "sys"
  }

  override function getExecutionSliceDate(policyPeriod: PolicyPeriod): Date {
    return policyPeriod.EditEffectiveDate
  }

  override function createActivityPerPolicy(eligiblePeriod : PolicyPeriod){
    var activityPattern = ActivityPattern.finder.findActivityPatternsByCode(ACTIVITY_PATTERN).atMostOne()
    var activity = activityPattern?.createPolicyActivity(eligiblePeriod.Bundle, eligiblePeriod.Policy, null, null, null, null, null, null, null)
    activity.assignActivityToQueue(null, null)
  }

  override property get PerBatchRunExceptionBlock(): block(Exception): String {
    return null
  }

  override function doWorkPerPolicy(eligiblePeriod: PolicyPeriod) {
  }

  override function onPerPolicyExceptionOccurred(eligiblePeriod: PolicyPeriod) {
  }

  override function onPerBatchJobExceptionOccurred() {
  }

  override function doWorkPerBatchRun() {
  }
}