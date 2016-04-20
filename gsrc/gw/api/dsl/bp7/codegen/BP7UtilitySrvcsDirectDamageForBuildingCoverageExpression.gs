package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7UtilitySrvcsDirectDamageForBuildingCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7UtilitySrvcsDirectDamageForBuilding")
  }
  
  function withLimit(limit : java.math.BigDecimal) : BP7UtilitySrvcsDirectDamageForBuildingCoverageExpression {
    _builder.withDirectTerm("BP7Limit43", limit)
    syncAvailability("BP7Limit43")
    return this
  }
  
  function withWaterSupply(waterSupply : productmodel.OptionBP7WaterSupply2TypeValue) : BP7UtilitySrvcsDirectDamageForBuildingCoverageExpression {
    _builder.withOptionCovTerm("BP7WaterSupply2", waterSupply.Description)
    syncAvailability("BP7WaterSupply2")
    return this
  }
  
  function withCommunicationSupply(communicationSupply : productmodel.OptionBP7CommunicationSupply2TypeValue) : BP7UtilitySrvcsDirectDamageForBuildingCoverageExpression {
    _builder.withOptionCovTerm("BP7CommunicationSupply2", communicationSupply.Description)
    syncAvailability("BP7CommunicationSupply2")
    return this
  }
  
  function withPowerSupply(powerSupply : productmodel.OptionBP7PowerSupply2TypeValue) : BP7UtilitySrvcsDirectDamageForBuildingCoverageExpression {
    _builder.withOptionCovTerm("BP7PowerSupply2", powerSupply.Description)
    syncAvailability("BP7PowerSupply2")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7BuildingCov>() {
      override function execute(clause : BP7BuildingCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7UtilitySrvcsDirectDamageForBuildingCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7UtilitySrvcsDirectDamageForBuilding {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7UtilitySrvcsDirectDamageForBuilding
  }
  
}