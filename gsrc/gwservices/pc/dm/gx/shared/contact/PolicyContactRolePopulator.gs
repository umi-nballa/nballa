package gwservices.pc.dm.gx.shared.contact

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.policy.policyperiodmodel.anonymous.elements.PolicyPeriod_PolicyContactRoles_Entry
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.shared.contact.addlinterestdetailmodel.anonymous.elements.AddlInterestDetail_PolicyAddlInterest
uses gwservices.pc.dm.gx.shared.contact.policycontactrolemodel.anonymous.elements.PolicyContactRole_AccountContactRole


class PolicyContactRolePopulator extends BaseEntityPopulator<PolicyContactRole,KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): PolicyContactRole {
    var pcr: PolicyContactRole = null
    if (model typeis PolicyPeriod_PolicyContactRoles_Entry) {
      // PolicyCenter creates some roles internally, so we need to look them up from the type
      pcr = findExistingPolicyContactRole(Branch, model.Subtype, model.AccountContactRole)
    } else if (model typeis AddlInterestDetail_PolicyAddlInterest) {
      pcr = findExistingPolicyContactRole(Branch, model.Subtype, model.AccountContactRole)
    }
    if (pcr != null) return pcr
    return super.findEntity(model, parent, bundle)
  }

  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): PolicyContactRole {
    // if contacts are created in the policy contact roles, the body of this function will need to be move into the
    // "addParent" function. otherwise, they should be created in AllContacts
    var acr: PolicyContactRole_AccountContactRole
    var subtype: typekey.PolicyContactRole
    if (model typeis PolicyPeriod_PolicyContactRoles_Entry and parent typeis PolicyPeriod) {
      acr = model.AccountContactRole
      subtype = model.Subtype
    } else if (model typeis AddlInterestDetail_PolicyAddlInterest and parent typeis HODwellingAddlInt_HOE) {
      acr = model.AccountContactRole
      subtype = model.Subtype
    } else {
      throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
    }
    var branch = Branch
    var pcr = findExistingPolicyContactRole(branch, subtype, acr)
    if (pcr == null) {
      var contact = findById(acr.AccountContact.Contact, Contact, branch.Bundle) as Contact
      /*var person = new Person()
      person.FirstName = acr.AccountContact.Contact.entity_Person.FirstName
      person.DateOfBirth = acr.AccountContact.Contact.entity_Person.DateOfBirth*/
      if (subtype == "PolicyAddlInsured") {
        pcr = branch.HomeownersLine_HOE.addNewAdditionalInsured(contact)
      } else {
        pcr = branch.addNewPolicyContactRoleForContact(contact, subtype)
      }
    }
    return pcr
  }

  override function addToParent(parent: KeyableBean, child: PolicyContactRole, name: String, childModel: XmlElement) {
    // should be added as part of create function
  }

  override function finish(model: XmlElement, parent: KeyableBean, child: PolicyContactRole) {
    if (parent typeis HODwellingAddlInt_HOE) {
      parent.PolicyAddlInterest = child as PolicyAddlInterest
    }
    else if (child typeis PolicyAddlInterest) {
      var additionalInterest = child.AccountContactRole as AdditionalInterest
    }
  }

  /**
   * Convenience
   */
  private function findExistingPolicyContactRole(period: PolicyPeriod, subtype: typekey.PolicyContactRole,
                                                 acr: PolicyContactRole_AccountContactRole): PolicyContactRole {
    var pcrs = period.PolicyContactRoles.where(\pcr -> pcr.Subtype == subtype)
    var contactPubID = acr.AccountContact.Contact.PublicID
    return pcrs.firstWhere(\pcr -> pcr.AccountContactRole.AccountContact.Contact.PublicID == contactPubID)
  }
}