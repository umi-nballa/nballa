package una.enhancements.java
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 2/21/17
 * Time: 4:41 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAStringIterableEnhancement<T extends String> : java.lang.Iterable<T> {
  public function containsIgnoreCase(searchString : T) : boolean{
    return this.hasMatch( \ element -> element?.equalsIgnoreCase(searchString))
  }
}
