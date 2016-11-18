package una.systables

uses gw.entity.IEntityType
uses java.util.Map
uses java.lang.IllegalArgumentException
uses gw.api.database.Query

/**
 * Created with IntelliJ IDEA.
 * User: TVang
 * Date: 11/10/16
 * Time: 12:40 PM
 * To change this template use File | Settings | File Templates.
 */
class UNASystemTableQueryUtil {
  static function query(entityType : IEntityType, arguments : Map<String, Object>, returnColumn : String) : List<String> {
    return addFilter(Query.make(entityType), arguments).select().map(\ result -> result.getFieldValue(returnColumn)?.toString())
  }

  static function query(entityType : IEntityType, arguments : Map<String, Object>) : List<String> {
    return query(entityType, arguments, "Value")
  }


  private static function assertNonEmpty(arguments : Map<String, Object>) {
    if (arguments.Empty)
      throw new IllegalArgumentException("argument list must not be empty")
  }

  private static function addFilter(query : Query, arguments : Map<String, Object>) : Query {
    arguments.eachKeyAndValue(\ argKey, argValue -> query.compare(argKey, Equals, argValue))
    return query
  }
}