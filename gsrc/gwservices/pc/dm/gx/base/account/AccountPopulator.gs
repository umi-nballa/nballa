package gwservices.pc.dm.gx.base.account

uses gw.api.database.Query
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.account.accountmodel.Account
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class AccountPopulator extends BaseEntityPopulator<entity.Account, KeyableBean> {
  /* Logging prefix */
  private static final var _LOG_TAG = "${AccountPopulator.Type.RelativeName} - "
  override function findEntity(model: XmlElement, parent: KeyableBean, bundle: Bundle): entity.Account {
    var existing = super.findEntity(model, parent, bundle)
    // Also try to find an existing account based on associated policy numbers.
    // If the carrier doesn't have the concept of accounts, they can attach policies here.
    if (existing == null and model typeis Account) {
      var legacyPolicyNumbers = model.MigrationAccountInfo_Ext.LegacyPolicies.Entry*.PolicyNumber
      if (legacyPolicyNumbers.HasElements) {
        var legacyPolicyQuery = Query.make(MigrationLegacyPolicy_Ext)
        var policies = legacyPolicyQuery.compareIn(MigrationLegacyPolicy_Ext#PolicyNumber, legacyPolicyNumbers).select()
        if (policies.HasElements) {
          existing = policies.FirstResult.MigrationInfo.Account
          if (existing != null) {
            existing = bundle.add(existing)
          }
        }
      }
    }
    if (existing != null) {
      CachedItems.put(BaseEntityPopulator.ACCOUNT_PROPERTY, existing)
    }
    return existing
  }

  override function create(model: XmlElement, parent: KeyableBean, bundle: Bundle): entity.Account {
    var account = super.create(model, parent, bundle)
    if (account != null) {
      CachedItems.put(BaseEntityPopulator.ACCOUNT_PROPERTY, account)
    }
    return account
  }

  override function validate(model: XmlElement) {
    var accountXML = model as gwservices.pc.dm.gx.base.account.accountmodel.Account
    if (isNull(accountXML.AccountHolderContact)) {
      var msg = "account holder is null"
      throw new DataMigrationNonFatalException(CODE.MISSING_ACCOUNT_HOLDER, msg)
    }
  }

  override function finish(model: XmlElement, parent: KeyableBean, theAccount: entity.Account) {
    // add the account holder property, if necessary
    var theAccountHolderContact = theAccount.AccountHolderContact
    var theAccountContact = theAccount.AccountContacts.firstWhere(\elt -> elt.Contact == theAccountHolderContact)
    if (theAccountContact == null) {
      theAccountContact = new AccountContact()
      theAccount.addToAccountContacts(theAccountContact)
      theAccountContact.Contact = theAccountHolderContact
    }
    var theAccountHolder = theAccount.AccountHolder
    if (theAccountHolder == null or theAccountHolder.AccountContact != theAccountContact) {
      theAccountHolder = new AccountHolder()
      theAccountContact.addToRoles(theAccountHolder)
      theAccount.updateAccountHolderContact()
    }
  }
}