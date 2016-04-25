package una.utils
/**
 * Created with IntelliJ IDEA.
 * User: pyerrumsetty
 * Date: 4/21/16
 * Time: 7:08 PM
 */
class StringUtil_EXT {

   var _polPeriod : PolicyPeriod

   construct(pp : PolicyPeriod){
     _polPeriod = pp
   }

   private property get PolicyPeriod() : PolicyPeriod{
     return _polPeriod
   }

  /**
   * Function to return Single letter for line of business for Quote
   * and PolicyNumbers
   */
  function firstLetterLOB() : String {
    var value : String

    if(PolicyPeriod.BOPLineExists){
      value = displaykey.Ext.bopline
    }

    if(PolicyPeriod.HomeownersLine_HOEExists) {
      value = displaykey.Ext.homeownersline
    }

    if(PolicyPeriod.CPLineExists){
      value = displaykey.Ext.cpline
    }
    return value
  }


}