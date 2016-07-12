package una.enhancements.java

uses java.lang.IllegalStateException
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/6/16
 * Time: 10:58 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAIterableEnhancement<T> : java.lang.Iterable <T>{
  /**
   * Returns an expected one element that matches the given condition
   * If no element matches the criteria, null is returned.
   * If more than one element matches the given condition, an exception is thrown.
   * This function is useful when only one element in an array (i.e. a vendor report id in an array of vendor reports) should match a given condition
   */
  function atMostOneWhere( condition(elt:T):boolean ) : T {
    var results = this.where(condition)

    return results.atMostOne()
  }

  function atMostOne() : T{
    if(this.Count > 1){
      throw new IllegalStateException("More than one element matches the given condition.")
    }

    return this.first()
  }
}
