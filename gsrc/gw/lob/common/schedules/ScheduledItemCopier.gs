package gw.lob.common.schedules

uses gw.api.copier.EffDatedCopier

class ScheduledItemCopier extends EffDatedCopier {

  construct(scheduledItem : EffDated){
    super(scheduledItem)
  }

  override function shouldExclude(colName: String): boolean {
    return super.shouldExclude(colName) or colName == "ScheduleNumber"
  }
}