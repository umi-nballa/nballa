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
  }
}
