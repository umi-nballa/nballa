package onbase.api.services

uses onbase.api.Settings

uses java.lang.Throwable
uses java.lang.IllegalStateException
uses java.util.concurrent.atomic.AtomicInteger
uses java.util.concurrent.atomic.AtomicLong
uses java.util.concurrent.locks.ReentrantLock
uses onbase.api.exception.BreakerOpenException
uses java.lang.Exception

/**
 *  Breaker-pattern for service calls
 *  <p>
 *  Single static class to track service calls and fail open to quickly return to users if a service is down.
 */
 /**
 *
 * Hyland Build Version: 16.0.0.999
 *
 */
final class Breaker {
  private enum BreakerStatus{ CLOSED, OPEN, HALF_OPEN }
  private static final var _RETRYTIME : int = Settings.BreakerRetryTime
  private static final var _ERRORTHRESHOLD : int= Settings.BreakerErrorTrigger
  private static final var _EXCEPTIONLIST : Type[] = Settings.BreakerExceptionList
  private static final var _STATELOCK = new ReentrantLock()
  private static final var _errorCount = new AtomicInteger()
  private static final var _timeTripped = new AtomicLong()
  private static var _state = BreakerStatus.CLOSED
  private static var NANOCONV = 1000000000
  private construct(){}


  public static function checkedCall<T>(serviceBlock: block():T) : T {
    verifyBreaker()
    var result : T
    try {
      result = serviceBlock()
      closeBreaker()
      return result
    } catch (ex: Exception) {
      checkAndRethrow(ex)
    }

    return null
  }

  public static function checkedCallVoid(serviceBlock: block()) {
    try {
      serviceBlock()
      closeBreaker()
    } catch (ex: Exception) {
      checkAndRethrow(ex)
    }
  }
  /**
   *  Verify breaker status before service call
   *  <p>
   *  Call before executing an expensive service call to validate breaker status and throw an exception if
   *  calls have previously failed the breaker open.
   *
   *  @throws BreakerOpenException
   */
  private static function verifyBreaker() {
    if( _state == BreakerStatus.OPEN ){
      if( (java.lang.System.nanoTime() - _timeTripped.get() ) > NANOCONV * _RETRYTIME ){
        SetBreaker(BreakerStatus.HALF_OPEN)
      } else {
        throw new BreakerOpenException("Service call failed. Breaker open.")
      }
    }
  }

  /**
   * Call after service statement
   */
  private static function closeBreaker(){
    if( _state == BreakerStatus.CLOSED ){
      _errorCount.lazySet(0)
    } else {
      SetBreaker(BreakerStatus.CLOSED)
    }
  }

  /**
   * Call when service statement has thrown an exception\
   *
   * @param exception Exception thrown by the service call
   */
  private static function checkAndRethrow(exception : Throwable){
    switch(_state){
      case BreakerStatus.OPEN:
          throw new IllegalStateException("checkAndRethrow should not be called while breaker is open.  Call verifyBreaker before service call")
      case BreakerStatus.CLOSED: // Normal case
      case BreakerStatus.HALF_OPEN:
          var checkEx = exception
          // Loop through, check exceptions
          while( checkEx != null ){
            for( var exType in _EXCEPTIONLIST ){
              if(exType.isAssignableFrom( typeof checkEx ) ){
                if( _errorCount.incrementAndGet() > _ERRORTHRESHOLD ){
                  SetBreaker( BreakerStatus.OPEN )
                  throw new BreakerOpenException("Service called failed.  Breaker failed open", exception)
                }
              }
            }
            checkEx = checkEx.Cause
          }

          throw exception
    }
  }

  private static function SetBreaker( newState : BreakerStatus ){
    try
    {
      _STATELOCK.lock()
      switch(newState){
        case BreakerStatus.CLOSED:
            _errorCount.set(0)
            _timeTripped.set(0)
            _state = BreakerStatus.CLOSED
            break;
        case BreakerStatus.OPEN:
            _state = BreakerStatus.OPEN
            _timeTripped.set( java.lang.System.nanoTime() )
            break;
        case BreakerStatus.HALF_OPEN:
            _state = BreakerStatus.HALF_OPEN
            break;
      }
    }
        finally{
      if( _STATELOCK.HeldByCurrentThread ){
        _STATELOCK.unlock()
      }
    }

  }

  /**
   *  Verify breaker status
   *
   *  @return Boolean true in case the breaker is open, but otherwise returns false.
   */
  public static function isBreakerOpen() :Boolean {
    if( _state == BreakerStatus.OPEN ){
      return true
    }
    return false
  }
}

