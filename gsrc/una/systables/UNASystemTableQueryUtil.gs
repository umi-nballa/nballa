package una.systables

uses gw.entity.IEntityType
uses java.util.Map
uses gw.api.database.Query

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/10/16
 * Time: 12:40 PM
 * To change this template use File | Settings | File Templates.
 */
class UNASystemTableQueryUtil {

  static function query(entityType : IEntityType, arguments : Map<String, Object>, ignoreCase : boolean) : List<String> {
    return query(entityType, arguments, "Value", ignoreCase)
  }

  private static function query(entityType : IEntityType, arguments : Map<String, Object>, returnColumn : String, ignoreCase : boolean) : List<String> {
    var query = Query.make(entityType)

    if(ignoreCase){
      return addFilterIgnoreCase(query, arguments).select().map(\ result -> result.getFieldValue(returnColumn)?.toString())
    }else{
      return addFilter(query, arguments).select().map(\ result -> result.getFieldValue(returnColumn)?.toString())
    }
  }

  private static function addFilter(query : Query, arguments : Map<String, Object>) : Query {
    arguments.eachKeyAndValue(\ argKey, argValue -> query.compare(argKey, Equals, argValue))
    return query
  }

  private static function addFilterIgnoreCase(query : Query, arguments : Map<String, Object>) : Query {
    arguments.eachKeyAndValue(\ argKey, argValue -> {
      if(argValue typeis String){
        query.compareIgnoreCase(argKey, Equals, argValue)
      }else{
        query.compare(argKey, Equals, argValue)
      }
    })
    return query
  }
}