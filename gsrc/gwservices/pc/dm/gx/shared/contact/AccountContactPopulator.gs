package gwservices.pc.dm.gx.shared.contact

uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_AccountContacts_Entry
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator
uses gwservices.pc.dm.gx.shared.contact.accountcontactrolemodel.anonymous.elements.AccountContactRole_AccountContact

class AccountContactPopulator extends BaseEntityPopulator<AccountContact, KeyableBean> {
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): AccountContact {
    var contact: Contact
    if (model typeis AccountContactRole_AccountContact) {
      contact = findById(model.Contact, Contact, bundle) as Contact
    }
    if (model typeis Account_AccountContacts_Entry) {
      contact = findById(model.Contact, Contact, bundle) as Contact
    }
    var accountContacts = WorkingAccount.AccountContacts
    var accountContact = accountContacts.firstWhere(\ac -> ac.Contact.PublicID == contact.PublicID)
    if (accountContact != null) return accountContact
    return super.findEntity(model, parent, bundle)
  }

  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): AccountContact {
    if (model typeis AccountContactRole_AccountContact) {
      var contact = findById(model.Contact, Contact, bundle) as Contact
      return WorkingAccount.addNewAccountContactForContact(contact)
    }
    if (model typeis Account_AccountContacts_Entry) {
      return super.create(model, parent, bundle)
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_MODEL, typeof(model) as String)
  }

  override function finish(model: XmlElement, parent: KeyableBean, child: AccountContact) {
    if (model typeis Account_AccountContacts_Entry and WorkingAccount.LinkContacts) {
      child.markContactForAutoSync();
    }
  }
}