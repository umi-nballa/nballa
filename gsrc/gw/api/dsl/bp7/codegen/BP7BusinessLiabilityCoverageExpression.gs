package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7BusinessLiabilityCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7BusinessLiability")
  }
  
  function withEachOccurrenceLimit(eachOccurrenceLimit : productmodel.OptionBP7EachOccLimitTypeValue) : BP7BusinessLiabilityCoverageExpression {
    _builder.withOptionCovTerm("BP7EachOccLimit", eachOccurrenceLimit.Description)
    syncAvailability("BP7EachOccLimit")
    return this
  }
  
  function withProductsCompletedOpsAggregateLimit(productsCompletedOpsAggregateLimit : productmodel.OptionBP7ProdCompldOpsAggregateLimitTypeValue) : BP7BusinessLiabilityCoverageExpression {
    _builder.withOptionCovTerm("BP7ProdCompldOpsAggregateLimit", productsCompletedOpsAggregateLimit.Description)
    syncAvailability("BP7ProdCompldOpsAggregateLimit")
    return this
  }
  
  function withGeneralAggregateLimit(generalAggregateLimit : productmodel.OptionBP7AggregateLimitTypeValue) : BP7BusinessLiabilityCoverageExpression {
    _builder.withOptionCovTerm("BP7AggregateLimit", generalAggregateLimit.Description)
    syncAvailability("BP7AggregateLimit")
    return this
  }
  
  function withPdDeductible(pdDeductible : productmodel.OptionBP7PropDamageLiabDedTypeValue) : BP7BusinessLiabilityCoverageExpression {
    _builder.withOptionCovTerm("BP7PropDamageLiabDed", pdDeductible.Description)
    syncAvailability("BP7PropDamageLiabDed")
    return this
  }
  
  function withPdDeductibleType(pdDeductibleType : productmodel.OptionBP7PropDamageLiabDedTypeTypeValue) : BP7BusinessLiabilityCoverageExpression {
    _builder.withOptionCovTerm("BP7PropDamageLiabDedType", pdDeductibleType.Description)
    syncAvailability("BP7PropDamageLiabDedType")
    return this
  }
  
  function withDamageToPremisesRentedToYou(damageToPremisesRentedToYou : java.math.BigDecimal) : BP7BusinessLiabilityCoverageExpression {
    _builder.withDirectTerm("BP7TenantsFireLiabLimit", damageToPremisesRentedToYou)
    syncAvailability("BP7TenantsFireLiabLimit")
    return this
  }
  
  function withMedicalExpensesPerPersonLimit(medicalExpensesPerPersonLimit : productmodel.OptionBP7OptionalMedicalCovLimitPerPersonTypeValue) : BP7BusinessLiabilityCoverageExpression {
    _builder.withOptionCovTerm("BP7OptionalMedicalCovLimitPerPerson", medicalExpensesPerPersonLimit.Description)
    syncAvailability("BP7OptionalMedicalCovLimitPerPerson")
    return this
  }
  
  function syncAvailability(term : String) {
    _builder.addBeanPopulator(new gw.api.databuilder.populator.BeanPopulator<BP7LineCov>() {
      override function execute(clause : BP7LineCov) {
        var avail = clause.CovTerms.hasMatch(\ c -> c.PatternCode == term)
        if (term <> "" and not avail) {
          throw "attempting to set value for cov term ${term} but it is not available"
        }
        clause.OwningCoverable.syncCoverages()
      }
    })
  }
  
  function changeOn(period : PolicyPeriod) : BP7BusinessLiabilityCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7BusinessLiability {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7BusinessLiability
  }
  
}