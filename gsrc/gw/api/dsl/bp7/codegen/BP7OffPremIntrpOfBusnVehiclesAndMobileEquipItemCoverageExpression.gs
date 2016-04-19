package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItemCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LocSchedCovItemCov))
    _builder.withPatternCode("BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItem")
  }
  
  function withChooseOption(chooseOption : productmodel.OptionBP7OptionTypeValue) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItemCoverageExpression {
    _builder.withOptionCovTerm("BP7Option", chooseOption.Description)
    syncAvailability("BP7Option")
    return this
  }
  
  function withOffPremisesLimitOfInsurance(offPremisesLimitOfInsurance : java.math.BigDecimal) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItemCoverageExpression {
    _builder.withDirectTerm("BP7Limit45", offPremisesLimitOfInsurance)
    syncAvailability("BP7Limit45")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LocSchedCovItemCov>() {
      override function execute(clause : BP7LocSchedCovItemCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItemCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItem {
    return new EntityRetriever<BP7LocSchedCovItemCov>(_builder).fromPeriod(period) as productmodel.BP7OffPremIntrpOfBusnVehiclesAndMobileEquipItem
  }
  
}