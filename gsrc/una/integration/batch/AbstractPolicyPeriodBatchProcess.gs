package una.integration.batch

uses gw.processes.BatchProcessBase
uses gw.util.ILogger
uses java.lang.Exception
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/2/16
 * Time: 11:21 AM
 *
 * Executes policy level logic for each member of a collection of policies defined by its concretions.
 * Afterwards, executes batch job level logic when specified.
 * Eats but logs exception messages at both levels.
 */
abstract class AbstractPolicyPeriodBatchProcess extends BatchProcessBase{
  protected static final var LOGGER : ILogger = una.logging.UnaLoggerCategory.UNA_BATCH_PROCESS
  private var _eligiblePolicyPeriods : List<PolicyPeriod>

  construct(batchProcessType : BatchProcessType){
    super(batchProcessType)
  }

  protected final property get EligiblePolicyPeriods() : List<PolicyPeriod>{
    if(_eligiblePolicyPeriods == null){
      _eligiblePolicyPeriods = findEligiblePolicyPeriods()
    }

    return _eligiblePolicyPeriods
  }

  final override function checkInitialConditions() : boolean{
    return EligiblePolicyPeriods.Count > 0
  }

  final override function requestTermination() : boolean{
    return true
  }

  final override function doWork(){
    var totalPolicies = EligiblePolicyPeriods.Count
    LOGGER.info("Executing batch process ${this.Type.DisplayName}.  Total number of EligiblePolicyPeriods = ${totalPolicies}")

    EligiblePolicyPeriods?.eachWithIndex( \ eligiblePeriod, i -> {
      LOGGER.info("Begin executing batch operation for job number ${eligiblePeriod.Job.JobNumber}; ${i + 1} of ${totalPolicies}")

      gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
        eligiblePeriod = bundle.add(eligiblePeriod)
        eligiblePeriod = eligiblePeriod.getSlice(getExecutionSliceDate(eligiblePeriod))

        if(!TerminateRequested){
          try{
            doWorkPerPolicy(eligiblePeriod)
            createActivityPerPolicy(eligiblePeriod)
            incrementOperationsCompleted()
          }catch(e : Exception){
            LOGGER.error(PerPolicyExceptionBlock(eligiblePeriod, e))
            onPerPolicyExceptionOccurred(eligiblePeriod)
            incrementOperationsFailed()
          }
        }
      }, ExecutionUserName)

      LOGGER.info("Bundle committed for job number ${eligiblePeriod.Job.JobNumber}")
    })

    try{
      doWorkPerBatchRun()
    }catch(e : Exception){
      onPerBatchJobExceptionOccurred()
      LOGGER.error(PerBatchRunExceptionBlock(e))
    }
  }


  /**
  *  Contains the logic used to query for and return the list of policy periods
  *  that the "doWorkPerPolicy" logic should be executed against
  */
  abstract protected function findEligiblePolicyPeriods() : List<PolicyPeriod>

  /*
  *  The logic to be executed at a per policy level.
  *  This logic IS enclosed in a bundle that is executed with the user name returned from the ExecutionUserName property
  */
  abstract protected function doWorkPerPolicy(eligiblePeriod : PolicyPeriod)

  /*
  *  The logic to be executed at a per batch run level.
  *  This logic is not enclosed in a bundle.  If one is needed, it should be explicitly run inside this function
  */
  abstract protected function doWorkPerBatchRun()

  /**
   *  The Date slice date to execute data changes for per policy period
   */
  abstract protected function getExecutionSliceDate(policyPeriod : PolicyPeriod) : Date

  /**
  *  The action to execute if an exception occurs when executing the per policy function
  */
  abstract protected function onPerPolicyExceptionOccurred(eligiblePeriod : PolicyPeriod)

  /**
  *  The action to execute if an exception occurs when executing the per batch job function
  */
  abstract protected function onPerBatchJobExceptionOccurred()

  /*
  *  The exception block to run if an exception is thrown at the per policy level
  */
  abstract protected property get PerPolicyExceptionBlock() : block(policyPeriod : PolicyPeriod, e : Exception) : String

  /*
  *  The exception block to run if an exception is thrown at the batch run level
  */
  abstract protected property get PerBatchRunExceptionBlock() : block(e : Exception) : String

  /*
  *  The username to execute data changes with at a policy period level
  */
  abstract protected property get ExecutionUserName() : String

  /**
  *  Creates an activity, if neede
  *  d, for follow up
  */
  abstract protected function createActivityPerPolicy(eligiblePeriod : PolicyPeriod)
}