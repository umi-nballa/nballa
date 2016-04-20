package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7LocationComputerFraudFundsTransferFraudCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LocationCov))
    _builder.withPatternCode("BP7LocationComputerFraudFundsTransferFraud")
  }
  
  function withIncluded(included : productmodel.OptionBP7ComputerFraudApplyTypeValue) : BP7LocationComputerFraudFundsTransferFraudCoverageExpression {
    _builder.withOptionCovTerm("BP7ComputerFraudApply", included.Description)
    syncAvailability("BP7ComputerFraudApply")
    return this
  }
  
  function withNumberOfEmployees(numberOfEmployees : java.lang.Integer) : BP7LocationComputerFraudFundsTransferFraudCoverageExpression {
    _builder.withGenericTermValue("BP7ComputerFraudNumEmployees", numberOfEmployees)
    syncAvailability("BP7ComputerFraudNumEmployees")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LocationCov>() {
      override function execute(clause : BP7LocationCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7LocationComputerFraudFundsTransferFraudCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7LocationComputerFraudFundsTransferFraud {
    return new EntityRetriever<BP7LocationCov>(_builder).fromPeriod(period) as productmodel.BP7LocationComputerFraudFundsTransferFraud
  }
  
}