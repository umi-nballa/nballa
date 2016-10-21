package una.config
/**
 * Created with IntelliJ IDEA.
 * User: skashyap
 * Date: 10/21/16
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 */
class Locationutil {

  public static function isTerritoryCodeRequired(territoryCode:TerritoryCode, line:String):boolean
  {
    if(line!=null && line.equals("cpline") && territoryCode.PolicyLinePattern.CodeIdentifier=="CPLine")
      return true
    else
      {
        if(territoryCode.PolicyLinePattern.CodeIdentifier=="GLLine")
          territoryCode.Code="55"
      return false
      }
  }
}