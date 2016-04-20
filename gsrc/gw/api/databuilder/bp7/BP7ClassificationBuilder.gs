package gw.api.databuilder.bp7

uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.databuilder.BuilderContext
uses gw.api.databuilder.DataBuilder
uses gw.api.databuilder.common.BuilderContextReuseEntity

uses java.lang.Integer

class BP7ClassificationBuilder extends DataBuilder<BP7Classification, BP7ClassificationBuilder> {
  
  construct() {
    super(BP7Classification)
  }
  
  function withClassificationNumber(number : int) : BP7ClassificationBuilder {
    set(BP7Classification#ClassificationNumber.PropertyInfo, number)
    return this
  }

  function withClassPropertyType(propertyType : typekey.BP7ClassificationPropertyType) : BP7ClassificationBuilder {
    set(BP7Classification#ClassPropertyType.PropertyInfo, propertyType)
    return this
  }

  function withClassDescription(classDescription : typekey.BP7ClassDescription) : BP7ClassificationBuilder {
    set(BP7Classification#ClassDescription.PropertyInfo, classDescription)
    return this
  }

  function withExposureBasis(exposureBasis : typekey.BP7ExposureBasis) : BP7ClassificationBuilder {
    set(BP7Classification#ExposureBasis.PropertyInfo, exposureBasis)
    return this
  }

  function withExposure(exposure : Integer) : BP7ClassificationBuilder {
    set(BP7Classification#Exposure.PropertyInfo, exposure)
    return this
  }
  
  function withArea(area : int) : BP7ClassificationBuilder {
    set(BP7Classification#Area.PropertyInfo, area)
    return this
  }

  function withAmusementArea(amusementArea : boolean) : BP7ClassificationBuilder {
    set(BP7Classification#AmusementArea.PropertyInfo, amusementArea)
    return this
  }
    
  function withPlayground(playground : typekey.BP7Playground) : BP7ClassificationBuilder {
    set(BP7Classification#Playground.PropertyInfo, playground)
    return this
  }

  function withNumSwimmingPools(numSwimmingPools : String) : BP7ClassificationBuilder {
    set(BP7Classification#NumSwimmingPools.PropertyInfo, numSwimmingPools)
    return this
  }
  
  function withCoverage(coverage : CoverageBuilder) : BP7ClassificationBuilder {
    addAdditiveArrayElement(BP7Classification#Coverages.PropertyInfo, coverage)
    return this
  }
  
  function withExclusion(exclusion : ExclusionBuilder) : BP7ClassificationBuilder {
    addAdditiveArrayElement(BP7Classification#Exclusions.PropertyInfo, exclusion)
    return this
  }
  
  function withCondition(condition : PolicyConditionBuilder) : BP7ClassificationBuilder {
    addAdditiveArrayElement(BP7Classification#Conditions.PropertyInfo, condition)
    return this
  }

  function withPredominantOverride(value : boolean) : BP7ClassificationBuilder {
    set(BP7Classification#PredominantOverride.PropertyInfo, value)
    return this
  }

  function withRABOPWanted(value : boolean) : BP7ClassificationBuilder {
    set(BP7Classification#RABOPWanted.PropertyInfo, value)
    return this
  }

  override function createBean(context : BuilderContext) : BP7Classification {
    var building = context.ParentBean as BP7Building
    return building.createAndAddClassification()
  }

  function applyToExistingEntity(classification : BP7Classification) {
    super.create(new BuilderContextReuseEntity(classification.Building, classification, classification.Bundle))
  }
}
