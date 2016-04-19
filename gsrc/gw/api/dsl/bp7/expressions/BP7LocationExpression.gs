package gw.api.dsl.bp7.expressions

uses gw.api.databuilder.bp7.BP7LocationBuilder
uses gw.api.dsl.common.PolicyLocationExpression
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.ClauseBuilder
uses gw.api.builder.TerritoryCodeBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.dsl.common.EntityRetriever

class BP7LocationExpression extends DataBuilderExpression<BP7LocationBuilder> {
  var _policyLocation : PolicyLocationBuilder as PolicyLocation
  
  construct() {
    super(new BP7LocationBuilder())
  }

  function withPolicyLocation(__policyLocation : PolicyLocationBuilder) : BP7LocationExpression {
    _policyLocation = __policyLocation
    _builder.withLocation(_policyLocation)
    return this
  }

  function with(__policyLocation : PolicyLocationExpression) : BP7LocationExpression {
    _builder.withLocation(__policyLocation.DataBuilder)
    return this
  }

  function withFeetToHydrant(feetToHydrant: BP7FeetToHydrant) : BP7LocationExpression {
    _builder.withFeetToHydrant(feetToHydrant)
    return this 
  }
  
  function withFireProtectionClass(fireProtectionClass: BP7FireProtectionClassPPC) : BP7LocationExpression {
    _builder.withFireProtectionClass(fireProtectionClass)
    return this 
  }

  function withLiquorLiabGrade(liquorLiabGrade: int) : BP7LocationExpression {
    _builder.withLiquorLiabGrade(liquorLiabGrade)
    return this 
  }

  function with(building : BP7BuildingExpression) : BP7LocationExpression {
    _builder.withBuilding(building.DataBuilder)
    _policyLocation.withBuilding(building.Building)
    return this
  }

  function with(clause : DataBuilderExpression<ClauseBuilder>) : BP7LocationExpression {
    if (clause typeis DataBuilderExpression<CoverageBuilder>) {
      _builder.withCoverage(clause.DataBuilder)
    } else if (clause typeis DataBuilderExpression<ExclusionBuilder>) {
      _builder.withExclusion(clause.DataBuilder)
    } else if (clause typeis DataBuilderExpression<PolicyConditionBuilder>) {
      _builder.withCondition(clause.DataBuilder)
    } else {
      throw "expression provided is not an expression for a clause builder"
    }
    return this
  }

  function withTerritoryCode(code : String) : BP7LocationExpression {
    var territoryCodeBuilder = new TerritoryCodeBuilder()
      .withCode(code)
      .withPolicyLinePattern("BP7Line")
    PolicyLocation.withTerritoryCode(territoryCodeBuilder)
    return this
  }

  function fromPeriod(period : PolicyPeriod) : BP7Location {
    return new EntityRetriever<BP7Location>(_builder).fromPeriod(period)
  }
}
