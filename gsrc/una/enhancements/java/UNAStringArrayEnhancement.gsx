package una.enhancements.java
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 7/10/17
 * Time: 10:48 AM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAStringArrayEnhancement<T extends String> : T[]{
  public function containsIgnoreCase(searchString : T) : boolean{
    return this.hasMatch( \ element -> element?.equalsIgnoreCase(searchString))
  }
}
