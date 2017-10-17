package gw.plugin.processing

uses edge.capabilities.document.DocumentSessionCleanupBatchProcess
uses edge.capabilities.quote.session.QuoteSessionCleanupBatchProcess
uses gw.acc.bulkproducerchange.BPCBatchProcess
uses gw.processes.ApplyPendingAccountDataUpdates
uses gw.processes.BatchProcess
uses gw.processes.PolicyRenewalClearCheckDate
uses gw.processes.SolrDataImportBatchProcess
uses una.integration.batch.TenantInspectionBatchProcess
uses una.integration.batch.outbound.lexisfirst.LexisFirstOutboundBatchProcess
uses una.integration.batch.renewal.OpenRenewalsAutomationBatchProcess
uses una.integration.batch.renewal.RenewalAutoCompleteBatchProcess
uses una.integration.batch.PolicyRefreshBatchProcess

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
      //Lexis First
      case BatchProcessType.TC_LEXISFIRSTOUTBOUND:
        return new LexisFirstOutboundBatchProcess()
      //Bulk Producer Change Accelerator -- Batch Process addition
      case BatchProcessType.TC_BULKPRODUCERCHANGE_EXT:
        return new BPCBatchProcess()
      case BatchProcessType.TC_RENEWALAUTOCOMPLETE:
        return new RenewalAutoCompleteBatchProcess()
      case BatchProcessType.TC_TENANTINSPECTION:
        return new TenantInspectionBatchProcess()
      case BatchProcessType.TC_OPENRENEWALSAUTOMATION:
        return new OpenRenewalsAutomationBatchProcess()
      // Policy Refresh Service to send future dated changes to the Portal
      case BatchProcessType.TC_POLICYREFRESHFUTUREDATEDTRANS_EXT:
        return new PolicyRefreshBatchProcess()
      default:
        return null
    }
  }
}
