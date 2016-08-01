package gwservices.pc.dm.gx.shared.producer

uses gw.api.database.Query
uses gw.pl.persistence.core.Bundle
uses gw.xml.XmlElement
uses gwservices.pc.dm.batch.DataMigrationNonFatalException
uses gwservices.pc.dm.batch.DataMigrationNonFatalException.CODE
uses gwservices.pc.dm.gx.base.account.accountmodel.anonymous.elements.Account_ProducerCodes_Entry
uses gwservices.pc.dm.gx.entitypopulators.BaseEntityPopulator

class AccountProducerCodePopulator extends BaseEntityPopulator<AccountProducerCode, Account> {
  override function create(model: XmlElement, parent: Account, bundle: Bundle): AccountProducerCode {
    if (model typeis Account_ProducerCodes_Entry) {
      var code = model.ProducerCode.Code
      var lookupCode = Query.make(ProducerCode).compare(ProducerCode#Code, Equals, code).select().AtMostOneRow
      if (lookupCode == null) throw new DataMigrationNonFatalException(CODE.MISSING_PRODUCER, code)
      parent.addProducerCode(lookupCode)
      return parent.ProducerCodes.firstWhere(\pc -> pc.ProducerCode.Code == code)
    }
    throw new DataMigrationNonFatalException(CODE.UNSUPPORTED_PARENT, typeof(parent) as String)
  }

  override function addToParent(parent: Account, child: AccountProducerCode, name: String, childModel: XmlElement) {
    // already done
  }
}
