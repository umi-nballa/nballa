package gw.api.dsl.bp7.codegen

uses gw.api.builder.CoverageBuilder
uses gw.api.dsl.common.DataBuilderExpression
uses gw.api.dsl.common.EntityRetriever
uses gw.api.databuilder.common.BuilderContextReuseEntity

/*
 * NOTE: This class is generated; do not edit manually.
 */
class BP7InformationSecurityProtectionEndorsementCoverageExpression extends DataBuilderExpression<CoverageBuilder> {

  
  construct() {
    super(new CoverageBuilder(BP7LineCov))
    _builder.withPatternCode("BP7InformationSecurityProtectionEndorsement")
  }
  
  function withSelectCoverageTier(selectCoverageTier : productmodel.OptionBP7CovTierSelectTypeValue) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withOptionCovTerm("BP7CovTierSelect", selectCoverageTier.Description)
    syncAvailability("BP7CovTierSelect")
    return this
  }
  
  function withSecurityBreachLiabilityRetroactiveDate(securityBreachLiabilityRetroactiveDate : productmodel.OptionBP7SecurityBreachLiabilityRetroactiveDateSelectTypeValue) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withOptionCovTerm("BP7SecurityBreachLiabilityRetroactiveDateSelect", securityBreachLiabilityRetroactiveDate.Description)
    syncAvailability("BP7SecurityBreachLiabilityRetroactiveDateSelect")
    return this
  }
  
  function withBP7SecurityBreachLiabilityRetroactiveDate(bP7SecurityBreachLiabilityRetroactiveDate : java.util.Date) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7SecurityBreachLiabilityRetroactiveDate", bP7SecurityBreachLiabilityRetroactiveDate)
    syncAvailability("BP7SecurityBreachLiabilityRetroactiveDate")
    return this
  }
  
  function withWebSitePublishingLiabilityRetroactiveDate(webSitePublishingLiabilityRetroactiveDate : productmodel.OptionBP7WebSitePublishingLiabilityRetroactiveDateSelectTypeValue) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withOptionCovTerm("BP7WebSitePublishingLiabilityRetroactiveDateSelect", webSitePublishingLiabilityRetroactiveDate.Description)
    syncAvailability("BP7WebSitePublishingLiabilityRetroactiveDateSelect")
    return this
  }
  
  function withBP7WebSitePublishingLiabilityRetroactiveDate(bP7WebSitePublishingLiabilityRetroactiveDate : java.util.Date) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7WebSitePublishingLiabilityRetroactiveDate", bP7WebSitePublishingLiabilityRetroactiveDate)
    syncAvailability("BP7WebSitePublishingLiabilityRetroactiveDate")
    return this
  }
  
  function withInformationSecurityProtectionAggregateLimitOfInsurance(informationSecurityProtectionAggregateLimitOfInsurance : productmodel.OptionBP7AggregateLimit8TypeValue) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withOptionCovTerm("BP7AggregateLimit8", informationSecurityProtectionAggregateLimitOfInsurance.Description)
    syncAvailability("BP7AggregateLimit8")
    return this
  }
  
  function withInformationSecurityProtectionDeductible(informationSecurityProtectionDeductible : productmodel.OptionBP7Deductible2TypeValue) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withOptionCovTerm("BP7Deductible2", informationSecurityProtectionDeductible.Description)
    syncAvailability("BP7Deductible2")
    return this
  }
  
  function withBusinessIncomeAndExtraExpenseWaitingPeriodHours(businessIncomeAndExtraExpenseWaitingPeriodHours : productmodel.OptionBP7BusinessIncomeAndExtraExpenseWaitingPeriodHoursTypeValue) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withOptionCovTerm("BP7BusinessIncomeAndExtraExpenseWaitingPeriodHours", businessIncomeAndExtraExpenseWaitingPeriodHours.Description)
    syncAvailability("BP7BusinessIncomeAndExtraExpenseWaitingPeriodHours")
    return this
  }
  
  function withWaitingPeriodHours(waitingPeriodHours : String) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7BusinessIncomeAndExtraExpenseWaitingPeriodHour1", waitingPeriodHours)
    syncAvailability("BP7BusinessIncomeAndExtraExpenseWaitingPeriodHour1")
    return this
  }
  
  function withPreSecurityBreachServicesIdt911AKAIdentityTheft911(preSecurityBreachServicesIdt911AKAIdentityTheft911 : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7PreSecurityBreachServicesIDT911", preSecurityBreachServicesIdt911AKAIdentityTheft911)
    syncAvailability("BP7PreSecurityBreachServicesIDT911")
    return this
  }
  
  function withPreSecurityBreachServicesOther1(preSecurityBreachServicesOther1 : String) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7PreSecurityBreachServicesOther1", preSecurityBreachServicesOther1)
    syncAvailability("BP7PreSecurityBreachServicesOther1")
    return this
  }
  
  function withPreSecurityBreachServicesOther2(preSecurityBreachServicesOther2 : String) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7PreSecurityBreachServicesOther2", preSecurityBreachServicesOther2)
    syncAvailability("BP7PreSecurityBreachServicesOther2")
    return this
  }
  
  function withPostSecurityBreachServicesIdt911AKAIdentityTheft911(postSecurityBreachServicesIdt911AKAIdentityTheft911 : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7PostSecurityBreachServicesIDT911", postSecurityBreachServicesIdt911AKAIdentityTheft911)
    syncAvailability("BP7PostSecurityBreachServicesIDT911")
    return this
  }
  
  function withPostSecurityBreachServicesOther1(postSecurityBreachServicesOther1 : String) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7PostSecurityBreachServicesOther1", postSecurityBreachServicesOther1)
    syncAvailability("BP7PostSecurityBreachServicesOther1")
    return this
  }
  
  function withPostSecurityBreachServicesOther2(postSecurityBreachServicesOther2 : String) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7PostSecurityBreachServicesOther2", postSecurityBreachServicesOther2)
    syncAvailability("BP7PostSecurityBreachServicesOther2")
    return this
  }
  
  function withSupplementalExtendedReportingPeriod(supplementalExtendedReportingPeriod : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7SupplementalExtendedReportingPeriod", supplementalExtendedReportingPeriod)
    syncAvailability("BP7SupplementalExtendedReportingPeriod")
    return this
  }
  
  function withSupplementalExtendedReportingPeriodIsFor(supplementalExtendedReportingPeriodIsFor : productmodel.OptionBP7SupplementalExtendedReportingPeriodAvailabilityTypeValue) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withOptionCovTerm("BP7SupplementalExtendedReportingPeriodAvailability", supplementalExtendedReportingPeriodIsFor.Description)
    syncAvailability("BP7SupplementalExtendedReportingPeriodAvailability")
    return this
  }
  
  function withSupplementalExtendedReportingPeriodPremium(supplementalExtendedReportingPeriodPremium : String) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7SupplementalExtendedReportingPeriodPremium", supplementalExtendedReportingPeriodPremium)
    syncAvailability("BP7SupplementalExtendedReportingPeriodPremium")
    return this
  }
  
  function withIncludeRiskCharacteristics(includeRiskCharacteristics : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7IncludeRiskCharacteristics", includeRiskCharacteristics)
    syncAvailability("BP7IncludeRiskCharacteristics")
    return this
  }
  
  function withInsuredConductsOnlineTransactions(insuredConductsOnlineTransactions : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicInsuredConductsOnlineTransact", insuredConductsOnlineTransactions)
    syncAvailability("BP7RiskCharacteristicInsuredConductsOnlineTransact")
    return this
  }
  
  function withRemoteAccessToInsuredSComputerSystemSIsGrantedToAuthorizedThirdPartiesEmployeesCustomersAndOrBusinessPartners(remoteAccessToInsuredSComputerSystemSIsGrantedToAuthorizedThirdPartiesEmployeesCustomersAndOrBusinessPartners : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicRemoteAccessToInsuredsCompSys", remoteAccessToInsuredSComputerSystemSIsGrantedToAuthorizedThirdPartiesEmployeesCustomersAndOrBusinessPartners)
    syncAvailability("BP7RiskCharacteristicRemoteAccessToInsuredsCompSys")
    return this
  }
  
  function withInsuredDoesNotHaveAWebsite(insuredDoesNotHaveAWebsite : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicInsuredDoesNotHaveWebsite", insuredDoesNotHaveAWebsite)
    syncAvailability("BP7RiskCharacteristicInsuredDoesNotHaveWebsite")
    return this
  }
  
  function withInsuredHasActiveSocialMediaProfiles(insuredHasActiveSocialMediaProfiles : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicInsuredHasActiveSocialMediaPr", insuredHasActiveSocialMediaProfiles)
    syncAvailability("BP7RiskCharacteristicInsuredHasActiveSocialMediaPr")
    return this
  }
  
  function withInsuredCollectsDataFromCustomersOrVisitorsToTheirWebsiteSThatIsRequiredByLawToBeProtected(insuredCollectsDataFromCustomersOrVisitorsToTheirWebsiteSThatIsRequiredByLawToBeProtected : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicInsuredCollectsDataRequiredTo", insuredCollectsDataFromCustomersOrVisitorsToTheirWebsiteSThatIsRequiredByLawToBeProtected)
    syncAvailability("BP7RiskCharacteristicInsuredCollectsDataRequiredTo")
    return this
  }
  
  function withInsuredCollectsAndRetainsInformationOnMinors(insuredCollectsAndRetainsInformationOnMinors : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicInsuredCollectsInformationOnM", insuredCollectsAndRetainsInformationOnMinors)
    syncAvailability("BP7RiskCharacteristicInsuredCollectsInformationOnM")
    return this
  }
  
  function withInsuredUtilizesMedicalRecordsInDailyBusiness(insuredUtilizesMedicalRecordsInDailyBusiness : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicInsuredUtilizesMedicalRecords", insuredUtilizesMedicalRecordsInDailyBusiness)
    syncAvailability("BP7RiskCharacteristicInsuredUtilizesMedicalRecords")
    return this
  }
  
  function withInsuredUtilizesBackgroundAndOrCreditChecksInDailyBusinessAndRetainsThisInformation(insuredUtilizesBackgroundAndOrCreditChecksInDailyBusinessAndRetainsThisInformation : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicInsuredUtilizesBackgroundAndC", insuredUtilizesBackgroundAndOrCreditChecksInDailyBusinessAndRetainsThisInformation)
    syncAvailability("BP7RiskCharacteristicInsuredUtilizesBackgroundAndC")
    return this
  }
  
  function withInsuredEmploysEncryptionInCustomerCommunications(insuredEmploysEncryptionInCustomerCommunications : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicInsuredEmploysEncryption", insuredEmploysEncryptionInCustomerCommunications)
    syncAvailability("BP7RiskCharacteristicInsuredEmploysEncryption")
    return this
  }
  
  function withHighHazardClassifications(highHazardClassifications : Boolean) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    _builder.withGenericTermValue("BP7RiskCharacteristicHighHazardClassifications", highHazardClassifications)
    syncAvailability("BP7RiskCharacteristicHighHazardClassifications")
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
  
  function changeOn(period : PolicyPeriod) : BP7InformationSecurityProtectionEndorsementCoverageExpression {
    var entity = fromPeriod(period)
    _builder.create(new BuilderContextReuseEntity(entity.OwningCoverable, entity, entity.Bundle))
    return this
  }
  
  function fromPeriod(period : PolicyPeriod) : productmodel.BP7InformationSecurityProtectionEndorsement {
    return new EntityRetriever<BP7LineCov>(_builder).fromPeriod(period) as productmodel.BP7InformationSecurityProtectionEndorsement
  }
  
}