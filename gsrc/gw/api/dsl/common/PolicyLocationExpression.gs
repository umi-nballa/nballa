package gw.api.dsl.common

uses gw.api.builder.PolicyLocationBuilder
uses java.lang.Integer

class PolicyLocationExpression extends DataBuilderExpression<PolicyLocationBuilder> {

  internal construct() {
    super(new PolicyLocationBuilder())
  }

  construct(builder : PolicyLocationBuilder) {
    super(builder)
  }

  function withName(name : String) : PolicyLocationExpression {
    _builder.withName(name)    
    return this
  }

  function withDescription(description : String) : PolicyLocationExpression {
    _builder.withDescription(description)
    return this
  }

  function with(state: State) : PolicyLocationExpression {
    _builder.withState(state)
    return this
  }

  function with(accLoc : AccountLocation) : PolicyLocationExpression {
    _builder.withAccountLocation(accLoc)
    return this
  }

  function with(accLoc : AccountLocationExpression) : PolicyLocationExpression {
    _builder.withAccountLocation(accLoc.DataBuilder)
    return this
  }

  function on(period : PolicyPeriod) : PolicyLocationExpression {
    _builder.onPeriod(period)
    return this
  }

  function with(fireProtectClass : FireProtectClass) : PolicyLocationExpression {
    _builder.withFireProtectClass(fireProtectClass)
    return this
  }

  function withLocationNumber(number : Integer) : PolicyLocationExpression {
    _builder.withLocationNumber(number)
    return this
  }

  function asActive() : PolicyLocationExpression {
    _builder.asActive()
    return this
  }

  function asInactive() : PolicyLocationExpression {
    _builder.asInactive()
    return this
  }

  function asSpecific() : PolicyLocationExpression {
    _builder.asSpecific()
    return this
  }

  function asNonSpecific() : PolicyLocationExpression {
    _builder.asNonSpecific()
    return this
  }

  function asHomeAddress() : PolicyLocationExpression {
    _builder.asHomeAddress()
    return this
  }

  function withCode(code : String) : PolicyLocationExpression {
    _builder.withCode(code)
    return this
  }

  function withEmployeeCount(count : int) : PolicyLocationExpression {
    _builder.withEmployeeCount(count);
    return this
  }

  function on(account : Account) : PolicyLocationExpression {
    _builder.onAccount(account);
    return this
  }

  function withAddressLine1(addressLine1 : String) : PolicyLocationExpression {
    _builder.withAddressLine1(addressLine1);
    return this
  }

  function withAddressLine2(addressLine2 : String) : PolicyLocationExpression {
    _builder.withAddressLine2(addressLine2);
    return this
  }

  function withAddressLine3(addressLine3 : String) : PolicyLocationExpression {
    _builder.withAddressLine3(addressLine3);
    return this
  }

  function withCity(city : String) : PolicyLocationExpression {
    _builder.withCity(city);
    return this
  }

  function withCounty(county : String) : PolicyLocationExpression {
    _builder.withCounty(county);
    return this
  }

  function withPostalCode(postalCode : String) : PolicyLocationExpression {
    _builder.withPostalCode(postalCode);
    return this
  }

  function withTerritoryCode(territoryCode : TerritoryCodeExpression) : PolicyLocationExpression {
    _builder.withTerritoryCode(territoryCode.DataBuilder)
    return this
  }
}
