package gw.lob.bp7.line

uses gw.web.productmodel.ProductModelSyncIssuesHandler
uses gw.api.tree.RowTreeRootNode
uses java.math.BigDecimal
uses gw.pl.persistence.core.Bundle
uses gw.lang.reflect.IPropertyInfo
uses gw.api.web.job.JobWizardHelper

enhancement BP7BusinessOwnersLineEnhancement : entity.BP7BusinessOwnersLine {

  function syncAllCoverablesAndModifiers(helper : JobWizardHelper) {
    ProductModelSyncIssuesHandler.sync(this.AllCoverables, this.AllModifiables, null, this.Branch, helper)
  }

  property get AllBuildings() : BP7Building[] {
    return this.BP7Locations*.Buildings
  }
  
  property get AllClassifications() : BP7Classification[] {
    return AllBuildings*.Classifications
  }

  function theftOfClientPropertyAvailable() : boolean{
    return this.BP7EmployeeDishty.BP7Limit6Term.Value > 0
  }

  function dishonestMaliciousOrFraudulantActsCommittedByEmAvailable() : boolean {
    return this.BP7InformationSecurityProtectionEndorsementExists
  }

  function pciForDefenseExpensesAndFinesOrPenaltiesAvailable() : boolean {
    return this.BP7InformationSecurityProtectionEndorsement.BP7CovTierSelectTerm.OptionValue == "Tier1and2" or this.BP7InformationSecurityProtectionEndorsement.BP7CovTierSelectTerm.OptionValue == "Tier12and3"
  }

  function empBenefitsLiabCovAvailable() : boolean {
    return not this.BP7ExtddReportingPeriodEmpBenefitsLiabCovExists
  }

  function extddReportingPeriodEmpBenefitsLiabCovAvailable() : boolean {
    return not this.BP7EmpBenefitsLiabCovExists
  }

  function fungiBacteriaExclLiabilityAvailable() : boolean {
    return not this.BP7LimitedFungiBacteriaCovLiabilityExists
  }

  function limitedFungiBacteriaCovLiabilityAvailable() : boolean {
    return not this.BP7FungiBacteriaExclLiabilityExists
  }

  function pharmacistsAvailable() : boolean {
    return not this.BP7PharmacistsBroadCovExists
  }

  function pharmacistsBroadCovAvailable() : boolean {
    return not this.BP7PharmacistsExists
  }
  
  function createPolicyReviewRowTree() : RowTreeRootNode {
    var newRootNode : RowTreeRootNode
    newRootNode = new RowTreeRootNode({new BP7PolicyReviewTreeRow.BP7LineTreeRow(this)}
      , \ o -> {
         var row = o as BP7PolicyReviewTreeRow
         return row.Children
        }, \ a -> {
          var row = a as BP7PolicyReviewTreeRow
          return not row.StartCollapsed
        }
      )
    return newRootNode
  }

  property get AllCostsWindowMode() : List<BP7Cost> {
    return this.Costs.toList() as List<BP7Cost>
  }
  
  property get IRPM() : BigDecimal {
    var modifier = this.Modifiers.firstWhere(\ m -> m.Pattern == "BP7IRPM")
    return modifier != null ? modifier.RateModifier : BigDecimal.ZERO
  }

  property get IRPMPercentage() : BigDecimal {
    return IRPM * 100
  }
  
  property get IRPMAppliesYesNo() : String {
    return new Boolean(this.IRPM != BigDecimal.ZERO).toYesNoString()
  }

  // Blankets related functions

  function createAndAddBlanket() : BP7Blanket {
    var blanket = new BP7Blanket(this.Branch)
    blanket.BlanketLimit = 0
    this.addToBlankets(blanket)
    initializeNumberingOfBlankets(this.Bundle)
    this.BlanketAutoNumberSeq.number(blanket, this.Blankets, BlanketNumberPropInfo)
    return blanket
  }

  function removeBlanket(blanket : BP7Blanket){
    this.removeFromBlankets(blanket)
    this.renumberBlankets()
  }

  function initializeNumberingOfBlankets(bundle : Bundle) {
    if (this.BlanketAutoNumberSeq == null) {
      this.BlanketAutoNumberSeq = new AutoNumberSequence(bundle)
    }
  }

  function bindNumberingOfBlankets() {
    this.renumberBlankets()
    this.BlanketAutoNumberSeq.bind(this.Blankets, BlanketNumberPropInfo)
  }

  function renumberBlankets() {
    initializeNumberingOfBlankets(this.Bundle)
    this.BlanketAutoNumberSeq.renumber(this.Blankets, BlanketNumberPropInfo)
  }

  function renumberNewBlankets() {
    initializeNumberingOfBlankets(this.Bundle)
    this.BlanketAutoNumberSeq.renumberNewBeans(this.Blankets, BlanketNumberPropInfo)
  }

  function refreshBlanketLimits() {
    this.Blankets.each(\ blanket ->blanket.refreshLimit())
  }

  private property get BlanketNumberPropInfo() : IPropertyInfo {
    return BP7Blanket.Type.TypeInfo.getProperty("BlanketNumber")
  }

  property get AllBlankets() : BP7Blanket[] {
    return this.Blankets
  }

  property get AllBlanketBuildings() : BP7Building[] {
    return AllBlankets*.BuildingCoverages*.Building
  }

  property get AllBlanketClassifications() : BP7Classification[] {
    return AllBlankets*.ClassificationCoverages*.Classification
  }

  property get BlanketEligibleBuildingCoverages() : BP7Structure[] {
    return AllBuildings
        .where(\ building -> building.BlanketEligible and
            not AllBlanketBuildings.contains(building))
        .map(\ building -> building.BP7Structure)
  }

  property get BlanketEligibleClassificationCoverages() : BP7ClassificationBusinessPersonalProperty[] {
    return AllClassifications
        .where(\ classification -> classification.BlanketEligible and
            not AllBlanketClassifications.contains(classification) )
        .map(\ classification -> classification.BP7ClassificationBusinessPersonalProperty)
  }

  property get AllEligibleCoveragesCount() : int {
    return BlanketEligibleBuildingCoverages.Count + BlanketEligibleClassificationCoverages.Count
  }

  function addNewAdditionalInsuredOfContactType(contactType : ContactType) : PolicyAddlInsured {
    var acctContact = this.Branch.Policy.Account.addNewAccountContactOfType(contactType)
    acctContact.addNewRole("AdditionalInsured")
    var policyAdditionalInsured = this.addNewAdditionalInsured(acctContact.Contact)
    return policyAdditionalInsured
  }
}
