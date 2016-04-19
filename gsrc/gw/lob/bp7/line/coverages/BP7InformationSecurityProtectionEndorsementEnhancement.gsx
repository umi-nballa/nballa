package gw.lob.bp7.line.coverages

enhancement BP7InformationSecurityProtectionEndorsementEnhancement : productmodel.BP7InformationSecurityProtectionEndorsement {
  function isSecurityBreachLiabilityRetroactiveDateSelectAvailable() : boolean {
    return (this.BP7CovTierSelectTerm.OptionValue == "Tier1and2" or this.BP7CovTierSelectTerm.OptionValue == "Tier12and3")
  }

  function isSecurityBreachLiabilityRetroactiveDateAvailable() : boolean {
    return (this.BP7CovTierSelectTerm.OptionValue == "Tier1and2" or this.BP7CovTierSelectTerm.OptionValue == "Tier12and3") and this.BP7SecurityBreachLiabilityRetroactiveDateSelectTerm.OptionValue == "SelectDate"
  }

  function isSupplementalExtendedReportingPeriodAvailable() : boolean {
    return (this.BP7CovTierSelectTerm.OptionValue == "Tier1and2" or this.BP7CovTierSelectTerm.OptionValue == "Tier12and3")
  }

  function isSupplementalExtendedReportingPeriodAvailabilityAvailable() : boolean {
    return (this.BP7CovTierSelectTerm.OptionValue == "Tier1and2" or this.BP7CovTierSelectTerm.OptionValue == "Tier12and3") and this.BP7SupplementalExtendedReportingPeriodTerm.Value
  }

  function isSupplementalExtendedReportingPeriodPremiumAvailable() : boolean {
    return (this.BP7CovTierSelectTerm.OptionValue == "Tier1and2" or this.BP7CovTierSelectTerm.OptionValue == "Tier12and3") and this.BP7SupplementalExtendedReportingPeriodTerm.Value
  }

  function isWebSitePublishingLiabilityRetroactiveDateSelectAvailable() : boolean {
    return this.BP7CovTierSelectTerm.OptionValue == "Tier12and3"
  }

  function isWebSitePublishingLiabilityRetroactiveDateAvailable() : boolean {
    return this.BP7CovTierSelectTerm.OptionValue == "Tier12and3" and this.BP7WebSitePublishingLiabilityRetroactiveDateSelectTerm.OptionValue == "SelectDate"
  }

  function isBusinessIncomeAndExtraExpenseWaitingPeriodHoursAvailable() : boolean {
    return this.BP7CovTierSelectTerm.OptionValue == "Tier12and3"
  }

  function isBusinessIncomeAndExtraExpenseWaitingPeriodHour1Available() : boolean {
    return this.BP7CovTierSelectTerm.OptionValue == "Tier12and3" and this.BP7BusinessIncomeAndExtraExpenseWaitingPeriodHoursTerm.OptionValue == "Other"
  }

  function isRiskCharacteristicCovTermsAvailable() : boolean {
    return this.BP7IncludeRiskCharacteristicsTerm.Value
  }
}
