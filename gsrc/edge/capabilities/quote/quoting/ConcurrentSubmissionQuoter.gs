package edge.capabilities.quote.quoting

uses java.util.TimerTask
uses java.util.concurrent.CountDownLatch
uses java.lang.Exception
uses una.logging.UnaLoggerCategory

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 8/28/17
 * Time: 9:57 AM
 * To change this template use File | Settings | File Templates.
 *
 */
class ConcurrentSubmissionQuoter extends TimerTask{
  private var _period : PolicyPeriod
  private var _doneSignal : CountDownLatch
  private final static var _LOGGER = UnaLoggerCategory.UNA_EDGE_API

  construct(p : PolicyPeriod, doneSignal : CountDownLatch){
    this._period = p
    this._doneSignal = doneSignal
  }

  override function run(){
    if(!_period.Bundle.ReadOnly){
      _period.Bundle.commit()//commit before moving forward
    }

    gw.transaction.Transaction.runWithNewBundle(\ bundle -> {
      _period = bundle.add(_period)

      try{
        if(_period.SubmissionProcess?.canRequestQuote().Okay){
          _period.SubmissionProcess.requestQuote()
        }
      }catch(e : Exception){
        _LOGGER.error(e)
      } finally{
        _doneSignal.countDown()
      }
    }, "su")
  }
}