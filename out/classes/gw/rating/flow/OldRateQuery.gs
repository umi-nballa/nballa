package gw.rating.flow

uses java.lang.Comparable
uses java.lang.Integer
uses java.lang.IllegalArgumentException

/**
 * Replicating the old Rate Query where the withParam method takes a name instead of an index
 **/

class OldRateQuery<R> extends RateQuery<R> {
   construct(rbook : RateBook, tableCode : String) {
     super(rbook, tableCode)
   }

  function withParam<T extends Comparable>(matchOpName : String, value : T) : OldRateQuery<R> {
    var pos = getMatchOpIndex(matchOpName)
    return super.withParam(pos, value) as OldRateQuery<R>
  }

  function getMatchOpIndex(matchOpName : String) : int {
    var paramIndex : Integer
    for(matchOp in TableDef.SortedMatchOps index idx ) {
      if(matchOp.Name== matchOpName) {
        paramIndex = idx
        break
      }
    }
    if(paramIndex == null) {
      throw new IllegalArgumentException("Match Op ${matchOpName} not in matchops for table ${TableName}")
    }
    return paramIndex
  }
}
