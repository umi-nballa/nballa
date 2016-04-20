package gw.api.databuilder.bp7

uses gw.api.builder.BuilderPropertyPopulator
uses gw.api.builder.CoverageBuilder
uses gw.api.builder.ExclusionBuilder
uses gw.api.builder.PolicyConditionBuilder
uses gw.api.builder.PolicyLocationBuilder
uses gw.api.databuilder.BuilderContext
uses gw.api.databuilder.DataBuilder

@Export
class BP7LocationBuilder extends DataBuilder<BP7Location, BP7LocationBuilder> {
  
  private var isPrimary = false
  
  construct() {
    super(BP7Location)
  }

  function withLocation(policyLocationBuilder : PolicyLocationBuilder) : BP7LocationBuilder {
    addPopulator(new BuilderPropertyPopulator(BP7Location#Location.PropertyInfo, policyLocationBuilder))
    return this
  }

  function withBuilding(building : BP7BuildingBuilder) : BP7LocationBuilder {
    addArrayElement(BP7Location#Buildings.PropertyInfo, building)
    return this
  }

  function withFeetToHydrant(feetToHydrant : BP7FeetToHydrant) : BP7LocationBuilder {
    set(BP7Location#FeetToHydrant.PropertyInfo, feetToHydrant)
    return this
  }
  
  function withFireProtectionClass(fireProtectionClass : BP7FireProtectionClassPPC) : BP7LocationBuilder {
    set(BP7Location#FireProtectionClassPPC.PropertyInfo, fireProtectionClass)
    return this
  }

  function withLiquorLiabGrade(liquorLiabGrade : int) : BP7LocationBuilder {
    set(BP7Location#LiquorLiabGrade.PropertyInfo, liquorLiabGrade)
    return this
  }

  function withCoverage(coverage : CoverageBuilder) : BP7LocationBuilder {
    addArrayElement(BP7Location#Coverages.PropertyInfo, coverage)
    return this
  }
  
  function withExclusion(exclusion : ExclusionBuilder) : BP7LocationBuilder {
    addArrayElement(BP7Location#Exclusions.PropertyInfo, exclusion)
    return this
  }
  
  function withCondition(condition : PolicyConditionBuilder) : BP7LocationBuilder {
    addAdditiveArrayElement(BP7Location#Conditions.PropertyInfo, condition)
    return this
  }
  
  function setAsPrimary() : BP7LocationBuilder {
    isPrimary = true
    return this
  }

  override function createBean(context : BuilderContext) : BP7Location {
    if (isPrimary) {
      var line = context.ParentBean as BP7Line
      var toRemove = line.BP7Locations.firstWhere(\ loc -> loc.Location.LocationNum == 1 and loc.Location.PrimaryLoc)
      
      if (toRemove != null) {
        line.Branch.PrimaryLocation = null
        line.removeFromLineSpecificLocations(toRemove)
      }
    }
    
    return super.createBean(context)
  }

}
