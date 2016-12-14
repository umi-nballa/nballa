package una.pageprocess.producer

uses gw.api.database.Query
/**
 * Created with IntelliJ IDEA.
 * User: sghosh
 * Date: 12/13/16
 * Time: 1:43 PM
 * To change this template use File | Settings | File Templates.
 */
class ProducerEditControl {
 public static function hasEditProducerOnlyRole(): boolean{
   var res = false
   var theEditProducerRole = Query.make(Role).compare("Name", Equals, "UNAEditProducerOnly").select()?.first()
   if(theEditProducerRole != null && User.util.CurrentUser.hasRole(theEditProducerRole)){
     res = true
   }
   return res
 }
}