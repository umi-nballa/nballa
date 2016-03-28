package gw.lob.ho

class TransactionHelper_HOE {

  static function getDescription(tx : HOTransaction_HOE, def : String) : String {
    var cost = tx.HomeownersCost
    var subDesc = ""
    if (cost typeis ScheduleByTypeCovCost_HOE) {
      subDesc = cost.ScheduleType.DisplayName
    } else if (cost typeis HOLocationCovCost_HOE or cost typeis ScheduleByLocCovCost_HOE) {
      subDesc = cost.Location.DisplayName
    } else if (cost typeis ScheduleCovCost_HOE) {
      subDesc = cost.ScheduledItem.DisplayName
    }
    var covDesc = cost.Coverage.Pattern.DisplayName
    return (covDesc == null or covDesc.Empty ? def : covDesc) +
           (subDesc.Empty ? "" : "\n" + gw.api.web.HtmlUtil.indent(subDesc, ScriptParameters.HOQuoteLevel2Indent))
  }

}
