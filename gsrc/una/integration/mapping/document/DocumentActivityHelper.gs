package una.integration.mapping.document
/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 3/1/17
 * Time: 2:59 PM
 */

class DocumentActivityHelper {


  function checkAgentNumber(document: Document, period: PolicyPeriod): boolean {
    var agentList = {3668, 28500, 28000, 28300, 28301, 28400, 90194, 29000, 89070, 89076}

    for (agentNo in agentList) {
      if (agentNo == period.ProducerOfRecord.AgenyNumber_Ext as int){
        return true
      }
    }

    return false
  }
}