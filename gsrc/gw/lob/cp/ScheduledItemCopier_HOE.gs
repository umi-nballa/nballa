package gw.lob.cp

uses gw.api.copier.AbstractEffDatedCopyable

class ScheduledItemCopier_HOE extends AbstractEffDatedCopyable<ScheduledItem_HOE> {

  construct(item : ScheduledItem_HOE) {
    super(item)
  }

  override function copyBasicFieldsFromBean(item : ScheduledItem_HOE) {
    _bean.ExposureValue = item.ExposureValue
    _bean.AdditionalLimit = item.AdditionalLimit
  }
}
