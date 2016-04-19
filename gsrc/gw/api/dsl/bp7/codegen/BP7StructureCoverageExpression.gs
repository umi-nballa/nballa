package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7StructureCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7BuildingCov))
    _builder.withPatternCode("BP7Structure")
  }
  
  function withLimit(limit : java.math.BigDecimal) : BP7StructureCoverageExpression {
    _builder.withDirectTerm("BP7BuildingLimit", limit)
    syncAvailability("BP7BuildingLimit")
    return this
  }
  
  function withValuation(valuation : productmodel.OptionBP7RatingBasisTypeValue) : BP7StructureCoverageExpression {
    _builder.withOptionCovTerm("BP7RatingBasis", valuation.Description)
    syncAvailability("BP7RatingBasis")
    return this
  }
  
  function withAutomaticIncreasePercentage(automaticIncreasePercentage : productmodel.OptionBP7AutomaticIncreasePct1TypeValue) : BP7StructureCoverageExpression {
    _builder.withOptionCovTerm("BP7AutomaticIncreasePct1", automaticIncreasePercentage.Description)
    syncAvailability("BP7AutomaticIncreasePct1")
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
  
  function changeOn(period : PolicyPeriod) : BP7StructureCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7Structure {
    return new EntityRetriever<BP7BuildingCov>(_builder).fromPeriod(period) as productmodel.BP7Structure
  }
  
}