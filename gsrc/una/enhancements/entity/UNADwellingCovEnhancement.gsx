package una.enhancements.entity
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 12/6/16
 * Time: 8:18 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNADwellingCovEnhancement : DwellingCov_HOE {
  public function addScheduledAdditionalInsured(scheduledInsured : PolicyAddlInsuredDetail) : ScheduledItem_HOE{
    var item = this.ScheduledItems.atMostOneWhere( \ i -> i.AdditionalInsured == scheduledInsured)

    if(this.ScheduledItemAutoNumberSeq == null){
      this.ScheduledItemAutoNumberSeq = new AutoNumberSequence()
    }

    if(item == null){
      item = new ScheduledItem_HOE(this.Branch)

      item.AdditionalInsured = scheduledInsured
      this.ScheduledItemAutoNumberSeq.number(item, this.ScheduledItems, ScheduledItem_HOE.Type.TypeInfo.getProperty("ItemNumber"))
      this.addToScheduledItems(item)

      this.addToScheduledItems(item)
    }

    return item
  }

  function removeScheduledAdditionalInsuredItem(item: ScheduledItem_HOE) {
    this.removeFromScheduledItems(item)
    this.renumberScheduledItems()
  }
}
