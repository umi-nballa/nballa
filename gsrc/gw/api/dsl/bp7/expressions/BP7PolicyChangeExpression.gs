package gw.api.dsl.bp7.expressions
uses java.util.ArrayList
uses gw.api.builder.PolicyChangeBuilder
uses gw.api.builder.PolicyLocationBuilder

class BP7PolicyChangeExpression {
  var _initialPeriod : PolicyPeriod
  var _days : int
  var _state : State 
  var _updates : List<BP7UpdateExpression> = new ArrayList<BP7UpdateExpression>()
  
  construct(initialPeriod : PolicyPeriod) {
    _initialPeriod = initialPeriod
  }

  function after(days : int) : BP7PolicyChangeExpression {
    _days = days  
    return this
  }
  
  function thatAddsLocation(state: State) : BP7PolicyChangeExpression {
    _state = state
    return this
  }

  function that(update : BP7UpdateExpression) : BP7PolicyChangeExpression {
    _updates.add(update)
    return this
  }

  function create() : PolicyPeriod {
    var changedPeriodBuilder = new PolicyChangeBuilder()
    .isDraft()
    .withBasedOnPeriod(_initialPeriod)
    .withEffectiveDate(_initialPeriod.PeriodStart.addDays(_days))
    
    if (_state != null) {
      changedPeriodBuilder.withPolicyLocation(new PolicyLocationBuilder().withState(_state))
    }
    
    var changedPeriod = changedPeriodBuilder.create()      

    _updates.each(\ u -> u.update(changedPeriod.BP7Line) )
    
    return changedPeriod
  }

}
