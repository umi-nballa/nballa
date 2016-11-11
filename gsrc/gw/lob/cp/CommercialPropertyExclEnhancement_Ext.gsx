package gw.lob.cp

uses gw.pl.persistence.core.Bundle
uses java.math.BigDecimal

/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 11/11/16
 * Time: 4:39 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement CommercialPropertyExclEnhancement_Ext : entity.CommercialPropertyExcl {

  function addScheduledItem(item: CPscheduleItem_CP_Ext){

    this.addToScheduledItem_Ext(item)
    //this.ScheduleItemsAutoNumberSeq_Ext.number(item, this.scheduledItem_Ext, CPscheduleItem_CP_Ext.Type.TypeInfo.getProperty("ItemNum"))
  }

  function removeScheduledItem(item: CPscheduleItem_CP_Ext):boolean {
    this.removeFromScheduledItem_Ext(item)
    return true
    //renumberScheduledItems()
  }
  private function renumberScheduledItems() {
    this.ScheduleItemsAutoNumberSeq_Ext.renumber(this.scheduledItem_Ext, CPscheduleItem_CP_Ext.Type.TypeInfo.getProperty("ItemNum") )

  }

  function cloneScheduledItemAutoNumberSequence() {
    this.ScheduleItemsAutoNumberSeq_Ext = this.ScheduleItemsAutoNumberSeq_Ext.clone( this.Bundle )
  }

  function resetScheduledItemAutoNumberSequence() {
    this.ScheduleItemsAutoNumberSeq_Ext.reset()
    renumberScheduledItems()
  }

  function bindScheduledItemAutoNumberSequence() {
    renumberScheduledItems()
    this.ScheduleItemsAutoNumberSeq_Ext.bind( this.scheduledItem_Ext, CPscheduleItem_CP_Ext.Type.TypeInfo.getProperty("ItemNum"))
  }

  function initializeScheduledItemAutoNumberSequence(bundle : Bundle) {
    this.ScheduleItemsAutoNumberSeq_Ext = new AutoNumberSequence(bundle)
  }

  property get scheduleItem():CPscheduleItem_CP_Ext[]
  {
    return this.scheduledItem_Ext
  }

}
