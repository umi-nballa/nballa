package una.integration.mapping.hpx
/**
 * Created with IntelliJ IDEA.
 * User: ANanayakkara
 * Date: 8/22/16
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
class HPXDwellingCoverageMapper extends HPXCoverageMapper{
  function createScheduleList(currentCoverage : Coverage, previousCoverage : Coverage)  : java.util.List<wsi.schema.una.hpx.hpx_application_request.Limit> {
    var limits = new java.util.ArrayList<wsi.schema.una.hpx.hpx_application_request.Limit>()
    if (currentCoverage.PatternCode.equals("HODW_OtherStructuresOnPremise_HOE")) {
      var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_OtherStructuresOnPremise_HOE.ScheduledItems
      var i=0
      for (item in scheduleItems) {
        i++
        var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
        var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
        var formatPct = new wsi.schema.una.hpx.hpx_application_request.FormatPct()
        var transactionSeqNo = new wsi.schema.una.hpx.hpx_application_request.TransactionSeqNumber()
        if (item.Description != null) {
          limitDesc.setText(item.Description)
          limit.addChild(limitDesc)
        }
        if(item.AdditionalLimit != null) {
          formatPct.setText(item.AdditionalLimit.Code)
          limit.addChild(formatPct)
        }
        transactionSeqNo.setText(i)
        limit.addChild(transactionSeqNo)
        limits.add(limit)
      }
    } else if (currentCoverage.PatternCode.equals("HODW_ScheduledProperty_HOE")) {
      var i=0
      var scheduleItems = (currentCoverage.OwningCoverable as coverable as Dwelling_HOE).HODW_ScheduledProperty_HOE.ScheduledItems
      for (item in scheduleItems) {
        i++
        var limit = new wsi.schema.una.hpx.hpx_application_request.Limit()
        var limitDesc = new wsi.schema.una.hpx.hpx_application_request.LimitDesc()
        var scheduleType = new wsi.schema.una.hpx.hpx_application_request.CoverageSubCd()
        var writtenAmt = new wsi.schema.una.hpx.hpx_application_request.WrittenAmt()
        var amt = new wsi.schema.una.hpx.hpx_application_request.Amt()
        var transactionSeqNo = new wsi.schema.una.hpx.hpx_application_request.TransactionSeqNumber()
        if (item.ScheduleType != null) {
          scheduleType.setText(item.ScheduleType)
          limit.addChild(scheduleType)
        }
        if (item.Description != null) {
          limitDesc.setText(item.Description)
          limit.addChild(limitDesc)
        }
        if(item.ExposureValue != null) {
          amt.setText(item.ExposureValue)
          writtenAmt.addChild(amt)
          limit.addChild(writtenAmt)
        }
        transactionSeqNo.setText(i)
        limit.addChild(transactionSeqNo)
        limits.add(limit)
      }
    }
    return limits
  }
}