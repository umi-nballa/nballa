package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7UtilitySrvcsDirectDamageCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7UtilitySrvcsDirectDamage")
  }
  
  function withLimit(limit : java.math.BigDecimal) : BP7UtilitySrvcsDirectDamageCoverageExpression {
    _builder.withDirectTerm("BP7Limit33", limit)
    syncAvailability("BP7Limit33")
    return this
  }
  
  function withWaterSupply(waterSupply : productmodel.OptionBP7WaterSupplyTypeValue) : BP7UtilitySrvcsDirectDamageCoverageExpression {
    _builder.withOptionCovTerm("BP7WaterSupply", waterSupply.Description)
    syncAvailability("BP7WaterSupply")
    return this
  }
  
  function withCommunicationSupply(communicationSupply : productmodel.OptionBP7CommunicationSupplyTypeValue) : BP7UtilitySrvcsDirectDamageCoverageExpression {
    _builder.withOptionCovTerm("BP7CommunicationSupply", communicationSupply.Description)
    syncAvailability("BP7CommunicationSupply")
    return this
  }
  
  function withPowerSupply(powerSupply : productmodel.OptionBP7PowerSupplyTypeValue) : BP7UtilitySrvcsDirectDamageCoverageExpression {
    _builder.withOptionCovTerm("BP7PowerSupply", powerSupply.Description)
    syncAvailability("BP7PowerSupply")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7ClassificationCov>() {
      override function execute(clause : BP7ClassificationCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7UtilitySrvcsDirectDamageCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7UtilitySrvcsDirectDamage {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7UtilitySrvcsDirectDamage
  }
  
}