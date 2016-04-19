package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7UtilitySrvcsTimeElementCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7ClassificationCov))
    _builder.withPatternCode("BP7UtilitySrvcsTimeElement")
  }
  
  function withLimit(limit : java.math.BigDecimal) : BP7UtilitySrvcsTimeElementCoverageExpression {
    _builder.withDirectTerm("BP7Limit34", limit)
    syncAvailability("BP7Limit34")
    return this
  }
  
  function withWaterSupply(waterSupply : productmodel.OptionBP7WaterSupply1TypeValue) : BP7UtilitySrvcsTimeElementCoverageExpression {
    _builder.withOptionCovTerm("BP7WaterSupply1", waterSupply.Description)
    syncAvailability("BP7WaterSupply1")
    return this
  }
  
  function withWastewaterRemovalProperty(wastewaterRemovalProperty : productmodel.OptionBP7WastewaterRemovalPropertyTypeValue) : BP7UtilitySrvcsTimeElementCoverageExpression {
    _builder.withOptionCovTerm("BP7WastewaterRemovalProperty", wastewaterRemovalProperty.Description)
    syncAvailability("BP7WastewaterRemovalProperty")
    return this
  }
  
  function withCommunicationSupply(communicationSupply : productmodel.OptionBP7CommunicationSupply1TypeValue) : BP7UtilitySrvcsTimeElementCoverageExpression {
    _builder.withOptionCovTerm("BP7CommunicationSupply1", communicationSupply.Description)
    syncAvailability("BP7CommunicationSupply1")
    return this
  }
  
  function withPowerSupply(powerSupply : productmodel.OptionBP7PowerSupply1TypeValue) : BP7UtilitySrvcsTimeElementCoverageExpression {
    _builder.withOptionCovTerm("BP7PowerSupply1", powerSupply.Description)
    syncAvailability("BP7PowerSupply1")
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
  
  function changeOn(period : PolicyPeriod) : BP7UtilitySrvcsTimeElementCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7UtilitySrvcsTimeElement {
    return new EntityRetriever<BP7ClassificationCov>(_builder).fromPeriod(period) as productmodel.BP7UtilitySrvcsTimeElement
  }
  
}