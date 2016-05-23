package gw.lob.common.schedules

enhancement ScheduleEnhancement : gw.api.productmodel.Schedule {

  property get isComplexSchedule() : boolean {
    return not isSimpleSchedule
  }

  property get isSimpleSchedule() : boolean {
    return this.ScheduledItemMultiPatterns == null or this.ScheduledItemMultiPatterns.IsEmpty
  }
}
