package una.integration.lexisnexis.util
/**
 * Created with IntelliJ IDEA.
 * User: ptheegala
 * Date: 1/13/17
 *
 */
class ClueUtilInfo {

  static function copyClueReport(oldPeriod:PolicyPeriod,newPeriod:PolicyPeriod)  {
    //Copy Clue Data
    var prevPriorLoss = oldPeriod.HomeownersLine_HOE.HOPriorLosses_Ext
    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
    for(res in prevPriorLoss){
      var priorLoss = new HOPriorLoss_Ext()
      priorLoss.sync(res)
      priorLoss.HomeownersLineID = newPeriod.HomeownersLine_HOE.PublicID
    }
  },"su")

 }
}