package gw.plugin.processing
uses gw.processes.BatchProcess
uses gw.processes.PolicyRenewalClearCheckDate
uses gw.processes.ApplyPendingAccountDataUpdates
uses edge.capabilities.quote.session.QuoteSessionCleanupBatchProcess
uses edge.capabilities.document.DocumentSessionCleanupBatchProcess
uses gw.processes.SolrDataImportBatchProcess
uses gw.acc.bulkproducerchange.BPCBatchProcess
uses una.integration.batch.renewal.RenewalAutoCompleteBatchProcess
uses una.integration.batch.TenantInspectionBatchProcess
uses una.integration.batch.renewal.OpenRenewalsAutomationBatchProcess
uses gw.processes.SolrDataImportBatchProcess

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
      case BatchProcessType.TC_SOLRDATAIMPORT:
          return new SolrDataImportBatchProcess()
        //Bulk Producer Change Accelerator -- Batch Process addition
      case BatchProcessType.TC_BULKPRODUCERCHANGE_EXT:
          return new BPCBatchProcess()
      case BatchProcessType.TC_RENEWALAUTOCOMPLETE:
        return new RenewalAutoCompleteBatchProcess()
      case BatchProcessType.TC_TENANTINSPECTION:
        return new TenantInspectionBatchProcess()
      case BatchProcessType.TC_OPENRENEWALSAUTOMATION:
        return new OpenRenewalsAutomationBatchProcess()
        default:
        return null
    }
  }
}
