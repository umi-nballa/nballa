package gw.api.databuilder.bp7

uses gw.api.builder.BuilderPropertyPopulator
uses gw.api.builder.BuildingBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.databuilder.DataBuilder
uses gw.api.databuilder.common.BuilderContextReuseEntity
uses gw.api.databuilder.populator.BeanPopulator

uses java.lang.Integer

class BP7BuildingBuilder extends DataBuilder<BP7Building, BP7BuildingBuilder> {

  construct() {
    super(BP7Building)

    addPopulator(Integer.MAX_VALUE, new BeanPopulator<entity.BP7Building>() {
      override function execute(building : BP7Building) {
        if (building.Building == null) {
          building.Building = building.Location.Location.newBuilding()
        }
        building.initializeAutoNumberSequences()
      }
    })
  }

  function withCoverage(coverage : CoverageBuilder) : BP7BuildingBuilder {
    addAdditiveArrayElement(BP7Building#Coverages.PropertyInfo, coverage)
    return this
  }

  function withExclusion(exclusion : ExclusionBuilder) : BP7BuildingBuilder {
    addAdditiveArrayElement(BP7Building#Exclusions.PropertyInfo, exclusion)
    return this
  }
  
  function withCondition(condition : PolicyConditionBuilder) : BP7BuildingBuilder {
    addAdditiveArrayElement(BP7Building#Conditions.PropertyInfo, condition)
    return this
  }

  function withBuilding(buildingBuilder : BuildingBuilder) : BP7BuildingBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7Building#Building.PropertyInfo, buildingBuilder))
    return this
  }
  
  function withClassification(classification : BP7ClassificationBuilder) : BP7BuildingBuilder {
    addAdditiveArrayElement(BP7Building#Classifications.PropertyInfo, classification)
    return this
  }

  function withUnitNumber(unitNumber : String) : BP7BuildingBuilder {
    set(entity.BP7Building#UnitNumber.PropertyInfo, unitNumber)
    return this
  }

  function withPropertyType(propertyType : typekey.BP7PropertyType) : BP7BuildingBuilder {
    set(entity.BP7Building#PropertyType.PropertyInfo, propertyType)
    return this
  }

  function withBldgCodeEffGradeClass(bldgCodeEffGradeClass : typekey.BP7BldgCodeEffectivenessGradeClass) : BP7BuildingBuilder {
    set(entity.BP7Building#BldgCodeEffGradeClass.PropertyInfo, bldgCodeEffGradeClass)
    return this
  }

  function withBldgCodeEffectivenessGrade(bldgCodeEffectivenessGrade : typekey.BP7BldgCodeEffectivenessGrade) : BP7BuildingBuilder {
    set(entity.BP7Building#BldgCodeEffGrade.PropertyInfo, bldgCodeEffectivenessGrade)
    return this
  }

  function withConstructionType(constructionType : typekey.BP7ConstructionType) : BP7BuildingBuilder {
    set(entity.BP7Building#ConstructionType.PropertyInfo, constructionType)
    return this
  }

  function withSprinklered(sprinklered : boolean) : BP7BuildingBuilder {
    set(entity.BP7Building#Sprinklered.PropertyInfo, sprinklered)
    return this
  }

  function withPctOwnerOccupied(pctOwnerOccupied : typekey.BP7PctOwnerOccupied) : BP7BuildingBuilder {
    set(entity.BP7Building#PctOwnerOccupied.PropertyInfo, pctOwnerOccupied)
    return this
  }
 
  function withTotalCondoBldgSquareFootage(totalCondoBldgSquareFootage : int) : BP7BuildingBuilder {
    set(entity.BP7Building#TotalCondoBldgSquareFo.PropertyInfo, totalCondoBldgSquareFootage)
    return this
  }

  function withRABOPWanted(value : boolean) : BP7BuildingBuilder {
    set(entity.BP7Building#RABOPWanted.PropertyInfo, value)
    return this
  }

  function applyToExistingEntity(building : BP7Building) {
    super.create(new BuilderContextReuseEntity(building.Location, building, building.Bundle))
  }
}
