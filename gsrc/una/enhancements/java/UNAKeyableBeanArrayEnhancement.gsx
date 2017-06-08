package una.enhancements.java
/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 6/7/17
 * Time: 3:28 PM
 * To change this template use File | Settings | File Templates.
 */
enhancement UNAKeyableBeanArrayEnhancement<T extends KeyableBean> : T[] {
  function removeWhere(condition(elt : T) : boolean){
    this.each( \ elt -> {
      if(condition(elt)){
        elt.remove()
      }
    })
  }
}
