package gwservices.pc.dm.gx.base.policy

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_AllContacts
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Job
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_Policy
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PolicyContactRoles
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PolicyLocations
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PolicyTerm
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_UWCompany
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gw.pl.currency.MonetaryAmount
uses una.integration.plugins.numbergeneration.PolicyNumGenPluginImpl
uses gw.policy.PolicyPeriodValidation
uses gw.api.web.productmodel.MissingRequiredCoverageIssue
uses gw.api.web.productmodel.MissingRequiredConditionIssue
uses gw.api.web.productmodel.MissingRequiredExclusionIssue
uses gw.api.web.productmodel.MissingCovTermIssue
uses gw.api.web.productmodel.ProductModelSyncIssue
uses java.util.ArrayList

class PolicyPeriodPopulator extends BaseEntityPopulator<PolicyPeriod, KeyableBean> {
  /* Logging prefix */
  private static final var _LOG_TAG = "${PolicyPeriodPopulator.Type.RelativeName} - "
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): PolicyPeriod {
    var branch = Branch
    // some locations are automatically created on new terms from the account
    // fix consistency check error
    var newLocations = bundle.InsertedBeans.where(\ib -> ib typeis PolicyLocation) as List<PolicyLocation>
    newLocations.each(\pl -> branch.removeFromPolicyLocations(pl))
    return branch
  }

  override function sortChildrenForPopulation(children: List <XmlElement>): List <XmlElement> {
    var sorted = children.orderBy(\child -> {
      switch (typeof(child)) {
        case PolicyPeriod_Job: return 1
        case PolicyPeriod_Policy: return 2
        case PolicyPeriod_UWCompany: return 3
        case PolicyPeriod_PolicyTerm: return 4
        case PolicyPeriod_PolicyLocations: return 5
        case PolicyPeriod_AllContacts: return 6
        case PolicyPeriod_PolicyContactRoles: return 7
          default: return 10
      }
    })
    if (_logger.DebugEnabled) {
      for (sort in sorted) {
        _logger.debug(_LOG_TAG + "sortChildrenForPopulation sorted item " + sort)
      }
    }
    return sorted
  }

  override function finish(model: XmlElement, parent: KeyableBean, child: PolicyPeriod) {
    for (pcr in child.PolicyContactRoles) {
      if (_logger.DebugEnabled) {
        _logger.debug(_LOG_TAG + "finish PolicyContactRole ID ${pcr.ID} PublicID ${pcr.PublicID}")
        _logger.debug(_LOG_TAG + "finish AccountContactRole PublicID ${pcr.AccountContactRole.PublicID}")
        _logger.debug(_LOG_TAG + "finish PolicyContactRole Type ${(typeof(pcr))}")
        _logger.debug(_LOG_TAG + "finish AccountContactRole Type ${(typeof(pcr.AccountContactRole))}")
        _logger.debug(_LOG_TAG + "finish AccountContact ${pcr.AccountContactRole.AccountContact}")
        _logger.debug(_LOG_TAG + "finish Account ${pcr.AccountContactRole.AccountContact.Account}")
      }
      if (pcr.AccountContactRole == null) {
        var msg = "entity type : ${typeof(pcr)}, id : ${pcr.PublicID}"
        throw new DataMigrationNonFatalException(CODE.MISSING_ACCOUNT_CONTACT_ROLE, msg)
      }
      if (pcr.AccountContactRole.AccountContact == null) {
        var msg = "entity type : ${typeof(pcr)}, id : ${pcr.PublicID}"
        throw new DataMigrationNonFatalException(CODE.MISSING_ACCOUNT_CONTACT, msg)
      }
      if (pcr.AccountContactRole.AccountContact.Account == null) {
        var msg = "entity type : ${typeof(pcr)}, id : ${pcr.PublicID}"
        throw new DataMigrationNonFatalException(CODE.MISSING_ACCOUNT, msg)
      }
    }

    //Populate Account to Notes
    for (notes in child.Notes){
      notes.Account = child.Policy.Account
      // Data Consistency: Notes attached ot a policy Period must also be attached to a job,
      // notes attached to a job must also be attached to a policy
      notes.Job = child.Job
      notes.Policy = child.Policy
      _logger.debug("assigning account [${child.Policy.Account.AccountNumber}] to notes [${notes.PublicID}]")
    }
    //Populate Estimated Premium for Policy
    if(child.EstimatedPremium_amt != null && child.EstimatedPremium_amt != 0){
      var estimatedAmount = child.EstimatedPremium_amt
      var EstimatedPremium = new MonetaryAmount(estimatedAmount, Currency.TC_USD)
      child.EstimatedPremium = EstimatedPremium
    }
    // Need to override policy number
    var policyNumber: String;
    var plugin = new PolicyNumGenPluginImpl();
    policyNumber = plugin.genNewPeriodPolicyNumber(child)
    if (child typeis PolicyPeriod){
        child.PolicyNumber = policyNumber
    }
    // fix product model issues
    var productModelIssues = getProductModelIssues(child)
    productModelIssues.each( \ elt -> elt.fixIssue(child.Bundle))
    //fix missing questions answers
     var missingQuestionIssues = child.checkAnswersAgainstProductModel()
     missingQuestionIssues.each( \ elt -> {
       elt.fixIssue(child.Bundle)
     })
    // update billing frequency
    child.NewInvoiceStream.Interval = child.SelectedPaymentPlan.InvoiceFrequency
    child.SourceSystem_Ext = typekey.SourceSystem_Ext.TC_LEGACY
    child.PolicyLocations.each(\ elt -> {
      elt.AccountLocation.addressScrub_Ext = true
    })
    var policyPeriodValidationResult = PolicyPeriodValidation.validatePeriod(child, typekey.ValidationLevel.TC_READYFORISSUE)
     var addressValidationErrors = verifyAddressValidationDetails(child)
    var allErrors = policyPeriodValidationResult.EntityValidations.ErrorMessages.toList().concat(addressValidationErrors)
    if (!addressValidationErrors.Empty || !policyPeriodValidationResult.EntityValidations.IsEmpty) {
      throw new DataMigrationNonFatalException(MISSING_OR_INVALID_DATA, allErrors as String [])
    }
}

  private function getProductModelIssues(policyPeriod : PolicyPeriod) : List<ProductModelSyncIssue> {
    var issues = new ArrayList<ProductModelSyncIssue>()
    var lines = policyPeriod.Lines
    for (line in lines) {
      for (c in line.AllCoverables) {
        var coverageIssues = c.checkCoveragesAgainstProductModelwLine(line)
        var requiredMissingCoverageIssues = coverageIssues.where( \ elt -> elt typeis MissingRequiredCoverageIssue)
        var requiredMissingCovTermIssues = coverageIssues.where( \ elt -> elt typeis MissingCovTermIssue)
        var conditionsIssues = c.checkConditionsAgainstProductModelwLine(line)
        var requiredMissingConditionIssues = conditionsIssues.where( \ elt -> elt typeis MissingRequiredConditionIssue)
        var exclusionsIssues = c.checkExclusionsAgainstProductModelwLine(line)
        var requiredMissingExclusionIssues = exclusionsIssues.where( \ elt -> elt typeis MissingRequiredExclusionIssue)
        issues.addAll(requiredMissingCoverageIssues)
        issues.addAll(requiredMissingCovTermIssues)
        issues.addAll(requiredMissingConditionIssues)
        issues.addAll(requiredMissingExclusionIssues)
      }
    }
    return issues
  }

  private function verifyAddressValidationDetails(policyPeriod : PolicyPeriod) : List<String> {
    var errorMessages = new List<String>()
    if (policyPeriod.HomeownersLine_HOEExists) {
      if (policyPeriod.BaseState == typekey.Jurisdiction.TC_CA) {
        if ((policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHaz_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHazMatchLevel_Ext == null) and
            (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.FirelineAdjHazOverridden_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideFirelineAdjHaz_Ext)) {
          errorMessages.add("HOLocation: Fireline Adjusted Hazard Score is missing")
        }
        if ((policyPeriod.HomeownersLine_HOE.Dwelling.EarthquakeTer_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.EarthquakeTerMatchLevel_Ext == null) and
            (policyPeriod.HomeownersLine_HOE.Dwelling.EarthquakeTerOverridden_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.OverrideEarthquakeTer_Ext)) {
          errorMessages.add("Dwelling: Earthquake Territory Zone is missing")
        }
      }
      if ((policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEG_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEGMatchLevel_Ext == null) and
          (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.BCEGOverridden_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideBCEG_Ext)) {
        errorMessages.add("HOLocation: BCEG is missing")
      }
      if ((policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.TerritoryCodeTunaReturned_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.TerritoryCodeMatchLevel_Ext == null) and
          (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.TerritoryCodeOverridden_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideTerritoryCode_Ext)) {
        errorMessages.add("HOLocation: Territory code is missing")
      }
      if ((policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingProtectionClasscode == null || policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingPCCodeMatchLevel_Ext == null) and
          (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DwellingPCCodeOverridden_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.OverrideDwellingPCCode_Ext)) {
        errorMessages.add("HOLocation: Dwelling Protection Class code is missing")
      }
      if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistanceToFireHydrant == null) {
        errorMessages.add("HOLocation: Distance to Fire Hydrant is missing")
      }
      if (policyPeriod.HomeownersLine_HOE.Dwelling.HOLocation.DistanceToFireStation == null) {
        errorMessages.add("HOLocation: Distance to fire station is missing")
      }
      if ((policyPeriod.HomeownersLine_HOE.Dwelling.YearBuilt == null || policyPeriod.HomeownersLine_HOE.Dwelling.YearbuiltMatchLevel_Ext == null) and
          (policyPeriod.HomeownersLine_HOE.Dwelling.OverrideYearbuilt_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.OverrideYearbuilt_Ext)) {
        errorMessages.add("Dwelling: Year built is missing")
      }
      if ((policyPeriod.HomeownersLine_HOE.Dwelling.SquareFootage_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.TotalSqFtValMatchLevel_Ext == null) and
          (policyPeriod.HomeownersLine_HOE.Dwelling.TotalSqFtValOverridden_Ext == null and policyPeriod.HomeownersLine_HOE.Dwelling.OverrideTotalSqFtVal_Ext)) {
        errorMessages.add("Dwelling: Square footage is missing")
      }
      if ((policyPeriod.HomeownersLine_HOE.Dwelling.PropFloodVal_Ext  == null || policyPeriod.HomeownersLine_HOE.Dwelling.PropFloodValMatchLevel_Ext == null) and
          (policyPeriod.HomeownersLine_HOE.Dwelling.PropFloodValOverridden_Ext == null || policyPeriod.HomeownersLine_HOE.Dwelling.OverridePropFloodVal_Ext)) {
        errorMessages.add("Dwelling: Flood Zone is missing")
      }
    }
    return errorMessages
  }
}
