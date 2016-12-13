package una.enhancements.entity

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 12/6/16
 * Time: 4:15 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAHOLineCovEnhancement : entity.HomeownersLineCov_HOE {
  public function addScheduledAdditionalInsured(scheduledInsured : PolicyAddlInsuredDetail) : HOscheduleItem_HOE_Ext{
    var item = this.scheduledItem_Ext.atMostOneWhere( \ i -> i.AdditionalInsured == scheduledInsured)

    if(this.ScheduleItemsAutoNumberSeq_Ext == null){
      this.ScheduleItemsAutoNumberSeq_Ext = new AutoNumberSequence()
    }

    if(item == null){
      item = new HOscheduleItem_HOE_Ext(this.Branch)
      item.AdditionalInsured = scheduledInsured

      this.addToScheduledItem_Ext(item)
      this.ScheduleItemsAutoNumberSeq_Ext.number(item, this.scheduledItem_Ext, HOscheduleItem_HOE_Ext.Type.TypeInfo.getProperty("ItemNum"))
    }

    return item
  }

  function removeScheduledAdditionalInsuredItem(item: HOscheduleItem_HOE_Ext) {
    this.removeFromScheduledItem_Ext(item)
    renumberScheduledItems()
  }

  private function renumberScheduledItems() {
    this.ScheduleItemsAutoNumberSeq_Ext.renumber(this.scheduledItem_Ext, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNum") )
  }
}
