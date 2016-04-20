package gw.api.dsl.bp7.codegen

uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression extends DataBuilderExpression<BP7ScheduledCoverageBuilder> {

  
  construct() {
    super(new BP7ScheduledCoverageBuilder<BP7LocSchedCovItemBuilder>(BP7LocSchedCov))
    _builder.withPatternCode("BP7OffPremIntrpOfBusnVehiclesAndMobileEquipment")
  }
  
  function withDescribedPremises(describedPremises : String) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    _builder.withGenericTermValue("BP7DescribedPremises", describedPremises)
    syncAvailability("BP7DescribedPremises")
    return this
  }
  
  function withDescriptionOfBusinessActivitiesDependentOnScheduledProperty(descriptionOfBusinessActivitiesDependentOnScheduledProperty : String) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    _builder.withGenericTermValue("BP7DescriptionBusinessActivities", descriptionOfBusinessActivitiesDependentOnScheduledProperty)
    syncAvailability("BP7DescriptionBusinessActivities")
    return this
  }
  
  function withCollisionCoveredCauseOfLoss(collisionCoveredCauseOfLoss : Boolean) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    _builder.withGenericTermValue("BP7CollisionCoveredCauseOfLoss", collisionCoveredCauseOfLoss)
    syncAvailability("BP7CollisionCoveredCauseOfLoss")
    return this
  }
  
  function withExtendedBusinessIncomeDays(extendedBusinessIncomeDays : productmodel.OptionBP7ExtendedBusinessIncomeTypeValue) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7ExtendedBusinessIncome", extendedBusinessIncomeDays.Description)
    syncAvailability("BP7ExtendedBusinessIncome")
    return this
  }
  
  function withBusinessIncomeNoWaitingPeriodOption(businessIncomeNoWaitingPeriodOption : Boolean) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    _builder.withGenericTermValue("BP7BusinessIncomeNoWaitingPeriodOption", businessIncomeNoWaitingPeriodOption)
    syncAvailability("BP7BusinessIncomeNoWaitingPeriodOption")
    return this
  }
  
  function withPercentageOfInsuranceExposureForAllItemsListed(percentageOfInsuranceExposureForAllItemsListed : productmodel.OptionBP7PercentInsuranceToExposureTypeValue) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    _builder.withOptionCovTerm("BP7PercentInsuranceToExposure", percentageOfInsuranceExposureForAllItemsListed.Description)
    syncAvailability("BP7PercentInsuranceToExposure")
    return this
  }
  
  function withOffPremisesLimitOfInsurance(offPremisesLimitOfInsurance : java.math.BigDecimal) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    _builder.withDirectTerm("BP7Limit46", offPremisesLimitOfInsurance)
    syncAvailability("BP7Limit46")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LocSchedCov>() {
      override function execute(clause : BP7LocSchedCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function with(scheduleItem : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledItemExpression) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    _builder.withScheduledItem("ScheduledItems", scheduleItem.DataBuilder)
    return this
  }
  
  function changeOn(period : PolicyPeriod) : BP7OffPremIntrpOfBusnVehiclesAndMobileEquipmentScheduledCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7OffPremIntrpOfBusnVehiclesAndMobileEquipment {
    return new EntityRetriever<BP7LocSchedCov>(_builder).fromPeriod(period) as productmodel.BP7OffPremIntrpOfBusnVehiclesAndMobileEquipment
  }
  
}