package gw.rating.rtm.matchop

uses gw.api.database.Query
uses gw.api.database.Relop
uses gw.rating.rtm.domain.OrderedPersistenceAdapter
uses java.lang.Comparable

class StatelessGreaterThanMatch extends StatelessGreaterThanOrEqualMatch {
   construct(matchOp : RateTableMatchOp) {
     super(matchOp)
   }

  override function filter(query: Query<KeyableBean>, arg: Comparable<Object>) {
    query.compare(ColumnName, Relop.LessThan, arg)
  }

  override protected function compareMax(bean : OrderedPersistenceAdapter, arg : Comparable) : int {
    // Return "equal" until we encounter a bean which is >= arg
    return bean.get(this.ArgIndex).compareTo(arg) < 0 ? 0 : 1
  }
}