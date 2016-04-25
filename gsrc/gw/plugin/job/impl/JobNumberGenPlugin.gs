package gw.plugin.job.impl

uses gw.plugin.jobnumbergen.IJobNumberGenPlugin
uses java.lang.Integer
uses java.util.concurrent.atomic.AtomicInteger
uses gw.api.database.Query
uses gw.plugin.util.SequenceUtil
uses una.utils.StringUtil


@Export
class JobNumberGenPlugin implements IJobNumberGenPlugin {
  
  static var counter = new AtomicInteger(0)

  /**
   * This cheater implementation does a few tricks to make the job numbers semi-random
   * but also gradually increasing, while taking care not to generate duplicates.
   */
  override function genNewJobNumber( p0: Job ) : String {
    var potentialNumber : String
    do {
      potentialNumber = genSeqNumber(p0)
    } while (jobWithNumberExists(potentialNumber))
    return potentialNumber
  }

  protected function genSeqNumber(p0: Job): String {
    var strUtil = new StringUtil(p0.LatestPeriod)
    var counterString  = "Q" + p0.LatestPeriod.BaseState.Code + strUtil.firstLetterLOB()
    return counterString + String.format("%010d" , {SequenceUtil.getSequenceUtil().next(0000000001, counterString)})
  }


  protected function genPotentialNumber(): String {
    var counterString = Integer.toString(counter.AndIncrement)
    while (counterString.length() < 5) {
      counterString = "0" + counterString
    }
    return counterString + org.apache.commons.lang.RandomStringUtils.random(5, "0123456789")
  }

  private function jobWithNumberExists(jobNumber: String): boolean {
    return Query.make(Job).compare(Job#JobNumber.PropertyInfo.Name, Equals, jobNumber).select().HasElements    
  }

}
