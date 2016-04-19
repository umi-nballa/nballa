package gw.lob.bp7.line.coverages

enhancement BP7CondosCoOpsAssocsDirectorsAndOfficersLiabEnhancement : productmodel.BP7CondosCoOpsAssocsDirectorsAndOfficersLiab {
  function isExtendedReportingPeriodPremiumAvailable() : boolean {
    return this.BP7ExtddRptgPeriodTerm.Value
  }
}
