package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7RestaurantsCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LocationCov))
    _builder.withPatternCode("BP7Restaurants")
  }
  
  function withRestaurantFoodContaminationLimit(restaurantFoodContaminationLimit : java.math.BigDecimal) : BP7RestaurantsCoverageExpression {
    _builder.withDirectTerm("BP7Limit17", restaurantFoodContaminationLimit)
    syncAvailability("BP7Limit17")
    return this
  }
  
  function withCoverageType(coverageType : productmodel.OptionBP7CovType1TypeValue) : BP7RestaurantsCoverageExpression {
    _builder.withOptionCovTerm("BP7CovType1", coverageType.Description)
    syncAvailability("BP7CovType1")
    return this
  }
  
  function withRefrigerationMaintenanceAgreement(refrigerationMaintenanceAgreement : productmodel.OptionBP7MaintenanceAgreementTypeValue) : BP7RestaurantsCoverageExpression {
    _builder.withOptionCovTerm("BP7MaintenanceAgreement", refrigerationMaintenanceAgreement.Description)
    syncAvailability("BP7MaintenanceAgreement")
    return this
  }
  
  function withRestaurantsSpoilageLimit(restaurantsSpoilageLimit : java.math.BigDecimal) : BP7RestaurantsCoverageExpression {
    _builder.withDirectTerm("BP7Limit18", restaurantsSpoilageLimit)
    syncAvailability("BP7Limit18")
    return this
  }
  
  function withRestaurantsAdvertisingExpenseLimit(restaurantsAdvertisingExpenseLimit : java.math.BigDecimal) : BP7RestaurantsCoverageExpression {
    _builder.withDirectTerm("BP7Limit19", restaurantsAdvertisingExpenseLimit)
    syncAvailability("BP7Limit19")
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
  
  function changeOn(period : PolicyPeriod) : BP7RestaurantsCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7Restaurants {
    return new EntityRetriever<BP7LocationCov>(_builder).fromPeriod(period) as productmodel.BP7Restaurants
  }
  
}