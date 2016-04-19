package gw.api.dsl.bp7.expressions

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.databuilder.bp7.BP7ClassificationBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.ClauseBuilder
uses java.lang.Integer
uses gw.api.dsl.common.EntityRetriever

class BP7ClassificationExpression extends DataBuilderExpression<BP7ClassificationBuilder> {
  construct(number : Integer = null) {
    super(new BP7ClassificationBuilder())
    if(number != null) {
      _builder.withClassificationNumber(number)
    }
  }  

  function with(clause : DataBuilderExpression<ClauseBuilder>) : BP7ClassificationExpression {
    if (clause typeis DataBuilderExpression<CoverageBuilder>) {
      _builder.withCoverage(clause.DataBuilder)
    }else if (clause typeis DataBuilderExpression<ExclusionBuilder>) {
      _builder.withExclusion(clause.DataBuilder)
    }else if (clause typeis DataBuilderExpression<PolicyConditionBuilder>) {
      _builder.withCondition(clause.DataBuilder)
    } else {
      throw "expression provided is not an expression for a clause builder"
    }
    return this
  }

  function withClassPropertyType(propertyType : typekey.BP7ClassificationPropertyType) : BP7ClassificationExpression {
    _builder.withClassPropertyType(propertyType)
    return this
  }

  function withClassDescription(classDescription : typekey.BP7ClassDescription) : BP7ClassificationExpression {
    _builder.withClassDescription(classDescription)
    return this
  }

  function withExposureBasis(exposureBasis : typekey.BP7ExposureBasis) : BP7ClassificationExpression {
    _builder.withExposureBasis(exposureBasis)
    return this
  }
  
  function withExposure(exposure : Integer) : BP7ClassificationExpression {
    _builder.withExposure(exposure)
    return this
  }
  
  function withArea(area : int) : BP7ClassificationExpression {
    _builder.withArea(area)
    return this
  }

  function withAmusementArea(amusementArea : boolean) : BP7ClassificationExpression {
    _builder.withAmusementArea(amusementArea)
    return this
  }
  
  function withPlayground(playground : typekey.BP7Playground) : BP7ClassificationExpression {
    _builder.withPlayground(playground)
    return this
  }

  function withNumSwimmingPools(numSwimmingPools : String) : BP7ClassificationExpression {
    _builder.withNumSwimmingPools(numSwimmingPools)
    return this
  }

  function withPredominantOverride() : BP7ClassificationExpression {
    _builder.withPredominantOverride(true)
    return this
  }

  function withRABOPWanted(value : boolean) : BP7ClassificationExpression {
    _builder.withRABOPWanted(value)
    return this
  }

  function fromPeriod(period : PolicyPeriod) : BP7Classification {
    return new EntityRetriever<BP7Classification>(_builder).fromPeriod(period)
  }

  function applyTo(period : PolicyPeriod) {
    var classification = fromPeriod(period)
    _builder.applyToExistingEntity(classification)
  }

}
