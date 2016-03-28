package gw.lob.ho

uses gw.pl.persistence.core.Bundle

enhancement DwellingCovEnhancement_HOE : entity.DwellingCov_HOE {
  
  function addScheduledItem(item: ScheduledItem_HOE){
    this.addToScheduledItems(item)
    this.ScheduledItemAutoNumberSeq.number(item, this.ScheduledItems, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber"))
  }
  
  function removeScheduledItem(item: ScheduledItem_HOE) {
    this.removeFromScheduledItems(item)
    renumberScheduledItems()
  }
  
  function cloneScheduledItemAutoNumberSequence() {
    this.ScheduledItemAutoNumberSeq = this.ScheduledItemAutoNumberSeq.clone( this.Bundle )
  }
  
  function resetScheduledItemAutoNumberSequence() {
    this.ScheduledItemAutoNumberSeq.reset()
    renumberScheduledItems()
  }
  
  function bindScheduledItemAutoNumberSequence() {
    renumberScheduledItems()
    this.ScheduledItemAutoNumberSeq.bind( this.ScheduledItems, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber"))
  }
  
  function initializeScheduledItemAutoNumberSequence(bundle : Bundle) {  
    this.ScheduledItemAutoNumberSeq = new AutoNumberSequence(bundle)
  }
  
  private function renumberScheduledItems() {
    this.ScheduledItemAutoNumberSeq.renumber(this.ScheduledItems, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber") )
  }
  
}
