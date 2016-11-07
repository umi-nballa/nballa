package gw.plugin.processing
uses gw.processes.BatchProcess
uses gw.processes.PolicyRenewalClearCheckDate
uses gw.processes.ApplyPendingAccountDataUpdates
uses edge.capabilities.quote.session.QuoteSessionCleanupBatchProcess
uses edge.capabilities.document.DocumentSessionCleanupBatchProcess

@Export
class ProcessesPlugin implements IProcessesPlugin {

  construct() {
  }

  override function createBatchProcess(type : BatchProcessType, arguments : Object[]) : BatchProcess {
    switch(type) {
      case BatchProcessType.TC_POLICYRENEWALCLEARCHECKDATE:
        return new PolicyRenewalClearCheckDate()
      case BatchProcessType.TC_APPLYPENDINGACCOUNTDATAUPDATES:
        return new ApplyPendingAccountDataUpdates()
      case BatchProcessType.TC_PORTALQUOTESESSION_MPEXT:
        return new QuoteSessionCleanupBatchProcess()
      case BatchProcessType.TC_PORTALDOCUMENTSESSION_MPEXT:
          return new DocumentSessionCleanupBatchProcess()
      default:
        return null
    }
  }

}
