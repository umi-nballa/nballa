package gw.acc.bulkproducerchange

enhancement BPCRecord_ExtEnhancement : entity.BPCRecord_Ext {
 
  /**
   * Cancel the Bulk Producer Record
   */
  function cancel() {
    if (this.Status == BPCRecordStatus_Ext.TC_UNPROCESSED) {
      this.Status = BPCRecordStatus_Ext.TC_CANCELED
      this.Reason = BPCReason_Ext.TC_CANCELLED
    }
  }
  
  /**
   * Undo Cancel on the Bulk Producer Record
   */
  function uncancel() {
    if (this.Status == BPCRecordStatus_Ext.TC_CANCELED) {
      this.Status = BPCRecordStatus_Ext.TC_UNPROCESSED
      this.Reason = null
    }
  }
}
