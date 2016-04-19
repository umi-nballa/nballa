package gw.api.databuilder.bp7

uses gw.api.builder.PolicyLineBuilder
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.databuilder.common.ClauseContainingBuilder
uses java.util.Date

class BP7BusinessOwnersLineBuilder extends PolicyLineBuilder<BP7BusinessOwnersLine, BP7BusinessOwnersLineBuilder> 
  implements ClauseContainingBuilder<BP7BusinessOwnersLineBuilder> {
    
  construct() {
    super(BP7BusinessOwnersLine)
    set(BP7BusinessOwnersLine#BP7LineBusinessType.PropertyInfo, BP7PropertyType.TC_APARTMENT)
  }

  function withDateBusinessStarted(date : Date) : BP7BusinessOwnersLineBuilder {
    set(BP7BusinessOwnersLine#DateBusinessStarted.PropertyInfo, date)
    return this
  }
  
  function withBusinessDescription(description : String) : BP7BusinessOwnersLineBuilder {
    set(BP7BusinessOwnersLine#BusinessDesc.PropertyInfo, description)
    return this
  }

  function withLineBusinessType(type : BP7PropertyType) : BP7BusinessOwnersLineBuilder {
    set(BP7BusinessOwnersLine#BP7LineBusinessType.PropertyInfo, type)
    return this
  }

  function withEffectiveDate(date : Date) : BP7BusinessOwnersLineBuilder {
    set(BP7BusinessOwnersLine#EffectiveDate.PropertyInfo, date)
    return this
  }

  function withExpirationDate(date : Date) : BP7BusinessOwnersLineBuilder {
    set(BP7BusinessOwnersLine#ExpirationDate.PropertyInfo, date)
    return this
  }

  function with(location : BP7LocationBuilder) : BP7BusinessOwnersLineBuilder {
    addAdditiveArrayElement(BP7BusinessOwnersLine#BP7Locations.PropertyInfo, location)
    return this
  }

  function with(blanket : BP7BlanketBuilder) : BP7BusinessOwnersLineBuilder {
    addAdditiveArrayElement(BP7BusinessOwnersLine#Blankets.PropertyInfo, blanket)
    return this
  }

  function with(modifier : BP7LineModBuilder) : BP7BusinessOwnersLineBuilder {
    addAdditiveArrayElement(BP7BusinessOwnersLine#BP7LineModifiers.PropertyInfo, modifier)
    return this
  }

  override function withCoverage(coverage : CoverageBuilder) : BP7BusinessOwnersLineBuilder {
    addAdditiveArrayElement(BP7BusinessOwnersLine#BP7LineCoverages.PropertyInfo, coverage)
    return this
  }
  
  override function withExclusion(exclusion : ExclusionBuilder) : BP7BusinessOwnersLineBuilder {
    addAdditiveArrayElement(BP7BusinessOwnersLine#BP7LineExclusions.PropertyInfo, exclusion)
    return this
  }
  
  override function withCondition(condition : PolicyConditionBuilder) : BP7BusinessOwnersLineBuilder {
    addAdditiveArrayElement(BP7BusinessOwnersLine#BP7LineConditions.PropertyInfo, condition)
    return this
  }
}
