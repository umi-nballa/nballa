  package gw.acc.futuredatedchanges.job

  uses java.util.Set
  uses java.util.Set
  uses java.util.Date
  uses pcf.RenewalWizard
  uses gw.api.util.DisplayableException

  /**
   * Provides utility methods to start a policy change
   */
  class StartPolicyChangeHelper_Ext {

    /**
     * Helper to instantiate a policy change initiated through wizard
     */
    @Param("job","The policy change job")
    @Param("inForcePeriod","The latest policy period in force")
    @Param("effectiveDate","Effective date of the change")
    @Param("CurrentLocation","The current pcf file")
    static function startPolicyChangeWizard(job : PolicyChange, inForcePeriod: PolicyPeriod, effectiveDate : Date, CurrentLocation : pcf.StartPolicyChange, initiateSERP : boolean){

      if(!inForcePeriod.existOnDate_Ext(effectiveDate)){
        job.remove()
        var renewal : Renewal = inForcePeriod.Policy.OpenRenewalJob
        if(renewal == null){
          renewal = new Renewal(inForcePeriod)
          renewal.startJobAndCommit(inForcePeriod.Policy, CurrentLocation)
        }
        if(renewal.LatestPeriod.Status == typekey.PolicyPeriodStatus.TC_QUOTED){
          throw new DisplayableException(displaykey.Accelerator.FutureDatedChanges.ChangeOnQuotedRenewalException)
        }
        if(renewal.LatestPeriod.Status != typekey.PolicyPeriodStatus.TC_DRAFT){
          var loopExitTime = Date.Now.addSeconds(60)
          while(renewal.LatestPeriod.Workflows.whereTypeIs(RenewalTimeoutWF).first().ActiveState != WorkflowActiveState.TC_WAITMANUAL and Date.Now.before(loopExitTime)){}
          gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
            var p = bundle.loadBean(renewal.LatestPeriod.ID) as PolicyPeriod
            p.RenewalProcess.ActiveRenewalWorkflow.invokeTrigger("EditPolicy")
          })
        }
        RenewalWizard.go(renewal, renewal.LatestPeriod.getSlice(effectiveDate))
      }
      else{
        if (job.startJobAndCommit(inForcePeriod.Policy, effectiveDate, CurrentLocation)){
          gw.transaction.Transaction.runWithNewBundle(\ bundle ->{
            job = bundle.add(job)
            job.LatestPeriod?.setSERPIndicator(initiateSERP)
          })

          pcf.PolicyChangeWizard.go(job, job.LatestPeriod)
        }
      }

    }

  }