package una.integration.batch

uses gw.processes.BatchProcessBase
uses una.logging.UnaLoggerCategory
uses gw.api.util.DateUtil
uses gw.api.database.Query
uses gw.api.database.Relop
uses una.integration.plugins.portal.PolicyRefreshTransport
uses java.util.Date

/**
 * Created with IntelliJ IDEA.
 * User: CMattox
 * Date: 8/28/17
 * Time: 12:56 PM
 * To change this template use File | Settings | File Templates.
 */
class PolicyRefreshBatchProcess extends BatchProcessBase {

    final static var _logger = UnaLoggerCategory.UNA_INTEGRATION

    final static var _INTEGRATION_USER = "sys"

    /**
     * Construct to call the super class construct
     */
    construct() {
        super(TC_POLICYREFRESHFUTUREDATEDTRANS)
    }

    override function doWork() {
        _logger.info("{} batch process is started now", this.Type)
        var startTime = DateUtil.currentDate()

        var jobsToSendToPortal = Query.make(PolicyRefreshFutureChange)
                                    .compare(PolicyRefreshFutureChange#EffectiveDate, Relop.LessThan, startTime.addDays(1).trimToMidnight())
                                    .compare(PolicyRefreshFutureChange#Processed, Relop.Equals, false)
                                    .select().orderBy( \ row -> row.EffectiveDate).thenBy( \ row -> row.UpdateTime)?.toList()

        this.OperationsExpected = jobsToSendToPortal.Count

        if(this.OperationsExpected > 0) {
            gw.transaction.Transaction.runWithNewBundle(\batchBundle -> {

                jobsToSendToPortal.each(\ jobToSend -> {
                    jobToSend = batchBundle.add(jobToSend)
                    _logger.debug("Processing Job: ${jobToSend.JobNumber}")
                    var job = Job.finder.findJobByJobNumber(jobToSend.JobNumber)

                    var period = batchBundle.add(job.SelectedVersion)
                    period.addEvent(PolicyRefreshTransport.REFRESH_MSG)
                    jobToSend.Processed = true
                    jobToSend.ProcessedDate = new Date()
                    jobToSend.remove()
                    this.incrementOperationsCompleted()
                })

            }, _INTEGRATION_USER)

        }

        var endTime = DateUtil.currentDate()
        _logger.info("Batch ran to completion. Took {} milli seconds to complete the batch (Total Record Count: {})", { endTime.Time - startTime.Time, this.OperationsCompleted})
    }

}