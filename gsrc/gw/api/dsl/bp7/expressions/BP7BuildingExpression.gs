package gw.api.dsl.bp7.expressions
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.databuilder.bp7.BP7BuildingBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.BuildingBuilder
uses gw.api.builder.ClauseBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.dsl.common.EntityRetriever

class BP7BuildingExpression extends DataBuilderExpression<BP7BuildingBuilder> {
  var _building : BuildingBuilder as Building

  construct() {
    super(new BP7BuildingBuilder())
  }  

  function with(classification : BP7ClassificationExpression) : BP7BuildingExpression {
    _builder.withClassification(classification.DataBuilder)
    return this
  }

  function with(clause : DataBuilderExpression<ClauseBuilder>) : BP7BuildingExpression {
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

  function with(__building : BuildingBuilder) : BP7BuildingExpression {
    _building = __building
    _builder.withBuilding(__building)
    return this
  }
  
  function withDescription(description : String) : BP7BuildingExpression {
    _building.withDescription(description)
    return this
  }

  function withUnitNumber(unitNumber : String) : BP7BuildingExpression {
    _builder.withUnitNumber(unitNumber)
    return this
  }
  
  function withPropertyType(propertyType : typekey.BP7PropertyType) : BP7BuildingExpression {
    _builder.withPropertyType(propertyType)
    return this
  }
  
  function withBldgCodeEffGradeClass(bldgCodeEffGradeClass : typekey.BP7BldgCodeEffectivenessGradeClass) : BP7BuildingExpression {
    _builder.withBldgCodeEffGradeClass(bldgCodeEffGradeClass)
    return this
  }
  
  function withBldgCodeEffectivenessGrade(bldgCodeEffectivenessGrade : typekey.BP7BldgCodeEffectivenessGrade) : BP7BuildingExpression {
    _builder.withBldgCodeEffectivenessGrade(bldgCodeEffectivenessGrade)
    return this
  }

  function withConstructionType(constructionType : typekey.BP7ConstructionType) : BP7BuildingExpression {
    _builder.withConstructionType(constructionType)
    return this
  }

  function withSprinklered(sprinklered : boolean) : BP7BuildingExpression {
    _builder.withSprinklered(sprinklered)
    return this
  }

  function withPctOwnerOccupied(pctOwnerOccupied : typekey.BP7PctOwnerOccupied) : BP7BuildingExpression {
    _builder.withPctOwnerOccupied(pctOwnerOccupied)
    return this
  }

  function withTotalCondoBldgSquareFootage(totalCondoBldgSquareFootage : int) : BP7BuildingExpression {
    _builder.withTotalCondoBldgSquareFootage(totalCondoBldgSquareFootage)
    return this
  }

  function withRABOPWanted(value : boolean) : BP7BuildingExpression {
    _builder.withRABOPWanted(value)
    return this
  }

  function fromPeriod(period : PolicyPeriod) : BP7Building {
    return new EntityRetriever<BP7Building>(_builder).fromPeriod(period)
  }

  function addTo(period : PolicyPeriod) {
    var buildingToChange = period.BP7Line.BP7Locations.first().createAndAddBuilding()
    _builder.applyToExistingEntity(buildingToChange)

    //var changeBuilding = fromPeriod(period)
    //_builder.applyToExistingEntity(buildingToChange)
  } 
}